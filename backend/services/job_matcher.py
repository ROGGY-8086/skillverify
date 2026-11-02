from typing import List, Dict, Any, Optional, Set
import re

PROFICIENCY_LEVELS = {
    "basic": 1,
    "intermediate": 2,
    "advanced": 3
}

def get_skill_keys(skill_name: Optional[str], normalized_skill: Optional[str] = None) -> Set[str]:
    """
    Generate normalized match keys for a skill to handle case-insensitivity,
    whitespace differences, and minor formatting variations (hyphens, dots, slashes, etc.).
    """
    keys = set()
    for name in [skill_name, normalized_skill]:
        if not name:
            continue
        raw = str(name).strip().lower()
        if not raw:
            continue
        keys.add(raw)
        
        # Replace common symbol notations: 'c++' -> 'cpp', 'c#' -> 'csharp'
        trans = raw.replace('c++', 'cpp').replace('c#', 'csharp')
        keys.add(trans)
        
        # Alphanumeric only (strips dots, hyphens, spaces, underscores, slashes)
        # e.g., "node.js" -> "nodejs", "spring-boot" -> "springboot", "front-end" -> "frontend"
        alnum = re.sub(r'[^a-z0-9]', '', trans)
        if alnum:
            keys.add(alnum)
            
            # Framework variations:
            # reactjs -> react, vuejs -> vue, angularjs -> angular
            if len(alnum) > 2 and alnum.endswith('js') and alnum not in ('nodejs', 'nextjs'):
                keys.add(alnum[:-2])
            elif alnum == 'nodejs':
                keys.add('node')
            elif alnum == 'nextjs':
                keys.add('next')
                
            # Common abbreviations and aliases
            if alnum in ('javascript', 'js'):
                keys.add('javascript')
                keys.add('js')
            if alnum in ('typescript', 'ts'):
                keys.add('typescript')
                keys.add('ts')
            if 'postgres' in alnum:
                keys.add('postgres')
                keys.add('postgresql')
                
        # Spaced version (replace non-alphanumeric with a single space)
        spaced = re.sub(r'[^a-z0-9]+', ' ', trans).strip()
        if spaced:
            keys.add(spaced)
            
    return keys

def calculate_match_score(
    candidate_skills: List[Dict[str, Any]], 
    job_skills: List[Dict[str, Any]], 
    candidate_experience: int, 
    job_experience_required: int,
    candidate_education: Optional[str] = None, 
    job_education: Optional[str] = None,
    assessment_results: Optional[List[Dict[str, Any]]] = None
) -> Dict[str, Any]:
    """
    Calculate weighted match score between candidate and job.
    Uses case-insensitive and format-tolerant skill key matching.
    """
    score = 0.0
    
    matched_skills = []
    missing_skills = []
    
    cand_skills_map = {}
    for s in candidate_skills:
        keys = get_skill_keys(s.get('skill_name'), s.get('normalized_skill'))
        for k in keys:
            if k not in cand_skills_map:
                cand_skills_map[k] = s
    
    skills_score = 0.0
    proficiency_score = 0.0
    
    if job_skills:
        for req_skill in job_skills:
            req_keys = get_skill_keys(req_skill.get('skill_name'), req_skill.get('normalized_skill'))
            display_name = req_skill.get('skill_name') or req_skill.get('normalized_skill') or 'Skill'
            
            req_level_str = req_skill.get('min_proficiency', req_skill.get('required_level', 'basic'))
            req_level = PROFICIENCY_LEVELS.get(str(req_level_str).lower(), 1)
            
            cand_skill = None
            for k in req_keys:
                if k in cand_skills_map:
                    cand_skill = cand_skills_map[k]
                    break
                    
            if cand_skill:
                cand_level_str = cand_skill.get('proficiency_level', 'basic')
                cand_level = PROFICIENCY_LEVELS.get(str(cand_level_str).lower(), 1)
                
                skills_score += 1.0
                
                if cand_level >= req_level:
                    proficiency_score += 1.0
                else:
                    proficiency_score += (cand_level / req_level)
                    
                matched_skills.append(display_name)
            else:
                missing_skills.append(display_name)
                
        skills_score = (skills_score / len(job_skills)) * 40
        proficiency_score = (proficiency_score / len(job_skills)) * 20
        score += skills_score + proficiency_score
    else:
        score += 60.0
        
    # Experience Alignment (15%)
    if job_experience_required > 0:
        if candidate_experience >= job_experience_required:
            score += 15.0
        else:
            score += (candidate_experience / job_experience_required) * 15.0
    else:
        score += 15.0
    
    # Verified Credentials (10%)
    verified_count = sum(1 for s in candidate_skills if s.get('evidence_type') == 'credential')
    if verified_count >= 1:
        score += min(10.0, 5.0 + (verified_count * 2.5))
    
    # Education Match (5%)
    if job_education:
        if candidate_education and job_education.lower() in candidate_education.lower():
            score += 5.0
        elif candidate_education:
            score += 2.5
    else:
        score += 5.0
    
    # Assessment Scores (10%)
    if assessment_results:
        total_ass = sum((a.get('score', 0) / 100.0) * 10.0 for a in assessment_results)
        score += total_ass / len(assessment_results)
    
    final_score = min(100.0, max(0.0, score))
    
    explanation_parts = []
    if final_score > 80:
        explanation_parts.append("Strong match.")
    elif final_score > 60:
        explanation_parts.append("Good match.")
    else:
        explanation_parts.append("Moderate match.")
        
    total_required = len(job_skills) if job_skills else 0
    explanation_parts.append(f"You meet {len(matched_skills)} out of {total_required} required skills.")
    
    if missing_skills:
        explanation_parts.append(f"Missing: {', '.join(missing_skills[:3])}.")
    
    return {
        'match_score': round(final_score, 1),
        'skill_matches': matched_skills,
        'missing_skills': missing_skills,
        'explanation': " ".join(explanation_parts)
    }


