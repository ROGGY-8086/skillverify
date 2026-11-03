import sys
import os
import json
from datetime import datetime

sys.path.insert(0, os.path.dirname(__file__))
from database import engine, SessionLocal, Base
from models import User, CandidateProfile, CandidateSkill, Credential, EmployerProfile, Job, JobSkill, Assessment, AssessmentResult
from auth import hash_password
from services.skill_taxonomy import normalize_skill

data_dir = os.path.join(os.path.dirname(__file__), 'data')
custom_jobs_file = os.path.join(data_dir, 'custom_posted_jobs.json')

def seed():
    print("Ensuring database tables exist...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    password = hash_password('password123')

    # 1. Seed / Ensure Demo Candidates
    demo_candidates = [
        {
            "email": "rahul@example.com",
            "name": "Rahul Sharma",
            "headline": "Senior Full Stack & Java Backend Engineer",
            "education": "B.Tech in Computer Science",
            "experience_years": 3,
            "location": "Mumbai, India",
            "bio": "Experienced software engineer with expertise in Java, Spring Boot, Python, SQL, and React.",
            "skills": [
                ("Java", "advanced", 0.95),
                ("Spring Boot", "advanced", 0.90),
                ("SQL", "advanced", 0.88),
                ("Python", "intermediate", 0.85),
                ("React", "intermediate", 0.80),
                ("JavaScript", "advanced", 0.85),
                ("OpenCV", "intermediate", 0.80),
                ("Machine Learning", "intermediate", 0.80),
                ("TensorFlow", "intermediate", 0.75),
                ("Docker", "intermediate", 0.75),
                ("MongoDB", "intermediate", 0.75),
                ("Problem Solving", "advanced", 0.90),
                ("Communication", "intermediate", 0.85),
                ("Teamwork", "advanced", 0.90),
                ("Leadership", "intermediate", 0.80)
            ]
        },
        {
            "email": "priya@example.com",
            "name": "Priya Patel",
            "headline": "AI & Data Science Specialist",
            "education": "M.Tech in Artificial Intelligence",
            "experience_years": 2,
            "location": "Bangalore, India",
            "bio": "Specializing in deep learning, computer vision, and machine learning model deployment.",
            "skills": [
                ("Python", "advanced", 0.95),
                ("Machine Learning", "advanced", 0.90),
                ("TensorFlow", "advanced", 0.90),
                ("Deep Learning", "intermediate", 0.85),
                ("Data Analysis", "intermediate", 0.85)
            ]
        },
        {
            "email": "amit@example.com",
            "name": "Amit Kumar",
            "headline": "Frontend & Full Stack Engineer",
            "education": "B.Tech in Information Technology",
            "experience_years": 2,
            "location": "Pune, India",
            "bio": "Passionate about building responsive, modern user experiences using React, TypeScript, and Node.js.",
            "skills": [
                ("JavaScript", "advanced", 0.95),
                ("React", "advanced", 0.90),
                ("Node.js", "advanced", 0.88),
                ("TypeScript", "intermediate", 0.85),
                ("MongoDB", "intermediate", 0.80)
            ]
        },
        {
            "email": "sneha@example.com",
            "name": "Sneha Desai",
            "headline": "Cloud DevOps & Platform Engineer",
            "education": "B.Tech in Computer Engineering",
            "experience_years": 3,
            "location": "Delhi NCR, India",
            "bio": "Cloud and infrastructure specialist focused on Kubernetes, Docker, and AWS automation.",
            "skills": [
                ("Docker", "advanced", 0.95),
                ("Kubernetes", "advanced", 0.90),
                ("AWS", "advanced", 0.90),
                ("Python", "intermediate", 0.80)
            ]
        },
        {
            "email": "vikram@example.com",
            "name": "Vikram Singh",
            "headline": "Python & Database Engineer",
            "education": "BCA / MCA",
            "experience_years": 2,
            "location": "Hyderabad, India",
            "bio": "Backend developer specializing in Python, relational databases, and data warehousing.",
            "skills": [
                ("Python", "advanced", 0.90),
                ("SQL", "advanced", 0.90),
                ("MySQL", "intermediate", 0.80)
            ]
        },
        {
            "email": "rohanughade999@gmail.com",
            "name": "Rohan Ughade",
            "headline": "AI/ML & Python Developer",
            "education": "B.Tech in Computer Engineering",
            "experience_years": 2,
            "location": "Pune, India",
            "bio": "Passionate developer focused on computer vision, deep learning, Python, and SQL.",
            "skills": [
                ("Machine Learning", "advanced", 0.95),
                ("Python", "advanced", 0.95),
                ("OpenCV", "advanced", 0.90),
                ("SQL", "advanced", 0.90),
                ("Power BI", "intermediate", 0.85),
                ("Java", "intermediate", 0.80),
                ("TensorFlow", "intermediate", 0.85),
                ("C", "intermediate", 0.80),
                ("Data Analysis", "advanced", 0.90),
                ("MongoDB", "intermediate", 0.80),
                ("SQLite", "intermediate", 0.80),
                ("Pandas", "advanced", 0.90),
                ("MySQL", "intermediate", 0.85),
                ("C++", "intermediate", 0.80)
            ]
        }
    ]

    for cand_data in demo_candidates:
        u = db.query(User).filter(User.email == cand_data["email"]).first()
        if not u:
            u = User(
                email=cand_data["email"],
                password_hash=password,
                role="candidate",
                name=cand_data["name"]
            )
            db.add(u)
            db.commit()
            db.refresh(u)
        else:
            u.name = cand_data["name"]
            u.role = "candidate"
            db.commit()

        cp = db.query(CandidateProfile).filter(CandidateProfile.user_id == u.id).first()
        if not cp:
            cp = CandidateProfile(
                user_id=u.id,
                headline=cand_data["headline"],
                education=cand_data["education"],
                experience_years=cand_data["experience_years"],
                location=cand_data["location"],
                bio=cand_data["bio"]
            )
            db.add(cp)
            db.commit()
            db.refresh(cp)
        else:
            cp.headline = cand_data["headline"]
            cp.education = cand_data["education"]
            cp.experience_years = cand_data["experience_years"]
            cp.location = cand_data["location"]
            cp.bio = cand_data["bio"]
            db.commit()

        for s_name, prof, conf in cand_data["skills"]:
            norm = normalize_skill(s_name) or s_name
            existing_skill = db.query(CandidateSkill).filter(
                CandidateSkill.candidate_id == cp.id,
                (CandidateSkill.skill_name.ilike(s_name)) | (CandidateSkill.normalized_skill.ilike(norm))
            ).first()
            if not existing_skill:
                db.add(CandidateSkill(
                    candidate_id=cp.id,
                    skill_name=s_name,
                    normalized_skill=norm,
                    proficiency_level=prof,
                    confidence_score=conf,
                    evidence_type="credential",
                    verified=True
                ))
        db.commit()

    # 2. Seed / Ensure Demo Employers
    demo_employers = [
        {
            "email": "hr@techcorp.com",
            "name": "TechCorp HR",
            "company_name": "TechCorp Solutions",
            "industry": "Technology & Services",
            "company_size": "500-1000",
            "description": "Global enterprise software, digital transformation, and cloud engineering solutions."
        },
        {
            "email": "jobs@datamind.com",
            "name": "DataMind Analytics",
            "company_name": "DataMind Analytics",
            "industry": "Artificial Intelligence & Analytics",
            "company_size": "200-500",
            "description": "Leading predictive analytics, machine learning, and business intelligence platform."
        },
        {
            "email": "careers@cloudscale.com",
            "name": "CloudScale Systems",
            "company_name": "CloudScale Systems",
            "industry": "Cloud Infrastructure & DevOps",
            "company_size": "100-250",
            "description": "Automating next-generation cloud infrastructure, Kubernetes microservices, and CI/CD."
        }
    ]

    employer_map = {} # email -> EmployerProfile.id
    for emp_data in demo_employers:
        u = db.query(User).filter(User.email == emp_data["email"]).first()
        if not u:
            u = User(
                email=emp_data["email"],
                password_hash=password,
                role="employer",
                name=emp_data["name"]
            )
            db.add(u)
            db.commit()
            db.refresh(u)
        else:
            u.role = "employer"
            db.commit()

        ep = db.query(EmployerProfile).filter(EmployerProfile.user_id == u.id).first()
        if not ep:
            ep = EmployerProfile(
                user_id=u.id,
                company_name=emp_data["company_name"],
                industry=emp_data["industry"],
                company_size=emp_data["company_size"],
                description=emp_data["description"]
            )
            db.add(ep)
            db.commit()
            db.refresh(ep)
        else:
            ep.company_name = emp_data["company_name"]
            ep.industry = emp_data["industry"]
            ep.company_size = emp_data["company_size"]
            ep.description = emp_data["description"]
            db.commit()
            
        employer_map[emp_data["email"]] = ep.id

    # 3. Seed Primary Demo Jobs
    techcorp_id = employer_map["hr@techcorp.com"]
    datamind_id = employer_map["jobs@datamind.com"]
    cloudscale_id = employer_map["careers@cloudscale.com"]

    demo_jobs = [
        # --- TechCorp Solutions Jobs ---
        {
            "employer_id": techcorp_id,
            "title": "Senior Full Stack React & Node Engineer",
            "description": "Build scalable cloud web applications, microfrontends, and high-performance REST/GraphQL APIs with React, Node.js, TypeScript, and MongoDB.",
            "location": "Bangalore (Hybrid)",
            "salary_min": 1500000,
            "salary_max": 2600000,
            "employment_type": "Full-time",
            "experience_required": 3,
            "education_required": "B.Tech in Computer Science or equivalent",
            "skills": [
                ("React", "advanced", True),
                ("Node.js", "advanced", True),
                ("TypeScript", "intermediate", True),
                ("MongoDB", "intermediate", True),
                ("JavaScript", "advanced", True)
            ]
        },
        {
            "employer_id": techcorp_id,
            "title": "Enterprise Java & Spring Boot Architect",
            "description": "Lead backend microservices modernization, transactional banking workflows, and distributed systems using Java, Spring Boot, MySQL, and Docker.",
            "location": "Pune (On-site)",
            "salary_min": 1800000,
            "salary_max": 3000000,
            "employment_type": "Full-time",
            "experience_required": 4,
            "education_required": "B.E. / B.Tech / M.Tech in CS",
            "skills": [
                ("Java", "advanced", True),
                ("Spring Boot", "advanced", True),
                ("SQL", "advanced", True),
                ("MySQL", "intermediate", True),
                ("Docker", "intermediate", False)
            ]
        },
        {
            "employer_id": techcorp_id,
            "title": "Cloud DevOps & SRE Specialist",
            "description": "Oversee zero-downtime CI/CD deployments, AWS cloud infrastructure, Kubernetes cluster management, and system monitoring.",
            "location": "Remote",
            "salary_min": 1600000,
            "salary_max": 2700000,
            "employment_type": "Full-time",
            "experience_required": 3,
            "education_required": "Bachelor in CS/IT",
            "skills": [
                ("AWS", "advanced", True),
                ("Docker", "advanced", True),
                ("Kubernetes", "advanced", True),
                ("Python", "intermediate", True),
                ("Problem Solving", "intermediate", False)
            ]
        },
        {
            "employer_id": techcorp_id,
            "title": "AI & Machine Learning Solutions Engineer",
            "description": "Deploy end-to-end machine learning algorithms, deep learning computer vision pipelines, and predictive analytics tools for enterprise clients.",
            "location": "Hyderabad (Hybrid)",
            "salary_min": 1700000,
            "salary_max": 2900000,
            "employment_type": "Full-time",
            "experience_required": 2,
            "education_required": "Bachelor or Master in Data Science / AI",
            "skills": [
                ("Python", "advanced", True),
                ("Machine Learning", "advanced", True),
                ("TensorFlow", "intermediate", True),
                ("OpenCV", "intermediate", False),
                ("SQL", "intermediate", True)
            ]
        },
        {
            "employer_id": techcorp_id,
            "title": "Lead Mobile Engineer (Flutter)",
            "description": "Architect multi-platform consumer mobile apps in Flutter with reactive state management, Firebase backend services, and native integrations.",
            "location": "Bangalore (Remote)",
            "salary_min": 1400000,
            "salary_max": 2400000,
            "employment_type": "Full-time",
            "experience_required": 3,
            "education_required": "Bachelor in CS / Software Engineering",
            "skills": [
                ("Flutter", "advanced", True),
                ("Dart", "advanced", True),
                ("Firebase", "intermediate", True),
                ("JavaScript", "intermediate", False)
            ]
        },
        {
            "employer_id": techcorp_id,
            "title": "Associate Software Engineer (Graduate Drive)",
            "description": "Great entry-level opportunity for aspiring developers proficient in foundational programming languages and problem-solving.",
            "location": "Mumbai (On-site)",
            "salary_min": 600000,
            "salary_max": 1000000,
            "employment_type": "Full-time",
            "experience_required": 0,
            "education_required": "B.Tech / B.E. / BCA / MCA",
            "skills": [
                ("Java", "intermediate", True),
                ("Python", "intermediate", True),
                ("SQL", "basic", True),
                ("Problem Solving", "intermediate", True),
                ("Communication", "intermediate", True)
            ]
        },
        {
            "employer_id": techcorp_id,
            "title": "High-Performance C++ Systems Engineer",
            "description": "Design ultra-low latency backend systems and embedded data engines in C++ and C with optimized database storage.",
            "location": "Pune (On-site)",
            "salary_min": 1500000,
            "salary_max": 2600000,
            "employment_type": "Full-time",
            "experience_required": 3,
            "education_required": "B.Tech in Computer Science or ECE",
            "skills": [
                ("C++", "advanced", True),
                ("C", "advanced", True),
                ("SQL", "intermediate", True),
                ("Problem Solving", "advanced", True),
                ("SQLite", "basic", False)
            ]
        },
        {
            "employer_id": techcorp_id,
            "title": "Full Stack MERN Lead Engineer",
            "description": "Architect enterprise cloud web applications leveraging React, Node.js, MongoDB, JavaScript, and modern microservices.",
            "location": "Bangalore (Remote)",
            "salary_min": 1600000,
            "salary_max": 2800000,
            "employment_type": "Full-time",
            "experience_required": 3,
            "education_required": "Bachelor in Computer Science",
            "skills": [
                ("React", "advanced", True),
                ("Node.js", "advanced", True),
                ("MongoDB", "advanced", True),
                ("JavaScript", "advanced", True),
                ("Problem Solving", "intermediate", False)
            ]
        },
        {
            "employer_id": techcorp_id,
            "title": "Junior Backend Developer",
            "description": "Develop backend services in Java and Spring Boot with relational databases.",
            "location": "Mumbai",
            "salary_min": 600000,
            "salary_max": 1000000,
            "employment_type": "Full-time",
            "experience_required": 1,
            "education_required": "B.Tech in Computer Science",
            "skills": [
                ("Java", "intermediate", True),
                ("Spring Boot", "intermediate", True),
                ("SQL", "intermediate", True)
            ]
        },
        {
            "employer_id": techcorp_id,
            "title": "Senior Python Developer",
            "description": "Build high-scale distributed backend applications using Python, Django, and Docker.",
            "location": "Bangalore",
            "salary_min": 1400000,
            "salary_max": 2400000,
            "employment_type": "Full-time",
            "experience_required": 4,
            "education_required": "Bachelor in CS",
            "skills": [
                ("Python", "advanced", True),
                ("Django", "intermediate", True),
                ("Docker", "intermediate", True)
            ]
        },
        {
            "employer_id": techcorp_id,
            "title": "Full Stack Developer",
            "description": "Develop full stack web applications with React, Node.js, and MongoDB.",
            "location": "Pune",
            "salary_min": 900000,
            "salary_max": 1600000,
            "employment_type": "Full-time",
            "experience_required": 2,
            "education_required": "Bachelor in CS",
            "skills": [
                ("React", "intermediate", True),
                ("Node.js", "intermediate", True),
                ("MongoDB", "intermediate", True)
            ]
        },
        {
            "employer_id": techcorp_id,
            "title": "Software Engineer Intern",
            "description": "Assist in writing automated test scripts and data processing routines in Python & SQL.",
            "location": "Chennai",
            "salary_min": 400000,
            "salary_max": 700000,
            "employment_type": "Internship",
            "experience_required": 0,
            "education_required": "Pursuing B.Tech / BCA",
            "skills": [
                ("Python", "basic", True),
                ("SQL", "basic", True)
            ]
        },
        {
            "employer_id": techcorp_id,
            "title": "Engineering Team Lead",
            "description": "Drive cross-functional engineering pods, architectural reviews, and mentorship across Java and Python web services.",
            "location": "Bangalore (On-site)",
            "salary_min": 2200000,
            "salary_max": 3500000,
            "employment_type": "Full-time",
            "experience_required": 4,
            "education_required": "Bachelor in CS / IT",
            "skills": [
                ("Leadership", "advanced", True),
                ("Communication", "advanced", True),
                ("Problem Solving", "advanced", True),
                ("Teamwork", "advanced", True),
                ("Java", "intermediate", True),
                ("Python", "intermediate", False)
            ]
        },

        # --- DataMind Analytics Jobs ---
        {
            "employer_id": datamind_id,
            "title": "Computer Vision & AI Research Engineer",
            "description": "Develop state-of-the-art vision models, OpenCV image processing pipelines, and production machine learning architectures.",
            "location": "Bangalore (Hybrid)",
            "salary_min": 1400000,
            "salary_max": 2400000,
            "employment_type": "Full-time",
            "experience_required": 2,
            "education_required": "B.Tech or M.Tech in CS/AI",
            "skills": [
                ("Python", "advanced", True),
                ("OpenCV", "advanced", True),
                ("Machine Learning", "advanced", True),
                ("TensorFlow", "intermediate", True),
                ("Data Analysis", "intermediate", False)
            ]
        },
        {
            "employer_id": datamind_id,
            "title": "Senior Data & BI Analytics Consultant",
            "description": "Lead enterprise dashboarding, statistical modeling, and data warehouse queries using SQL, Power BI, Python, and Pandas.",
            "location": "Mumbai (Remote)",
            "salary_min": 1200000,
            "salary_max": 2000000,
            "employment_type": "Full-time",
            "experience_required": 2,
            "education_required": "Bachelor in Engineering/Statistics",
            "skills": [
                ("SQL", "advanced", True),
                ("Power BI", "advanced", True),
                ("Python", "intermediate", True),
                ("Pandas", "intermediate", True),
                ("Data Analysis", "advanced", True),
                ("MySQL", "intermediate", False)
            ]
        },
        {
            "employer_id": datamind_id,
            "title": "Data Scientist",
            "description": "Perform advanced analytics, machine learning modeling, and deep learning experiments.",
            "location": "Bangalore",
            "salary_min": 1200000,
            "salary_max": 2200000,
            "employment_type": "Full-time",
            "experience_required": 2,
            "education_required": "Master or Bachelor in CS/Stats",
            "skills": [
                ("Python", "advanced", True),
                ("Machine Learning", "intermediate", True),
                ("TensorFlow", "intermediate", True)
            ]
        },
        {
            "employer_id": datamind_id,
            "title": "ML Engineer",
            "description": "Productionize ML algorithms and deep learning models with Docker.",
            "location": "Bangalore",
            "salary_min": 1300000,
            "salary_max": 2300000,
            "employment_type": "Full-time",
            "experience_required": 2,
            "education_required": "B.Tech / M.Tech in CS",
            "skills": [
                ("Python", "advanced", True),
                ("Deep Learning", "intermediate", True),
                ("Docker", "intermediate", True)
            ]
        },
        {
            "employer_id": datamind_id,
            "title": "Lead Data Pipeline & ETL Engineer",
            "description": "Create large-scale data ingestion and transformation pipelines using Python, SQL, Pandas, MySQL, and MongoDB.",
            "location": "Pune (Hybrid)",
            "salary_min": 1300000,
            "salary_max": 2200000,
            "employment_type": "Full-time",
            "experience_required": 2,
            "education_required": "Bachelor in Computer Science or Data Science",
            "skills": [
                ("Python", "advanced", True),
                ("SQL", "advanced", True),
                ("Pandas", "advanced", True),
                ("MySQL", "intermediate", True),
                ("MongoDB", "intermediate", True),
                ("Data Analysis", "advanced", False)
            ]
        },

        # --- CloudScale Systems Jobs ---
        {
            "employer_id": cloudscale_id,
            "title": "DevOps Engineer",
            "description": "Design and maintain cloud infrastructure, Kubernetes clusters, and automated CI/CD.",
            "location": "Delhi",
            "salary_min": 1200000,
            "salary_max": 2000000,
            "employment_type": "Full-time",
            "experience_required": 2,
            "education_required": "Bachelor in CS/IT",
            "skills": [
                ("Docker", "advanced", True),
                ("Kubernetes", "advanced", True),
                ("AWS", "advanced", True)
            ]
        },
        {
            "employer_id": cloudscale_id,
            "title": "Frontend Developer",
            "description": "Build responsive, accessible user interfaces using React and TypeScript.",
            "location": "Remote",
            "salary_min": 800000,
            "salary_max": 1500000,
            "employment_type": "Full-time",
            "experience_required": 2,
            "education_required": "Bachelor Degree",
            "skills": [
                ("React", "intermediate", True),
                ("TypeScript", "intermediate", True)
            ]
        },
        {
            "employer_id": cloudscale_id,
            "title": "Cloud DevOps & Infrastructure Specialist",
            "description": "Automate cloud deployment pipelines, multi-cluster Kubernetes orchestration, AWS cloud infrastructure, and Dockerized microservices.",
            "location": "Hyderabad (Hybrid)",
            "salary_min": 1800000,
            "salary_max": 3000000,
            "employment_type": "Full-time",
            "experience_required": 3,
            "education_required": "Bachelor in CS/IT",
            "skills": [
                ("Docker", "advanced", True),
                ("Kubernetes", "advanced", True),
                ("AWS", "advanced", True),
                ("Python", "intermediate", True),
                ("Communication", "intermediate", False)
            ]
        },
        {
            "employer_id": cloudscale_id,
            "title": "Frontend UI/UX Specialist",
            "description": "Craft pixel-perfect user interfaces, high-fidelity components, and interactive dashboards with React, TypeScript, and modern JavaScript.",
            "location": "Remote",
            "salary_min": 1100000,
            "salary_max": 1900000,
            "employment_type": "Full-time",
            "experience_required": 2,
            "education_required": "Bachelor Degree",
            "skills": [
                ("React", "advanced", True),
                ("JavaScript", "advanced", True),
                ("TypeScript", "intermediate", True),
                ("Communication", "intermediate", False),
                ("Problem Solving", "intermediate", False)
            ]
        },
        {
            "employer_id": cloudscale_id,
            "title": "Mobile Full Stack Engineer",
            "description": "Lead cross-platform mobile app development with Flutter, Dart, Firebase, and backend REST APIs.",
            "location": "Hyderabad (Remote)",
            "salary_min": 1300000,
            "salary_max": 2100000,
            "employment_type": "Full-time",
            "experience_required": 2,
            "education_required": "Bachelor in Computer Science",
            "skills": [
                ("Flutter", "advanced", True),
                ("Dart", "advanced", True),
                ("Firebase", "intermediate", True),
                ("JavaScript", "intermediate", False)
            ]
        }
    ]

    for job_info in demo_jobs:
        skills = job_info["skills"]
        existing = db.query(Job).filter(
            Job.title == job_info["title"],
            Job.employer_id == job_info["employer_id"]
        ).first()
        if not existing:
            new_job = Job(
                employer_id=job_info["employer_id"],
                title=job_info["title"],
                description=job_info["description"],
                location=job_info["location"],
                salary_min=job_info["salary_min"],
                salary_max=job_info["salary_max"],
                employment_type=job_info["employment_type"],
                experience_required=job_info["experience_required"],
                education_required=job_info["education_required"],
                is_active=True
            )
            db.add(new_job)
            db.commit()
            db.refresh(new_job)
            for s_name, prof, is_req in skills:
                norm = normalize_skill(s_name) or s_name
                db.add(JobSkill(
                    job_id=new_job.id,
                    skill_name=s_name,
                    normalized_skill=norm,
                    is_required=is_req,
                    min_proficiency=prof
                ))
            db.commit()

    # 4. Restore custom-posted jobs if present
    if os.path.exists(custom_jobs_file):
        try:
            with open(custom_jobs_file, "r") as f:
                custom_list = json.load(f)
            for cjob in custom_list:
                emp_id = cjob.get("employer_id", techcorp_id)
                existing = db.query(Job).filter(
                    Job.title == cjob.get("title"),
                    Job.employer_id == emp_id
                ).first()
                if not existing:
                    new_job = Job(
                        employer_id=emp_id,
                        title=cjob.get("title"),
                        description=cjob.get("description", ""),
                        location=cjob.get("location", "Remote"),
                        salary_min=cjob.get("salary_min"),
                        salary_max=cjob.get("salary_max"),
                        employment_type=cjob.get("employment_type", "Full-time"),
                        experience_required=cjob.get("experience_required", 0),
                        education_required=cjob.get("education_required"),
                        is_active=True
                    )
                    db.add(new_job)
                    db.commit()
                    db.refresh(new_job)
                    for sk in cjob.get("skills", []):
                        s_name = sk.get("skill_name") if isinstance(sk, dict) else str(sk)
                        is_req = sk.get("is_required", True) if isinstance(sk, dict) else True
                        prof = sk.get("min_proficiency", "intermediate") if isinstance(sk, dict) else "intermediate"
                        norm = normalize_skill(s_name) or s_name
                        db.add(JobSkill(
                            job_id=new_job.id,
                            skill_name=s_name,
                            normalized_skill=norm,
                            is_required=is_req,
                            min_proficiency=prof
                        ))
                    db.commit()
        except Exception as e:
            print("Error restoring custom jobs:", e)

    total_jobs = db.query(Job).count()
    total_users = db.query(User).count()
    print(f"Database seeded successfully with {total_jobs} jobs and {total_users} users!")
    db.close()

if __name__ == '__main__':
    seed()
