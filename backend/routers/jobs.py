from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from auth import get_current_user
import models
import schemas
from services import skill_taxonomy, job_matcher

router = APIRouter(prefix="/api/jobs", tags=["Jobs"])

@router.post("", response_model=schemas.JobResponse)
def create_job(job_create: schemas.JobCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != "employer":
        raise HTTPException(status_code=403, detail="Not authorized")
        
    employer = db.query(models.EmployerProfile).filter(models.EmployerProfile.user_id == current_user.id).first()
    if not employer:
        raise HTTPException(status_code=404, detail="Employer profile not found")
        
    job_data = job_create.model_dump(exclude={"skills"})
    job = models.Job(**job_data, employer_id=employer.id)
    db.add(job)
    db.commit()
    db.refresh(job)
    
    job_skills = []
    if job_create.skills:
        for sk in job_create.skills:
            normalized = skill_taxonomy.normalize_skill(sk.skill_name)
            js = models.JobSkill(
                job_id=job.id,
                skill_name=sk.skill_name,
                normalized_skill=normalized,
                is_required=sk.is_required,
                min_proficiency=sk.min_proficiency
            )
            db.add(js)
            job_skills.append(js)
        db.commit()
        
    return {
        **job.__dict__,
        "employer": employer,
        "skills": job_skills
    }

@router.get("", response_model=schemas.JobListResponse)
def list_jobs(
    q: Optional[str] = None,
    location: Optional[str] = None,
    employment_type: Optional[str] = None,
    skill: Optional[str] = None,
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    query = db.query(models.Job).filter(models.Job.is_active == True)
    
    if q:
        query = query.filter(models.Job.title.ilike(f"%{q}%") | models.Job.description.ilike(f"%{q}%"))
    if location:
        query = query.filter(models.Job.location.ilike(f"%{location}%"))
    if employment_type:
        query = query.filter(models.Job.employment_type == employment_type)
    if skill:
        normalized = skill_taxonomy.normalize_skill(skill)
        query = query.join(models.JobSkill).filter(models.JobSkill.normalized_skill == normalized)
        
    total = query.count()
    jobs = query.offset(skip).limit(limit).all()
    
    return {"total": total, "items": jobs}

@router.get("/{job_id}", response_model=schemas.JobResponse)
def get_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    skills = db.query(models.JobSkill).filter(models.JobSkill.job_id == job.id).all()
    employer = db.query(models.EmployerProfile).filter(models.EmployerProfile.id == job.employer_id).first()
    
    return {
        **job.__dict__,
        "employer": employer,
        "skills": skills
    }

@router.put("/{job_id}", response_model=schemas.JobResponse)
def update_job(job_id: int, job_update: schemas.JobCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    employer = db.query(models.EmployerProfile).filter(models.EmployerProfile.user_id == current_user.id).first()
    if not employer or job.employer_id != employer.id:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    update_data = job_update.model_dump(exclude={"skills"}, exclude_unset=True)
    for key, value in update_data.items():
        setattr(job, key, value)
        
    if job_update.skills is not None:
        db.query(models.JobSkill).filter(models.JobSkill.job_id == job.id).delete()
        for sk in job_update.skills:
            normalized = skill_taxonomy.normalize_skill(sk.skill_name)
            js = models.JobSkill(
                job_id=job.id,
                skill_name=sk.skill_name,
                normalized_skill=normalized,
                is_required=sk.is_required,
                min_proficiency=sk.min_proficiency
            )
            db.add(js)
            
    db.commit()
    db.refresh(job)
    
    skills = db.query(models.JobSkill).filter(models.JobSkill.job_id == job.id).all()
    
    return {
        **job.__dict__,
        "employer": employer,
        "skills": skills
    }

@router.delete("/{job_id}")
def delete_job(job_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    employer = db.query(models.EmployerProfile).filter(models.EmployerProfile.user_id == current_user.id).first()
    if not employer or job.employer_id != employer.id:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    job.is_active = False
    db.commit()
    return {"message": "Job deleted"}

@router.get("/{job_id}/candidates", response_model=List[schemas.MatchScoreResponse])
def get_job_candidates(job_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    employer = db.query(models.EmployerProfile).filter(models.EmployerProfile.user_id == current_user.id).first()
    if not employer or job.employer_id != employer.id:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    ranked_candidates = job_matcher.rank_candidates_for_job(job_id, db)
    return ranked_candidates
