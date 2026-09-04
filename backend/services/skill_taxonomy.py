import re

SKILL_CATEGORIES = {
    "Programming Languages": ["Python", "Java", "JavaScript", "TypeScript", "C++", "C#", "C", "Go", "Rust", "Ruby", "PHP", "Swift", "Kotlin", "Scala", "R", "MATLAB", "Perl", "Dart", "Lua", "Shell Scripting"],
    "Web Frontend": ["React", "Angular", "Vue.js", "Next.js", "Svelte", "HTML", "CSS", "Tailwind CSS", "Bootstrap", "jQuery", "SASS", "LESS", "Webpack", "Vite"],
    "Web Backend": ["Node.js", "Express.js", "Django", "Flask", "FastAPI", "Spring Boot", "Spring", "Ruby on Rails", "ASP.NET", "Laravel", "NestJS"],
    "Databases": ["MySQL", "PostgreSQL", "MongoDB", "Redis", "SQLite", "Oracle", "SQL Server", "Cassandra", "DynamoDB", "Firebase", "Elasticsearch", "Neo4j"],
    "Cloud & DevOps": ["AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "Jenkins", "GitHub Actions", "CI/CD", "Terraform", "Ansible", "Linux", "Nginx", "Apache"],
    "Data Science & ML": ["Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Scikit-learn", "Pandas", "NumPy", "Data Analysis", "Data Visualization", "NLP", "Computer Vision", "Keras", "OpenCV", "Tableau", "Power BI", "Statistics", "Big Data", "Spark", "Hadoop"],
    "Mobile": ["React Native", "Flutter", "iOS Development", "Android Development", "SwiftUI", "Jetpack Compose"],
    "APIs & Protocols": ["REST API", "GraphQL", "gRPC", "WebSocket", "OAuth", "JWT", "SOAP"],
    "Tools & Practices": ["Git", "GitHub", "GitLab", "Jira", "Agile", "Scrum", "TDD", "Unit Testing", "Integration Testing", "Microservices", "System Design", "Design Patterns"],
    "Security": ["Cybersecurity", "Penetration Testing", "Encryption", "OWASP", "Network Security", "Security Auditing"],
    "Other Technical": ["Blockchain", "IoT", "Embedded Systems", "AR/VR", "Game Development", "Unity", "Unreal Engine", "3D Modeling"],
    "Soft Skills": ["Leadership", "Communication", "Teamwork", "Problem Solving", "Critical Thinking", "Project Management", "Time Management", "Presentation"]
}

ALIAS_MAP = {
    "JS": "JavaScript", "TS": "TypeScript", "Py": "Python", "C++": "C++", "Cpp": "C++",
    "C#": "C#", "C-Sharp": "C#", "Csharp": "C#", "Golang": "Go", "Ruby": "Ruby",
    "PHP": "PHP", "Swift": "Swift", "Kotlin": "Kotlin", "Scala": "Scala", "R": "R",
    "MATLAB": "MATLAB", "Perl": "Perl", "Dart": "Dart", "Lua": "Lua",
    "Shell": "Shell Scripting", "Bash": "Shell Scripting", "Zsh": "Shell Scripting",
    "React.js": "React", "ReactJS": "React", "Vue": "Vue.js", "VueJS": "Vue.js",
    "AngularJS": "Angular", "Next": "Next.js", "HTML5": "HTML", "CSS3": "CSS",
    "Tailwind": "Tailwind CSS", "Bootstrap": "Bootstrap", "jQuery": "jQuery",
    "Node": "Node.js", "NodeJS": "Node.js", "Express": "Express.js",
    "Django REST": "Django", "Django REST Framework": "Django", "DRF": "Django",
    "Spring Boot": "Spring Boot", "Spring": "Spring Boot",
    "RoR": "Ruby on Rails", "Rails": "Ruby on Rails",
    "Postgres": "PostgreSQL", "Mongo": "MongoDB", "MSSQL": "SQL Server",
    "SQL": "SQL Server", "MySQL": "MySQL", "Oracle": "Oracle",
    "Cassandra": "Cassandra", "Dynamo": "DynamoDB", "Firebase": "Firebase",
    "Elastic": "Elasticsearch", "Neo4j": "Neo4j",
    "AWS": "AWS", "Amazon Web Services": "AWS", "GCP": "Google Cloud",
    "Google Cloud Platform": "Google Cloud", "Azure": "Azure",
    "Docker": "Docker", "k8s": "Kubernetes", "k8": "Kubernetes",
    "Jenkins": "Jenkins", "GH Actions": "GitHub Actions",
    "CI/CD": "CI/CD", "Terraform": "Terraform", "Ansible": "Ansible",
    "Linux": "Linux", "Nginx": "Nginx", "Apache": "Apache",
    "ML": "Machine Learning", "DL": "Deep Learning", "AI": "Machine Learning",
    "Tensorflow": "TensorFlow", "TF": "TensorFlow",
    "Pytorch": "PyTorch", "Sklearn": "Scikit-learn", "sklearn": "Scikit-learn",
    "Pandas": "Pandas", "NumPy": "NumPy", "NLP": "NLP",
    "CV": "Computer Vision", "Keras": "Keras", "OpenCV": "OpenCV",
    "Tableau": "Tableau", "PowerBI": "Power BI",
    "Big Data": "Big Data", "Spark": "Spark", "Hadoop": "Hadoop",
    "RN": "React Native", "Flutter": "Flutter",
    "iOS": "iOS Development", "Android": "Android Development",
    "REST": "REST API", "GraphQL": "GraphQL", "gRPC": "gRPC",
    "WebSockets": "WebSocket", "OAuth": "OAuth", "JWT": "JWT",
    "Git": "Git", "GitHub": "GitHub", "GitLab": "GitLab",
    "Jira": "Jira", "Agile": "Agile", "Scrum": "Scrum",
    "TDD": "TDD", "Microservices": "Microservices",
    "Security": "Cybersecurity", "PenTest": "Penetration Testing",
    "OWASP": "OWASP",
    "Blockchain": "Blockchain", "IoT": "IoT",
    "Unity": "Unity", "Unreal": "Unreal Engine",
    "ECMAScript": "JavaScript", "ES6": "JavaScript", "ES2015": "JavaScript"
}

def normalize_skill(skill_text: str) -> str | None:
    """Looks up in alias map (case-insensitive), returns canonical name or None."""
    skill_text = skill_text.strip()
    skill_lower = skill_text.lower()
    
    # Check alias map
    for alias, canonical in ALIAS_MAP.items():
        if alias.lower() == skill_lower:
            return canonical
            
    # Check canonical skills directly
    for category_skills in SKILL_CATEGORIES.values():
        for canonical_skill in category_skills:
            if canonical_skill.lower() == skill_lower:
                return canonical_skill
                
    return None

def get_all_skills() -> list[str]:
    """Returns flat list of all canonical skills."""
    all_skills = set()
    for skills in SKILL_CATEGORIES.values():
        all_skills.update(skills)
    return list(all_skills)

def get_skill_category(skill: str) -> str | None:
    """Returns category for a skill."""
    canonical_skill = normalize_skill(skill)
    if not canonical_skill:
        return None
        
    for category, skills in SKILL_CATEGORIES.items():
        if canonical_skill in skills:
            return category
            
    return None

def search_skills(query: str) -> list[str]:
    """Fuzzy search skills by partial match."""
    query = query.lower()
    matches = set()
    
    for category_skills in SKILL_CATEGORIES.values():
        for skill in category_skills:
            if query in skill.lower():
                matches.add(skill)
                
    for alias, canonical in ALIAS_MAP.items():
        if query in alias.lower():
            matches.add(canonical)
            
    return list(matches)

def get_related_skills(skill: str) -> list[str]:
    """Returns other skills in same category."""
    canonical_skill = normalize_skill(skill)
    if not canonical_skill:
        return []
        
    category = get_skill_category(canonical_skill)
    if not category:
        return []
        
    related = [s for s in SKILL_CATEGORIES[category] if s != canonical_skill]
    return related
