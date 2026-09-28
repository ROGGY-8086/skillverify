import sys
import os
import pandas as pd
import math

sys.path.insert(0, '.')
from database import engine, SessionLocal, Base
from models import User, CandidateProfile, CandidateSkill, Credential, EmployerProfile, Job, JobSkill, Assessment, AssessmentResult
from auth import hash_password
from services.skill_taxonomy import normalize_skill
from datetime import datetime

data_dir = os.path.join(os.path.dirname(__file__), 'data')

def parse_int_id(id_str):
    if pd.isna(id_str): return None
    digits = ''.join(filter(str.isdigit, str(id_str)))
    return int(digits) if digits else None

def seed():
    print("Dropping and recreating database tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    password = hash_password('password123')

    # Load Candidates
    print("Loading Candidates...")
    candidates_df = pd.read_csv(os.path.join(data_dir, 'candidates.csv'))
    for idx, row in candidates_df.iterrows():
        c_id = parse_int_id(row['candidate_id'])
        user = User(
            id=c_id,
            email=f"candidate{c_id}@example.com",
            password_hash=password,
            role="candidate",
            name=row['full_name'],
            created_at=datetime.utcnow()
        )
        db.add(user)
        
        profile = CandidateProfile(
            id=c_id,
            user_id=c_id,
            headline=row.get('target_role_family', ''),
            education=str(row.get('degree', '')) + " in " + str(row.get('branch', '')),
            experience_years=int(float(row.get('experience_years', 0) if not pd.isna(row.get('experience_years')) else 0)),
            location=row.get('city', ''),
        )
        db.add(profile)
    db.commit()

    # Load Employers
    print("Loading Employers...")
    employers_df = pd.read_csv(os.path.join(data_dir, 'employers.csv'))
    for idx, row in employers_df.iterrows():
        e_id = parse_int_id(row['employer_id'])
        user_id = e_id + 10000 # offset to avoid clash
        user = User(
            id=user_id,
            email=f"employer{e_id}@example.com",
            password_hash=password,
            role="employer",
            name=row['company'],
            created_at=datetime.utcnow()
        )
        db.add(user)
        profile = EmployerProfile(
            id=e_id,
            user_id=user_id,
            company_name=row['company'],
            industry=row.get('industry', ''),
            company_size=row.get('size', '')
        )
        db.add(profile)
    db.commit()

    # Load Jobs
    print("Loading Jobs...")
    jobs_df = pd.read_csv(os.path.join(data_dir, 'jobs.csv'))
    for idx, row in jobs_df.iterrows():
        j_id = parse_int_id(row['job_id'])
        e_id = parse_int_id(row['employer_id'])
        job = Job(
            id=j_id,
            employer_id=e_id,
            title=row['title'],
            description=row.get('job_description', ''),
            location=row.get('location', ''),
            salary_min=int(float(row.get('salary_min_lpa', 0) if not pd.isna(row.get('salary_min_lpa')) else 0) * 100000),
            salary_max=int(float(row.get('salary_max_lpa', 0) if not pd.isna(row.get('salary_max_lpa')) else 0) * 100000),
            employment_type=row.get('employment_type', 'full-time'),
            experience_required=int(float(row.get('min_experience_years', 0) if not pd.isna(row.get('min_experience_years')) else 0)),
            education_required=row.get('min_education', ''),
            is_active=True
        )
        db.add(job)
    db.commit()

    # Load Job Skills
    print("Loading Job Skills...")
    job_skills_df = pd.read_csv(os.path.join(data_dir, 'job_skills.csv'))
    for idx, row in job_skills_df.iterrows():
        j_id = parse_int_id(row['job_id'])
        skill_name = str(row['skill'])
        norm = normalize_skill(skill_name) or skill_name
        is_req = row['requirement_type'] == 'required'
        min_level = "intermediate"
        lvl_num = row.get('min_level_num', 2)
        if lvl_num == 1: min_level = "basic"
        elif lvl_num == 3: min_level = "advanced"
        
        db.add(JobSkill(
            job_id=j_id,
            skill_name=skill_name,
            normalized_skill=norm,
            is_required=is_req,
            min_proficiency=min_level
        ))
    db.commit()

    # Load Candidate Skills
    print("Loading Candidate Skills...")
    if os.path.exists(os.path.join(data_dir, 'candidate_skills.csv')):
        cskills_df = pd.read_csv(os.path.join(data_dir, 'candidate_skills.csv'))
        for idx, row in cskills_df.iterrows():
            c_id = parse_int_id(row['candidate_id'])
            skill_name = str(row['skill'])
            norm = normalize_skill(skill_name) or skill_name
            lvl_num = row.get('level_num', 2)
            prof = "intermediate"
            if lvl_num == 1: prof = "basic"
            elif lvl_num == 3: prof = "advanced"
            
            evidence_type = "resume"
            # Set verified flag based on evidence_level
            db.add(CandidateSkill(
                candidate_id=c_id,
                skill_name=skill_name,
                normalized_skill=norm,
                proficiency_level=prof,
                confidence_score=float(row.get('confidence', 0.5)),
                evidence_type=evidence_type,
                verified=(float(row.get('confidence', 0.5)) > 0.8)
            ))
        db.commit()

    # Load Credentials
    print("Loading Credentials...")
    creds_df = pd.read_csv(os.path.join(data_dir, 'credentials.csv'))
    for idx, row in creds_df.iterrows():
        c_id = parse_int_id(row['candidate_id'])
        db.add(Credential(
            candidate_id=c_id,
            title=row.get('title', 'Certificate'),
            issuer=row.get('issuer_id', 'Unknown'),
            credential_id_value=row['credential_id'],
            status=row.get('status', 'pending').lower(),
        ))
    db.commit()

    # Load Assessments
    if os.path.exists(os.path.join(data_dir, 'assessments.csv')):
        print("Loading Assessments...")
        ass_df = pd.read_csv(os.path.join(data_dir, 'assessments.csv'))
        for idx, row in ass_df.iterrows():
            c_id = parse_int_id(row['candidate_id'])
            score = float(row.get('score_pct', 0))
            level = "basic"
            if score > 70: level = "advanced"
            elif score > 40: level = "intermediate"
            db.add(AssessmentResult(
                candidate_id=c_id,
                skill_name=row['skill'],
                score=score,
                level=level
            ))
        db.commit()

    print("Database seeded successfully with massive synthetic dataset!")

if __name__ == '__main__':
    seed()
