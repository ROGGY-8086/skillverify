from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict
from datetime import datetime

class UserCreate(BaseModel):
    email: str
    password: str
    role: str
    name: str

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
    model_config = ConfigDict(from_attributes=True)

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
    employment_type: str
    experience_required: int
    education_required: Optional[str] = None
    is_active: bool
    created_at: datetime
    job_skills: List[JobSkillResponse] = []
    employer: EmployerProfileResponse
    model_config = ConfigDict(from_attributes=True)

class JobListResponse(BaseModel):
    jobs: List[JobResponse]
    total: int

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
    skill_matches: List[str]
    missing_skills: List[str]
    explanation: str
    model_config = ConfigDict(from_attributes=True)

class SkillGapResponse(BaseModel):
    target_role: str
    current_match: float
    matched_skills: List[str]
    missing_skills: List[str]
    recommendations: List[str]
    model_config = ConfigDict(from_attributes=True)
