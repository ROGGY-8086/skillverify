from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from auth import get_current_user
import models
import schemas
from services import job_matcher

router = APIRouter(prefix="/api/matching", tags=["Matching"])

@router.get("/jobs", response_model=List[schemas.MatchScoreResponse])
def get_recommended_jobs(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != "candidate":
        raise HTTPException(status_code=403, detail="Not authorized")
    profile = db.query(models.CandidateProfile).filter(models.CandidateProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
        
    matches = job_matcher.recommend_jobs_for_candidate(profile.id, db)
    return matches

@router.get("/candidates", response_model=List[schemas.MatchScoreResponse])
def get_matched_candidates(job_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != "employer":
        raise HTTPException(status_code=403, detail="Not authorized")
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    employer = db.query(models.EmployerProfile).filter(models.EmployerProfile.user_id == current_user.id).first()
    if not employer or job.employer_id != employer.id:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    matches = job_matcher.rank_candidates_for_job(job_id, db)
    return matches

@router.get("/skill-gap", response_model=schemas.SkillGapResponse)
def get_skill_gap(job_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != "candidate":
        raise HTTPException(status_code=403, detail="Not authorized")
    profile = db.query(models.CandidateProfile).filter(models.CandidateProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
        
    gap = job_matcher.analyze_skill_gap(profile.id, job_id, db)
    return gap
