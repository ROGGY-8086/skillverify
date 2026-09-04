import re
from typing import List, Dict, Any
from services.skill_taxonomy import normalize_skill, get_all_skills, ALIAS_MAP, SKILL_CATEGORIES

def determine_proficiency(text_context: str) -> str:
    """Determine proficiency level based on surrounding context."""
    text_context = text_context.lower()
    
    advanced_keywords = ['advanced', 'expert', 'senior', 'lead', 'architect', 'extensive', 'deep', 'master']
    intermediate_keywords = ['intermediate', 'proficient', 'experienced', 'solid', 'good', 'working knowledge']
    basic_keywords = ['basic', 'beginner', 'familiar', 'learning', 'exposure', 'junior', 'novice']
    
    for kw in advanced_keywords:
        if kw in text_context:
            return "advanced"
            
    for kw in basic_keywords:
        if kw in text_context:
            return "basic"
            
    for kw in intermediate_keywords:
        if kw in text_context:
            return "intermediate"
            
    return "intermediate" # Default

def calculate_confidence(evidence_type: str, mention_count: int) -> float:
    """Calculate confidence score based on evidence type and frequency."""
    base_scores = {
        "credential": 0.90,
        "assessment": 0.85,
        "project": 0.75,
        "resume": 0.50,
        "self-declared": 0.30
    }
    
    base = base_scores.get(evidence_type, 0.50)
    
    # Boost slightly for multiple mentions
    if mention_count > 1:
        boost = min(0.05, 0.01 * (mention_count - 1))
        base += boost
        
    return round(base, 2)

def extract_skills(text: str, evidence_type: str = "resume") -> List[Dict[str, Any]]:
    """
    Extract skills from text and return list of skill dictionaries.
    """
    text_lower = text.lower()
    extracted_skills_dict = {}
    
    # Build a list of all searchable terms (canonical and aliases)
    search_terms = []
    for skills in SKILL_CATEGORIES.values():
        search_terms.extend(skills)
    search_terms.extend(ALIAS_MAP.keys())
    
    # Sort by length descending to match longest terms first
    search_terms.sort(key=len, reverse=True)
    
    for term in search_terms:
        # Create a regex to match whole words/terms
        # Escape term to safely use in regex
        escaped_term = re.escape(term)
        # Using word boundaries, handling special chars like C++, C#
        if re.search(r'\w$', term):
            pattern = r'\b' + escaped_term + r'\b'
        else:
            pattern = r'\b' + escaped_term
            
        matches = list(re.finditer(pattern, text, re.IGNORECASE))
        
        if matches:
            mention_count = len(matches)
            canonical = normalize_skill(term)
            
            if not canonical:
                continue
                
            # Grab some context around the first match to determine proficiency
            first_match = matches[0]
            start = max(0, first_match.start() - 30)
            end = min(len(text), first_match.end() + 30)
            context = text[start:end]
            
            proficiency = determine_proficiency(context)
            confidence = calculate_confidence(evidence_type, mention_count)
            
            if canonical in extracted_skills_dict:
                # Update if new one has higher confidence
                if confidence > extracted_skills_dict[canonical]['confidence_score']:
                    extracted_skills_dict[canonical]['confidence_score'] = confidence
                    extracted_skills_dict[canonical]['evidence_type'] = evidence_type
                    extracted_skills_dict[canonical]['proficiency_level'] = proficiency
            else:
                extracted_skills_dict[canonical] = {
                    "skill_name": term,
                    "normalized_skill": canonical,
                    "proficiency_level": proficiency,
                    "confidence_score": confidence,
                    "evidence_type": evidence_type
                }
                
    # Convert to list and sort
    result = list(extracted_skills_dict.values())
    result.sort(key=lambda x: x['confidence_score'], reverse=True)
    return result

def extract_skills_from_sections(sections: Dict[str, str]) -> List[Dict[str, Any]]:
    """Extract skills from categorized resume sections with appropriate evidence types."""
    all_skills_dict = {}
    
    section_evidence_map = {
        'projects': 'project',
        'experience': 'resume',
        'skills': 'self-declared',
        'certifications': 'credential',
        'education': 'resume',
        'summary': 'self-declared'
    }
    
    for section_name, section_text in sections.items():
        if not section_text.strip():
            continue
            
        # Default to 'resume' if section not explicitly mapped
        evidence_type = section_evidence_map.get(section_name.lower(), 'resume')
        
        # In experience section, boost confidence slightly
        if section_name.lower() == 'experience':
             # The extract_skills function handles baseline, we could tweak it here
             pass
             
        extracted = extract_skills(section_text, evidence_type)
        
        for skill_data in extracted:
            norm = skill_data['normalized_skill']
            if norm in all_skills_dict:
                # Keep higher confidence
                if skill_data['confidence_score'] > all_skills_dict[norm]['confidence_score']:
                    all_skills_dict[norm] = skill_data
            else:
                all_skills_dict[norm] = skill_data
                
    result = list(all_skills_dict.values())
    result.sort(key=lambda x: x['confidence_score'], reverse=True)
    return result
