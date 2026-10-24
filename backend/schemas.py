from pydantic import BaseModel, ConfigDict, model_validator
from typing import Optional, List, Dict, Any
from datetime import datetime

class UserCreate(BaseModel):
    email: str
    password: str
    role: str
    name: str
    company_name: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    email: str
    role: str
    name: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str

class LoginRequest(BaseModel):
    email: str
    password: str

class SkillResponse(BaseModel):
    id: int
    skill_name: str
    normalized_skill: str
    proficiency_level: str
    confidence_score: float
    evidence_type: str
    verified: bool
    model_config = ConfigDict(from_attributes=True)

class CredentialResponse(BaseModel):
    id: int
    title: str
    issuer: Optional[str] = None
    credential_id_value: Optional[str] = None
    status: str
    uploaded_at: datetime
    verified_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)

class CandidateProfileUpdate(BaseModel):
    headline: Optional[str] = None
    bio: Optional[str] = None
    education: Optional[str] = None
    experience_years: Optional[int] = None
    github_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    location: Optional[str] = None
    career_preferences: Optional[str] = None

class CandidateProfileResponse(CandidateProfileUpdate):
    id: int
    user_id: int
    skills: List[SkillResponse] = []
    credentials: List[CredentialResponse] = []
    model_config = ConfigDict(from_attributes=True)

class EmployerProfileUpdate(BaseModel):
    company_name: Optional[str] = None
    industry: Optional[str] = None
    company_size: Optional[str] = None
    website: Optional[str] = None
    description: Optional[str] = None

class EmployerProfileResponse(EmployerProfileUpdate):
    id: int
    user_id: int
    model_config = ConfigDict(from_attributes=True)

class JobSkillCreate(BaseModel):
    skill_name: str
    is_required: bool = True
    min_proficiency: str = "basic"

class JobSkillResponse(JobSkillCreate):
    id: int
    normalized_skill: str
    name: Optional[str] = None
    proficiency: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

    @model_validator(mode="after")
    def populate_skill_aliases(self):
        if not self.name:
            self.name = self.skill_name
        if not self.proficiency:
            self.proficiency = self.min_proficiency
        return self

class JobCreate(BaseModel):
    title: str
    description: str
    location: Optional[str] = None
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    employment_type: str = "full-time"
    experience_required: int = 0
    education_required: Optional[str] = None
    skills: List[JobSkillCreate] = []

class JobResponse(BaseModel):
    id: int
    employer_id: int
    title: str
    description: str
    location: Optional[str] = None
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    employment_type: str = "full-time"
    experience_required: int = 0
    education_required: Optional[str] = None
    is_active: bool = True
    created_at: datetime
    job_skills: List[JobSkillResponse] = []
    skills: List[JobSkillResponse] = []
    employer: Optional[EmployerProfileResponse] = None
    company: Optional[str] = None
    company_name: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

    @model_validator(mode="after")
    def populate_aliases(self):
        if not self.skills and self.job_skills:
            self.skills = self.job_skills
        elif not self.job_skills and self.skills:
            self.job_skills = self.skills
        if not self.company and self.employer:
            self.company = self.employer.company_name
            self.company_name = self.employer.company_name
        return self

class JobListResponse(BaseModel):
    jobs: List[JobResponse] = []
    items: List[JobResponse] = []
    total: int = 0
    model_config = ConfigDict(from_attributes=True)

    @model_validator(mode="after")
    def sync_items(self):
        if not self.jobs and self.items:
            self.jobs = self.items
        elif not self.items and self.jobs:
            self.items = self.jobs
        return self

class AssessmentQuestionResponse(BaseModel):
    id: int
    question: str
    options: List[str]
    difficulty: str
    model_config = ConfigDict(from_attributes=True)

class AssessmentSubmit(BaseModel):
    answers: Dict[int, int]

class AssessmentResultResponse(BaseModel):
    skill_name: str
    score: float
    level: str
    completed_at: datetime
    model_config = ConfigDict(from_attributes=True)

class MatchScoreResponse(BaseModel):
    job_id: Optional[int] = None
    candidate_id: Optional[int] = None
    match_score: float
    skill_matches: List[str] = []
    missing_skills: List[str] = []
    explanation: str = ""
    job_title: Optional[str] = None
    title: Optional[str] = None
    company_name: Optional[str] = None
    company: Optional[str] = None
    location: Optional[str] = None
    employment_type: Optional[str] = None
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    skills: List[Dict[str, Any]] = []
    job: Optional[Dict[str, Any]] = None
    candidate_name: Optional[str] = None
    candidate_headline: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

class SkillGapResponse(BaseModel):
    target_role: str
    current_match: float
    matched_skills: List[str]
    missing_skills: List[str]
    recommendations: List[str]
    model_config = ConfigDict(from_attributes=True)
