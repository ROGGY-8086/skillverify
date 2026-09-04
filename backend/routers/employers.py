from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from auth import get_current_user
import models
import schemas

router = APIRouter(prefix="/api/employers", tags=["Employers"])

@router.get("/me", response_model=schemas.EmployerProfileResponse)
def get_my_profile(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != "employer":
        raise HTTPException(status_code=403, detail="Not authorized")
    profile = db.query(models.EmployerProfile).filter(models.EmployerProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    return {
        **profile.__dict__,
        "user": current_user
    }

@router.put("/me", response_model=schemas.EmployerProfileResponse)
def update_profile(profile_update: schemas.EmployerProfileUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != "employer":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    profile = db.query(models.EmployerProfile).filter(models.EmployerProfile.user_id == current_user.id).first()
    if not profile:
        profile = models.EmployerProfile(user_id=current_user.id)
        db.add(profile)
        
    for key, value in profile_update.model_dump(exclude_unset=True).items():
        setattr(profile, key, value)
    db.commit()
    db.refresh(profile)
    
    return {
        **profile.__dict__,
        "user": current_user
    }
