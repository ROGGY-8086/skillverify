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

    # Seed primary demo candidate: rahul@example.com
    print("Seeding demo candidate (rahul@example.com)...")
    rahul = User(
        email="rahul@example.com",
        password_hash=password,
        role="candidate",
        name="Rahul Sharma",
        created_at=datetime.utcnow()
    )
    db.add(rahul)
    db.commit()
    db.refresh(rahul)
    rahul_profile = CandidateProfile(
        user_id=rahul.id,
        headline="Full Stack & Backend Developer",
        education="B.Tech in Computer Science",
        experience_years=3,
        location="Mumbai, India",
        bio="Experienced software engineer with expertise in Java, Spring Boot, Python, SQL, and React."
    )
    db.add(rahul_profile)
    db.commit()
    db.refresh(rahul_profile)

    for s_name, prof, conf in [
        ("Java", "advanced", 0.95),
        ("Python", "intermediate", 0.85),
        ("JavaScript", "advanced", 0.85),
        ("Communication", "intermediate", 0.85),
        ("Problem Solving", "advanced", 0.90),
        ("Teamwork", "advanced", 0.90),
        ("Leadership", "intermediate", 0.80),
        ("Spring Boot", "advanced", 0.90),
        ("SQL", "intermediate", 0.85),
        ("React", "intermediate", 0.75)
    ]:
        db.add(CandidateSkill(
            candidate_id=rahul_profile.id,
            skill_name=s_name,
            normalized_skill=normalize_skill(s_name) or s_name,
            proficiency_level=prof,
            confidence_score=conf,
            evidence_type="credential",
            verified=True
        ))
    db.commit()

    # Seed primary demo employer: hr@techcorp.com
    print("Seeding demo employer (hr@techcorp.com)...")
    techcorp_hr = User(
        email="hr@techcorp.com",
        password_hash=password,
        role="employer",
        name="TechCorp HR",
        created_at=datetime.utcnow()
    )
    db.add(techcorp_hr)
    db.commit()
    db.refresh(techcorp_hr)
    db.add(EmployerProfile(
        user_id=techcorp_hr.id,
        company_name="TechCorp Solutions",
        industry="Technology & Services",
        company_size="500-1000",
        description="Global enterprise software and cloud consultancy solutions."
    ))
    db.commit()

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

    # Seed Multi-Skill Demo Jobs
    print("Seeding multi-skill demo jobs...")
    multi_skill_jobs = [
        {
            'employer_id': 2,
            'title': 'Computer Vision & AI Research Engineer',
            'description': 'Develop state-of-the-art vision models, OpenCV image processing pipelines, and production machine learning architectures.',
            'location': 'Bangalore (Hybrid)',
            'salary_min': 1400000,
            'salary_max': 2400000,
            'employment_type': 'full-time',
            'experience_required': 2,
            'education_required': 'B.Tech or M.Tech in CS/AI',
            'skills': [
                ('Python', 'advanced', True),
                ('OpenCV', 'advanced', True),
                ('Machine Learning', 'advanced', True),
                ('TensorFlow', 'intermediate', True),
                ('Data Analysis', 'intermediate', False)
            ]
        },
        {
            'employer_id': 2,
            'title': 'Senior Data & BI Analytics Consultant',
            'description': 'Lead enterprise dashboarding, statistical modeling, and data warehouse queries using SQL, Power BI, Python, and Pandas.',
            'location': 'Mumbai (Remote)',
            'salary_min': 1200000,
            'salary_max': 2000000,
            'employment_type': 'full-time',
            'experience_required': 2,
            'education_required': 'Bachelor in Engineering/Statistics',
            'skills': [
                ('SQL', 'advanced', True),
                ('Power BI', 'advanced', True),
                ('Python', 'intermediate', True),
                ('Pandas', 'intermediate', True),
                ('Data Analysis', 'advanced', True),
                ('MySQL', 'intermediate', False)
            ]
        },
        {
            'employer_id': 1,
            'title': 'High-Performance C++ Systems Engineer',
            'description': 'Design ultra-low latency backend systems and embedded data engines in C++ and C with optimized database storage.',
            'location': 'Pune (On-site)',
            'salary_min': 1500000,
            'salary_max': 2600000,
            'employment_type': 'full-time',
            'experience_required': 3,
            'education_required': 'B.Tech in Computer Science or ECE',
            'skills': [
                ('C++', 'advanced', True),
                ('C', 'advanced', True),
                ('SQL', 'intermediate', True),
                ('Problem Solving', 'advanced', True),
                ('SQLite', 'basic', False)
            ]
        },
        {
            'employer_id': 1,
            'title': 'Full Stack MERN Lead Engineer',
            'description': 'Architect enterprise cloud web applications leveraging React, Node.js, MongoDB, JavaScript, and modern microservices.',
            'location': 'Bangalore (Remote)',
            'salary_min': 1600000,
            'salary_max': 2800000,
            'employment_type': 'full-time',
            'experience_required': 3,
            'education_required': 'Bachelor in Computer Science',
            'skills': [
                ('React', 'advanced', True),
                ('Node.js', 'advanced', True),
                ('MongoDB', 'advanced', True),
                ('JavaScript', 'advanced', True),
                ('Problem Solving', 'intermediate', False)
            ]
        },
        {
            'employer_id': 3,
            'title': 'Cloud DevOps & Infrastructure Specialist',
            'description': 'Automate cloud deployment pipelines, multi-cluster Kubernetes orchestration, AWS cloud infrastructure, and Dockerized microservices.',
            'location': 'Hyderabad (Hybrid)',
            'salary_min': 1800000,
            'salary_max': 3000000,
            'employment_type': 'full-time',
            'experience_required': 3,
            'education_required': 'Bachelor in CS/IT',
            'skills': [
                ('Docker', 'advanced', True),
                ('Kubernetes', 'advanced', True),
                ('AWS', 'advanced', True),
                ('Python', 'intermediate', True),
                ('Communication', 'intermediate', False)
            ]
        },
        {
            'employer_id': 1,
            'title': 'Senior Java & Microservices Developer',
            'description': 'Build high-throughput backend APIs and banking microservices with Java, Spring Boot, MySQL, and Docker.',
            'location': 'Gurgaon (Hybrid)',
            'salary_min': 1400000,
            'salary_max': 2500000,
            'employment_type': 'full-time',
            'experience_required': 3,
            'education_required': 'B.E. / B.Tech in Computer Science',
            'skills': [
                ('Java', 'advanced', True),
                ('Spring Boot', 'advanced', True),
                ('MySQL', 'intermediate', True),
                ('SQL', 'advanced', True),
                ('Docker', 'intermediate', False)
            ]
        },
        {
            'employer_id': 2,
            'title': 'Lead Data Pipeline & ETL Engineer',
            'description': 'Create large-scale data ingestion and transformation pipelines using Python, SQL, Pandas, MySQL, and MongoDB.',
            'location': 'Pune (Hybrid)',
            'salary_min': 1300000,
            'salary_max': 2200000,
            'employment_type': 'full-time',
            'experience_required': 2,
            'education_required': 'Bachelor in Computer Science or Data Science',
            'skills': [
                ('Python', 'advanced', True),
                ('SQL', 'advanced', True),
                ('Pandas', 'advanced', True),
                ('MySQL', 'intermediate', True),
                ('MongoDB', 'intermediate', True),
                ('Data Analysis', 'advanced', False)
            ]
        },
        {
            'employer_id': 1,
            'title': 'Engineering Team Lead',
            'description': 'Drive cross-functional engineering pods, architectural reviews, and mentorship across Java and Python web services.',
            'location': 'Bangalore (On-site)',
            'salary_min': 2200000,
            'salary_max': 3500000,
            'employment_type': 'full-time',
            'experience_required': 4,
            'education_required': 'Bachelor in CS / IT',
            'skills': [
                ('Leadership', 'advanced', True),
                ('Communication', 'advanced', True),
                ('Problem Solving', 'advanced', True),
                ('Teamwork', 'advanced', True),
                ('Java', 'intermediate', True),
                ('Python', 'intermediate', False)
            ]
        },
        {
            'employer_id': 3,
            'title': 'Frontend UI/UX Specialist',
            'description': 'Craft pixel-perfect user interfaces, high-fidelity components, and interactive dashboards with React, TypeScript, and modern JavaScript.',
            'location': 'Remote',
            'salary_min': 1100000,
            'salary_max': 1900000,
            'employment_type': 'full-time',
            'experience_required': 2,
            'education_required': 'Bachelor Degree',
            'skills': [
                ('React', 'advanced', True),
                ('JavaScript', 'advanced', True),
                ('TypeScript', 'intermediate', True),
                ('Communication', 'intermediate', False),
                ('Problem Solving', 'intermediate', False)
            ]
        },
        {
            'employer_id': 3,
            'title': 'Mobile Full Stack Engineer',
            'description': 'Lead cross-platform mobile app development with Flutter, Dart, Firebase, and backend REST APIs.',
            'location': 'Hyderabad (Remote)',
            'salary_min': 1300000,
            'salary_max': 2100000,
            'employment_type': 'full-time',
            'experience_required': 2,
            'education_required': 'Bachelor in Computer Science',
            'skills': [
                ('Flutter', 'advanced', True),
                ('Dart', 'advanced', True),
                ('Firebase', 'intermediate', True),
                ('JavaScript', 'intermediate', False)
            ]
        }
    ]

    for job_info in multi_skill_jobs:
        job_skills = job_info.pop('skills')
        job = Job(**job_info, is_active=True)
        db.add(job)
        db.commit()
        db.refresh(job)
        for s_name, prof, is_req in job_skills:
            norm = normalize_skill(s_name) or s_name
            db.add(JobSkill(
                job_id=job.id,
                skill_name=s_name,
                normalized_skill=norm,
                is_required=is_req,
                min_proficiency=prof
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
