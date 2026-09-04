from datetime import datetime
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, Text, DateTime
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    role = Column(String) # 'candidate' or 'employer'
    name = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    candidate_profile = relationship("CandidateProfile", back_populates="user", uselist=False)
    employer_profile = relationship("EmployerProfile", back_populates="user", uselist=False)

class CandidateProfile(Base):
    __tablename__ = "candidate_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    headline = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    education = Column(String, nullable=True)
    experience_years = Column(Integer, default=0)
    github_url = Column(String, nullable=True)
    portfolio_url = Column(String, nullable=True)
    location = Column(String, nullable=True)
    career_preferences = Column(Text, nullable=True)

    user = relationship("User", back_populates="candidate_profile")
    skills = relationship("CandidateSkill", back_populates="candidate")
    credentials = relationship("Credential", back_populates="candidate")
    assessment_results = relationship("AssessmentResult", back_populates="candidate")

class CandidateSkill(Base):
    __tablename__ = "candidate_skills"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidate_profiles.id"))
    skill_name = Column(String)
    normalized_skill = Column(String)
    proficiency_level = Column(String) # basic/intermediate/advanced
    confidence_score = Column(Float)
    evidence_type = Column(String) # credential/assessment/project/resume/self-declared
    verified = Column(Boolean, default=False)

    candidate = relationship("CandidateProfile", back_populates="skills")

class Credential(Base):
    __tablename__ = "credentials"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidate_profiles.id"))
    title = Column(String)
    issuer = Column(String, nullable=True)
    credential_id_value = Column(String, nullable=True)
    file_path = Column(String, nullable=True)
    status = Column(String, default="pending") # verified/pending/unverified/suspicious
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    verified_at = Column(DateTime, nullable=True)

    candidate = relationship("CandidateProfile", back_populates="credentials")

class EmployerProfile(Base):
    __tablename__ = "employer_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    company_name = Column(String)
    industry = Column(String, nullable=True)
    company_size = Column(String, nullable=True)
    website = Column(String, nullable=True)
    description = Column(Text, nullable=True)

    user = relationship("User", back_populates="employer_profile")
    jobs = relationship("Job", back_populates="employer")

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    employer_id = Column(Integer, ForeignKey("employer_profiles.id"))
    title = Column(String)
    description = Column(Text)
    location = Column(String, nullable=True)
    salary_min = Column(Integer, nullable=True)
    salary_max = Column(Integer, nullable=True)
    employment_type = Column(String, default="full-time")
    experience_required = Column(Integer, default=0)
    education_required = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    employer = relationship("EmployerProfile", back_populates="jobs")
    job_skills = relationship("JobSkill", back_populates="job")

class JobSkill(Base):
    __tablename__ = "job_skills"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"))
    skill_name = Column(String)
    normalized_skill = Column(String)
    is_required = Column(Boolean, default=True)
    min_proficiency = Column(String, default="basic")

    job = relationship("Job", back_populates="job_skills")

class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    skill_name = Column(String)
    question = Column(Text)
    options = Column(Text) # JSON string of list
    correct_answer = Column(Integer) # index 0-3
    difficulty = Column(String) # easy/medium/hard

class AssessmentResult(Base):
    __tablename__ = "assessment_results"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidate_profiles.id"))
    skill_name = Column(String)
    score = Column(Float)
    level = Column(String) # basic/intermediate/advanced
    completed_at = Column(DateTime, default=datetime.utcnow)

    candidate = relationship("CandidateProfile", back_populates="assessment_results")