def rank_candidates_for_job(job_id: int, db) -> List[Dict[str, Any]]:
    """Get all candidates ranked by match score for a specific job."""
    # Import here to avoid circular imports
    import models
    
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not job:
        return []
    
    job_skills_objs = db.query(models.JobSkill).filter(models.JobSkill.job_id == job_id).all()
    job_skills = [
        {
            'normalized_skill': js.normalized_skill,
            'skill_name': js.skill_name,
            'is_required': js.is_required,
            'min_proficiency': js.min_proficiency
        }
        for js in job_skills_objs
    ]
    
    candidates = db.query(models.CandidateProfile).all()
    results = []
    
    for candidate in candidates:
        cand_skills = db.query(models.CandidateSkill).filter(
            models.CandidateSkill.candidate_id == candidate.id
        ).all()
        cand_skills_list = [
            {
                'normalized_skill': cs.normalized_skill,
                'skill_name': cs.skill_name,
                'proficiency_level': cs.proficiency_level,
                'confidence_score': cs.confidence_score,
                'evidence_type': cs.evidence_type,
                'verified': cs.verified
            }
            for cs in cand_skills
        ]
        
        assessment_results = db.query(models.AssessmentResult).filter(
            models.AssessmentResult.candidate_id == candidate.id
        ).all()
        ass_list = [{'skill_name': a.skill_name, 'score': a.score, 'level': a.level} for a in assessment_results]
        
        match_result = calculate_match_score(
            candidate_skills=cand_skills_list,
            job_skills=job_skills,
            candidate_experience=candidate.experience_years or 0,
            job_experience_required=job.experience_required or 0,
            candidate_education=candidate.education,
            job_education=job.education_required,
            assessment_results=ass_list if ass_list else None
        )
        
        user = db.query(models.User).filter(models.User.id == candidate.user_id).first()
        
        results.append({
            'candidate_id': candidate.id,
            'job_id': job_id,
            'match_score': match_result['match_score'],
            'skill_matches': match_result['skill_matches'],
            'missing_skills': match_result['missing_skills'],
            'explanation': match_result['explanation'],
            'candidate_name': user.name if user else 'Unknown',
            'candidate_headline': candidate.headline or '',
        })
    
    results.sort(key=lambda x: x['match_score'], reverse=True)
    return results


