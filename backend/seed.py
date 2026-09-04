import sys
import json
import os
sys.path.insert(0, '.')
from database import engine, SessionLocal, Base
from models import *
from auth import hash_password
from services.skill_taxonomy import normalize_skill

def seed():
    print("Dropping and recreating database tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    password = hash_password('password123')
    
    # 1. Sample Candidates
    users_data = [
        {"email": "rahul@example.com", "name": "Rahul Sharma", "role": "candidate", "password_hash": password},
        {"email": "priya@example.com", "name": "Priya Patel", "role": "candidate", "password_hash": password},
        {"email": "amit@example.com", "name": "Amit Kumar", "role": "candidate", "password_hash": password},
        {"email": "sneha@example.com", "name": "Sneha Desai", "role": "candidate", "password_hash": password},
        {"email": "vikram@example.com", "name": "Vikram Singh", "role": "candidate", "password_hash": password},
    ]
    
    for u in users_data:
        db.add(User(**u))
    db.commit()
    
    candidates = db.query(User).filter(User.role == 'candidate').all()
    
    profiles_data = [
        {"user_id": candidates[0].id, "headline": "Java/Spring Boot Backend Developer", "experience_years": 3, "location": "Mumbai"},
        {"user_id": candidates[1].id, "headline": "Python/ML Data Scientist", "experience_years": 2, "location": "Bangalore"},
        {"user_id": candidates[2].id, "headline": "Full-stack JavaScript/React Developer", "experience_years": 4, "location": "Pune"},
        {"user_id": candidates[3].id, "headline": "Cloud/DevOps Engineer", "experience_years": 3, "location": "Delhi"},
        {"user_id": candidates[4].id, "headline": "Fresh Graduate Python/SQL", "experience_years": 0, "location": "Chennai"},
    ]
    
    for p in profiles_data:
        db.add(CandidateProfile(**p))
    db.commit()
    
    c_profiles = db.query(CandidateProfile).all()
    
    skills_data = [
        # Rahul
        {"candidate_id": c_profiles[0].id, "skill_name": "Java", "proficiency_level": "advanced", "confidence_score": 0.9, "evidence_type": "credential"},
        {"candidate_id": c_profiles[0].id, "skill_name": "Spring Boot", "proficiency_level": "advanced", "confidence_score": 0.85, "evidence_type": "resume"},
        {"candidate_id": c_profiles[0].id, "skill_name": "SQL", "proficiency_level": "intermediate", "confidence_score": 0.7, "evidence_type": "assessment"},
        # Priya
        {"candidate_id": c_profiles[1].id, "skill_name": "Python", "proficiency_level": "advanced", "confidence_score": 0.95, "evidence_type": "credential"},
        {"candidate_id": c_profiles[1].id, "skill_name": "Machine Learning", "proficiency_level": "intermediate", "confidence_score": 0.8, "evidence_type": "resume"},
        {"candidate_id": c_profiles[1].id, "skill_name": "TensorFlow", "proficiency_level": "intermediate", "confidence_score": 0.75, "evidence_type": "resume"},
        # Amit
        {"candidate_id": c_profiles[2].id, "skill_name": "JavaScript", "proficiency_level": "advanced", "confidence_score": 0.9, "evidence_type": "credential"},
        {"candidate_id": c_profiles[2].id, "skill_name": "React", "proficiency_level": "advanced", "confidence_score": 0.9, "evidence_type": "resume"},
        {"candidate_id": c_profiles[2].id, "skill_name": "Node.js", "proficiency_level": "intermediate", "confidence_score": 0.8, "evidence_type": "assessment"},
        # Sneha
        {"candidate_id": c_profiles[3].id, "skill_name": "Docker", "proficiency_level": "advanced", "confidence_score": 0.9, "evidence_type": "credential"},
        {"candidate_id": c_profiles[3].id, "skill_name": "Kubernetes", "proficiency_level": "intermediate", "confidence_score": 0.8, "evidence_type": "resume"},
        {"candidate_id": c_profiles[3].id, "skill_name": "AWS", "proficiency_level": "advanced", "confidence_score": 0.95, "evidence_type": "credential"},
        # Vikram
        {"candidate_id": c_profiles[4].id, "skill_name": "Python", "proficiency_level": "intermediate", "confidence_score": 0.7, "evidence_type": "assessment"},
        {"candidate_id": c_profiles[4].id, "skill_name": "SQL", "proficiency_level": "basic", "confidence_score": 0.6, "evidence_type": "resume"},
    ]
    
    for s in skills_data:
        s["normalized_skill"] = normalize_skill(s["skill_name"])
        db.add(CandidateSkill(**s))
    db.commit()
    
    # 2. Sample Employers
    emp_users = [
        {"email": "hr@techcorp.com", "name": "TechCorp HR", "role": "employer", "password_hash": password},
        {"email": "jobs@datamind.com", "name": "DataMind Hiring", "role": "employer", "password_hash": password},
        {"email": "careers@cloudscale.com", "name": "CloudScale Careers", "role": "employer", "password_hash": password},
    ]
    
    for eu in emp_users:
        db.add(User(**eu))
    db.commit()
    
    employers = db.query(User).filter(User.role == 'employer').all()
    
    emp_profiles = [
        {"user_id": employers[0].id, "company_name": "TechCorp Solutions", "industry": "IT Services", "company_size": "500+"},
        {"user_id": employers[1].id, "company_name": "DataMind Analytics", "industry": "Analytics/AI", "company_size": "50-200"},
        {"user_id": employers[2].id, "company_name": "CloudScale Systems", "industry": "Cloud Infrastructure", "company_size": "200-500"},
    ]
    
    for ep in emp_profiles:
        db.add(EmployerProfile(**ep))
    db.commit()
    
    e_profiles = db.query(EmployerProfile).all()
    
    # 3. 8 Job Postings
    jobs_data = [
        {"employer_id": e_profiles[0].id, "title": "Junior Backend Developer", "description": "Looking for a backend developer.", "location": "Mumbai", "employment_type": "Full-time"},
        {"employer_id": e_profiles[0].id, "title": "Senior Python Developer", "description": "Experienced Python dev needed.", "location": "Bangalore", "employment_type": "Full-time"},
        {"employer_id": e_profiles[0].id, "title": "Full Stack Developer", "description": "React and Nodejs developer.", "location": "Pune", "employment_type": "Full-time"},
        {"employer_id": e_profiles[1].id, "title": "Data Scientist", "description": "Data Scientist for ML models.", "location": "Bangalore", "employment_type": "Full-time"},
        {"employer_id": e_profiles[2].id, "title": "DevOps Engineer", "description": "Cloud infra automation.", "location": "Delhi", "employment_type": "Full-time"},
        {"employer_id": e_profiles[2].id, "title": "Frontend Developer", "description": "React specialist.", "location": "Remote", "employment_type": "Full-time"},
        {"employer_id": e_profiles[1].id, "title": "ML Engineer", "description": "Deploy deep learning models.", "location": "Bangalore", "employment_type": "Full-time"},
        {"employer_id": e_profiles[0].id, "title": "Software Engineer Intern", "description": "Fresh graduate intern.", "location": "Chennai", "employment_type": "Internship"},
    ]
    
    for j in jobs_data:
        db.add(Job(**j))
    db.commit()
    
    jobs = db.query(Job).all()
    
    job_skills_data = [
        # Junior Backend
        {"job_id": jobs[0].id, "skill_name": "Java", "is_required": True, "min_proficiency": "intermediate"},
        {"job_id": jobs[0].id, "skill_name": "Spring Boot", "is_required": True, "min_proficiency": "intermediate"},
        {"job_id": jobs[0].id, "skill_name": "SQL", "is_required": True, "min_proficiency": "basic"},
        # Senior Python
        {"job_id": jobs[1].id, "skill_name": "Python", "is_required": True, "min_proficiency": "advanced"},
        {"job_id": jobs[1].id, "skill_name": "Django", "is_required": True, "min_proficiency": "intermediate"},
        {"job_id": jobs[1].id, "skill_name": "Docker", "is_required": False, "min_proficiency": "intermediate"},
        # Full Stack
        {"job_id": jobs[2].id, "skill_name": "React", "is_required": True, "min_proficiency": "intermediate"},
        {"job_id": jobs[2].id, "skill_name": "Node.js", "is_required": True, "min_proficiency": "intermediate"},
        {"job_id": jobs[2].id, "skill_name": "MongoDB", "is_required": False, "min_proficiency": "basic"},
        # Data Scientist
        {"job_id": jobs[3].id, "skill_name": "Python", "is_required": True, "min_proficiency": "advanced"},
        {"job_id": jobs[3].id, "skill_name": "Machine Learning", "is_required": True, "min_proficiency": "intermediate"},
        {"job_id": jobs[3].id, "skill_name": "TensorFlow", "is_required": False, "min_proficiency": "intermediate"},
        # DevOps
        {"job_id": jobs[4].id, "skill_name": "Docker", "is_required": True, "min_proficiency": "advanced"},
        {"job_id": jobs[4].id, "skill_name": "Kubernetes", "is_required": True, "min_proficiency": "intermediate"},
        {"job_id": jobs[4].id, "skill_name": "AWS", "is_required": True, "min_proficiency": "advanced"},
        # Frontend
        {"job_id": jobs[5].id, "skill_name": "React", "is_required": True, "min_proficiency": "advanced"},
        {"job_id": jobs[5].id, "skill_name": "TypeScript", "is_required": True, "min_proficiency": "intermediate"},
        # ML Engineer
        {"job_id": jobs[6].id, "skill_name": "Python", "is_required": True, "min_proficiency": "advanced"},
        {"job_id": jobs[6].id, "skill_name": "Deep Learning", "is_required": True, "min_proficiency": "advanced"},
        {"job_id": jobs[6].id, "skill_name": "Docker", "is_required": False, "min_proficiency": "intermediate"},
        # Intern
        {"job_id": jobs[7].id, "skill_name": "Python", "is_required": True, "min_proficiency": "basic"},
        {"job_id": jobs[7].id, "skill_name": "SQL", "is_required": True, "min_proficiency": "basic"},
    ]
    
    for js in job_skills_data:
        js["normalized_skill"] = normalize_skill(js["skill_name"])
        db.add(JobSkill(**js))
    db.commit()
    
    # 4. Assessment questions
    questions = [
        # Python
        {"skill_name": "python", "question": "What is the output of print(type([]))?", "options": json.dumps(["<class 'list'>", "<class 'dict'>", "<class 'tuple'>", "<class 'set'>"]), "correct_answer": 0, "difficulty": 1},
        {"skill_name": "python", "question": "Which of the following is mutable?", "options": json.dumps(["tuple", "list", "string", "frozenset"]), "correct_answer": 1, "difficulty": 1},
        {"skill_name": "python", "question": "What does __init__ do?", "options": json.dumps(["Initializes a module", "Initializes a class instance", "Creates a new variable", "Imports a package"]), "correct_answer": 1, "difficulty": 2},
        {"skill_name": "python", "question": "How to create a generator?", "options": json.dumps(["Use yield", "Use return", "Use generate", "Use lambda"]), "correct_answer": 0, "difficulty": 2},
        {"skill_name": "python", "question": "What is a decorator?", "options": json.dumps(["A class attribute", "A function that modifies another function", "A comment block", "A GUI element"]), "correct_answer": 1, "difficulty": 3},
        
        # Java
        {"skill_name": "java", "question": "Which keyword is used for inheritance in Java?", "options": json.dumps(["implements", "inherits", "extends", "super"]), "correct_answer": 2, "difficulty": 1},
        {"skill_name": "java", "question": "What is the size of int in Java?", "options": json.dumps(["16 bit", "32 bit", "64 bit", "Depends on OS"]), "correct_answer": 1, "difficulty": 1},
        {"skill_name": "java", "question": "Which of these is not a Java Collection interface?", "options": json.dumps(["List", "Set", "Map", "Array"]), "correct_answer": 3, "difficulty": 2},
        {"skill_name": "java", "question": "What is the default value of a boolean in Java?", "options": json.dumps(["true", "false", "null", "0"]), "correct_answer": 1, "difficulty": 1},
        {"skill_name": "java", "question": "Which class is the superclass of all classes in Java?", "options": json.dumps(["Main", "Super", "Object", "System"]), "correct_answer": 2, "difficulty": 1},
        
        # JavaScript
        {"skill_name": "javascript", "question": "Which symbol is used for strict equality?", "options": json.dumps(["==", "===", "=", "!=="]), "correct_answer": 1, "difficulty": 1},
        {"skill_name": "javascript", "question": "What does NaN stand for?", "options": json.dumps(["Not a Null", "Not a Number", "New and Null", "Null and Null"]), "correct_answer": 1, "difficulty": 1},
        {"skill_name": "javascript", "question": "Which method adds an element to the end of an array?", "options": json.dumps(["push()", "pop()", "shift()", "unshift()"]), "correct_answer": 0, "difficulty": 1},
        {"skill_name": "javascript", "question": "What is a closure?", "options": json.dumps(["A closed function", "Function bundled with its lexical environment", "A syntax error", "An object property"]), "correct_answer": 1, "difficulty": 3},
        {"skill_name": "javascript", "question": "How do you define an arrow function?", "options": json.dumps(["function() => {}", "() => {}", "=> function()", "function => {}"]), "correct_answer": 1, "difficulty": 1},
        
        # SQL
        {"skill_name": "sql", "question": "Which clause is used to filter records in a GROUP BY?", "options": json.dumps(["WHERE", "FILTER", "HAVING", "LIMIT"]), "correct_answer": 2, "difficulty": 2},
        {"skill_name": "sql", "question": "What does SQL stand for?", "options": json.dumps(["Structured Query Language", "Strong Query Language", "Structured Question Language", "System Query Language"]), "correct_answer": 0, "difficulty": 1},
        {"skill_name": "sql", "question": "Which JOIN returns all records from both tables?", "options": json.dumps(["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"]), "correct_answer": 3, "difficulty": 2},
        {"skill_name": "sql", "question": "How do you select distinct values?", "options": json.dumps(["SELECT UNIQUE", "SELECT DISTINCT", "SELECT DIFFERENT", "SELECT NEW"]), "correct_answer": 1, "difficulty": 1},
        {"skill_name": "sql", "question": "Which keyword sorts the result-set?", "options": json.dumps(["ORDER BY", "SORT BY", "GROUP BY", "ALIGN BY"]), "correct_answer": 0, "difficulty": 1},
        
        # React
        {"skill_name": "react", "question": "What hook manages state in a functional component?", "options": json.dumps(["useContext", "useReducer", "useState", "useEffect"]), "correct_answer": 2, "difficulty": 1},
        {"skill_name": "react", "question": "What is JSX?", "options": json.dumps(["JavaScript XML", "Java Syntax Extension", "JSON X", "JavaScript X"]), "correct_answer": 0, "difficulty": 1},
        {"skill_name": "react", "question": "How do you pass data to child components?", "options": json.dumps(["State", "Props", "Context", "Hooks"]), "correct_answer": 1, "difficulty": 1},
        {"skill_name": "react", "question": "What hook is used for side effects?", "options": json.dumps(["useState", "useEffect", "useRef", "useMemo"]), "correct_answer": 1, "difficulty": 1},
        {"skill_name": "react", "question": "What is the virtual DOM?", "options": json.dumps(["A direct copy of the actual DOM", "A lightweight memory representation of the actual DOM", "A browser extension", "A React library"]), "correct_answer": 1, "difficulty": 2},
    ]
    
    for q in questions:
        db.add(Assessment(**q))
    db.commit()
    
    db.close()
    print("Database seeded successfully!")

if __name__ == '__main__':
    seed()
