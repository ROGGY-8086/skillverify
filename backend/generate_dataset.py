import csv
import random

job_titles = ["AI Engineer", "Machine Learning Engineer", "Data Scientist", "Data Analyst", "Business Analyst", "Data Engineer"]
company_sizes = ["Startup", "MNC", "Medium", "Enterprise"]
industries = ["Retail", "Technology", "Healthcare", "Finance", "Education", "E-commerce"]
countries = ["Canada", "Australia", "Germany", "UK", "USA", "Singapore", "India"]
remote_types = ["Remote", "Hybrid", "Onsite"]
experience_levels = ["Senior", "Mid", "Entry"]
education_levels = ["Master", "Bachelor", "PhD"]

import os
os.makedirs('data', exist_ok=True)

with open('data/jobs_dataset.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(["job_id", "job_title", "company_size", "company_industry", "country", "remote_type", "experience_level", "years_experience", "education_level", "skills_python"])
    
    for i in range(1, 10346):
        title = random.choice(job_titles)
        size = random.choice(company_sizes)
        industry = random.choice(industries)
        country = random.choice(countries)
        remote = random.choice(remote_types)
        level = random.choice(experience_levels)
        years = random.randint(0, 14)
        edu = random.choice(education_levels)
        python = random.choice([0, 1])
        
        writer.writerow([i, title, size, industry, country, remote, level, years, edu, python])

print("Dataset generated successfully at backend/data/jobs_dataset.csv")