def recommend_jobs_for_candidate(candidate_id: int, db, limit: int = 100) -> List[Dict[str, Any]]:
    """Get recommended jobs for a candidate ranked by match score.
    
    Only jobs with at least one matching skill with candidate's skills are returned.
    Jobs with zero matching skills are strictly excluded.
    """
    import models
    
    candidate = db.query(models.CandidateProfile).filter(
        models.CandidateProfile.id == candidate_id
    ).first()
    if not candidate:
        return []
    
    # 1. Fetch candidate's skills from their profile record
    cand_skills = db.query(models.CandidateSkill).filter(
        models.CandidateSkill.candidate_id == candidate_id
    ).all()
    
    # Do not display jobs if candidate has missing or empty skill information
    if not cand_skills:
        return []
    
    cand_skills_list = [
        {
            'normalized_skill': cs.normalized_skill,
            'skill_name': cs.skill_name,
            'proficiency_level': cs.proficiency_level,
            'confidence_score': cs.confidence_score,
            'evidence_type': cs.evidence_type,
            'verified': cs.verified
        }
        for cs in cand_skills
    ]
    
    assessment_results = db.query(models.AssessmentResult).filter(
        models.AssessmentResult.candidate_id == candidate_id
    ).all()
    ass_list = [{'skill_name': a.skill_name, 'score': a.score, 'level': a.level} for a in assessment_results]
    
    jobs = db.query(models.Job).filter(models.Job.is_active == True).all()
    results = []
    
    for job in jobs:
        # 2. Fetch required skills associated with this job posting
        job_skills_objs = db.query(models.JobSkill).filter(models.JobSkill.job_id == job.id).all()
        if not job_skills_objs:
            # Job has no required skills listed, cannot establish valid matching skills
            continue
            
        job_skills = [
            {
                'normalized_skill': js.normalized_skill,
                'skill_name': js.skill_name,
                'is_required': js.is_required,
                'min_proficiency': js.min_proficiency
            }
            for js in job_skills_objs
        ]
        
        # 3. Compare candidate's skills with job's required skills (case-insensitive & formatting-tolerant)
        match_result = calculate_match_score(
            candidate_skills=cand_skills_list,
            job_skills=job_skills,
            candidate_experience=candidate.experience_years or 0,
            job_experience_required=job.experience_required or 0,
            candidate_education=candidate.education,
            job_education=job.education_required,
            assessment_results=ass_list if ass_list else None
        )
        
        # 4 & 5. Display a job ONLY if candidate has at least one matching skill.
        # If candidate has zero matching skills with this job, completely exclude it.
        matched_skills = match_result.get('skill_matches') or []
        if len(matched_skills) == 0:
            continue
        
        employer = db.query(models.EmployerProfile).filter(
            models.EmployerProfile.id == job.employer_id
        ).first()

        skills_summary = [
            {
                'id': js.id,
                'skill_name': js.skill_name,
                'name': js.skill_name,
                'normalized_skill': js.normalized_skill,
                'is_required': js.is_required,
                'min_proficiency': js.min_proficiency,
                'proficiency': js.min_proficiency
            }
            for js in job_skills_objs
        ]
        
        results.append({
            'job_id': job.id,
            'match_score': match_result['match_score'],
            'skill_matches': matched_skills,
            'missing_skills': match_result['missing_skills'],
            'explanation': match_result['explanation'],
            'job_title': job.title,
            'title': job.title,
            'company_name': employer.company_name if employer else 'TechCorp Solutions',
            'company': employer.company_name if employer else 'TechCorp Solutions',
            'location': job.location or 'Remote',
            'employment_type': job.employment_type or 'Full-time',
            'salary_min': job.salary_min,
            'salary_max': job.salary_max,
            'skills': skills_summary,
            'job': {
                'id': job.id,
                'employer_id': job.employer_id,
                'title': job.title,
                'description': job.description,
                'location': job.location or 'Remote',
                'salary_min': job.salary_min,
                'salary_max': job.salary_max,
                'employment_type': job.employment_type or 'Full-time',
                'employmentType': job.employment_type or 'Full-time',
                'experience_required': job.experience_required,
                'education_required': job.education_required,
                'company': employer.company_name if employer else 'TechCorp Solutions',
                'company_name': employer.company_name if employer else 'TechCorp Solutions',
                'skills': skills_summary,
                'job_skills': skills_summary,
                'skill_matches': matched_skills,
                'missing_skills': match_result['missing_skills'],
                'match_score': match_result['match_score']
            }
        })
    
    results.sort(key=lambda x: x['match_score'], reverse=True)
    return results[:limit]


def analyze_skill_gap(candidate_id: int, job_id: int, db) -> Dict[str, Any]:
    """
    Analyze skill gap between candidate and target job.
    Uses case-insensitive and format-tolerant skill key matching.
    """
    import models
    
    candidate = db.query(models.CandidateProfile).filter(
        models.CandidateProfile.id == candidate_id
    ).first()
    
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not candidate or not job:
        return {
            'target_role': 'Unknown',
            'current_match': 0.0,
            'matched_skills': [],
            'missing_skills': [],
            'recommendations': []
        }
    
    cand_skills = db.query(models.CandidateSkill).filter(
        models.CandidateSkill.candidate_id == candidate_id
    ).all()
    cand_skills_map = {}
    for cs in cand_skills:
        keys = get_skill_keys(cs.skill_name, cs.normalized_skill)
        for k in keys:
            if k not in cand_skills_map:
                cand_skills_map[k] = cs
    
    job_skills = db.query(models.JobSkill).filter(models.JobSkill.job_id == job_id).all()
    
    matched = []
    missing = []
    recommendations = []
    
    for js in job_skills:
        req_keys = get_skill_keys(js.skill_name, js.normalized_skill)
        display_name = js.skill_name or js.normalized_skill or 'Skill'
        req_level = js.min_proficiency or 'basic'
        
        cs = None
        for k in req_keys:
            if k in cand_skills_map:
                cs = cand_skills_map[k]
                break
                
        if cs:
            matched.append(display_name)
            c_lvl = PROFICIENCY_LEVELS.get(str(cs.proficiency_level or 'basic').lower(), 1)
            r_lvl = PROFICIENCY_LEVELS.get(str(req_level).lower(), 1)
            if c_lvl < r_lvl:
                recommendations.append(f"Improve {display_name} proficiency to {req_level}")
        else:
            missing.append(display_name)
            recommendations.append(f"Learn {display_name}")
    
    match_percentage = 0.0
    if job_skills:
        match_percentage = (len(matched) / len(job_skills)) * 100.0
    
    if missing:
        recommendations.append(f"Consider taking assessments for skills you already know")
    
    return {
        'target_role': job.title,
        'current_match': round(match_percentage, 1),
        'matched_skills': matched,
        'missing_skills': missing,
        'recommendations': recommendations
    }
