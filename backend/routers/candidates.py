import shutil
import os
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from typing import List, Optional

from database import get_db
from auth import get_current_user
import models
import schemas
from services import resume_parser, skill_extractor, credential_verifier, skill_taxonomy

router = APIRouter(prefix="/api/candidates", tags=["Candidates"])

@router.get("/me", response_model=schemas.CandidateProfileResponse)
def get_my_profile(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != "candidate":
        raise HTTPException(status_code=403, detail="Not authorized")
    profile = db.query(models.CandidateProfile).filter(models.CandidateProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.put("/me", response_model=schemas.CandidateProfileResponse)
def update_profile(profile_update: schemas.CandidateProfileUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != "candidate":
        raise HTTPException(status_code=403, detail="Not authorized")
    profile = db.query(models.CandidateProfile).filter(models.CandidateProfile.user_id == current_user.id).first()
    if not profile:
        profile = models.CandidateProfile(user_id=current_user.id)
        db.add(profile)
    
    for key, value in profile_update.model_dump(exclude_unset=True).items():
        setattr(profile, key, value)
    db.commit()
    db.refresh(profile)
    return profile

@router.post("/resume", response_model=List[schemas.SkillResponse])
def upload_resume(file: UploadFile = File(...), db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != "candidate":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    os.makedirs("uploads", exist_ok=True)
    file_path = f"uploads/{current_user.id}_resume.pdf"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # parse_resume returns {'raw_text': ..., 'sections': ..., 'extracted_skills': [...]}
    parsed_data = resume_parser.parse_resume(file_path)
    extracted_skills = parsed_data.get("extracted_skills", [])
    
    # If no skills extracted from sections, try full text extraction
    if not extracted_skills and parsed_data.get("raw_text"):
        extracted_skills = skill_extractor.extract_skills(parsed_data["raw_text"], evidence_type="resume")
    
    profile = db.query(models.CandidateProfile).filter(models.CandidateProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found. Create profile first.")
    
    result_skills = []
    for skill in extracted_skills:
        normalized = skill.get("normalized_skill") or skill_taxonomy.normalize_skill(skill.get("skill_name", ""))
        if not normalized:
            continue
            
        existing_skill = db.query(models.CandidateSkill).filter(
            models.CandidateSkill.candidate_id == profile.id,
            models.CandidateSkill.normalized_skill == normalized
        ).first()
        
        confidence = skill.get("confidence_score", 0.5)
        proficiency = skill.get("proficiency_level", "intermediate")
        
        if existing_skill:
            if confidence > existing_skill.confidence_score:
                existing_skill.confidence_score = confidence
                existing_skill.proficiency_level = proficiency
                existing_skill.evidence_type = skill.get("evidence_type", "resume")
        else:
            new_skill = models.CandidateSkill(
                candidate_id=profile.id,
                skill_name=skill.get("skill_name", normalized),
                normalized_skill=normalized,
                proficiency_level=proficiency,
                confidence_score=confidence,
                evidence_type=skill.get("evidence_type", "resume"),
                verified=False
            )
            db.add(new_skill)
            existing_skill = new_skill
            
        db.commit()
        db.refresh(existing_skill)
        result_skills.append(existing_skill)
        
    return result_skills

@router.post("/credentials", response_model=schemas.CredentialResponse)
def upload_credential(
    title: str = Form(...),
    issuer: str = Form(...),
    credential_id_value: str = Form(""),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role != "candidate":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    profile = db.query(models.CandidateProfile).filter(models.CandidateProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    file_path = None
    if file:
        os.makedirs("uploads", exist_ok=True)
        file_path = f"uploads/{current_user.id}_credential_{file.filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    
    # verify_credential returns a dict with 'status', 'issuer_recognized', etc.
    verification_result = credential_verifier.verify_credential(
        title=title,
        issuer=issuer,
        credential_id=credential_id_value if credential_id_value else None
    )
    
    credential = models.Credential(
        candidate_id=profile.id,
        title=title,
        issuer=issuer,
        credential_id_value=credential_id_value if credential_id_value else None,
        file_path=file_path,
        status=verification_result.get("status", "pending")
    )
    db.add(credential)
    db.commit()
    db.refresh(credential)
    
    if verification_result.get("status") == "verified":
        # Extract skills from the credential title
        extracted_skills = skill_extractor.extract_skills(title, evidence_type="credential")
        for skill in extracted_skills:
            normalized = skill.get("normalized_skill") or skill_taxonomy.normalize_skill(skill.get("skill_name", ""))
            if not normalized:
                continue
            existing_skill = db.query(models.CandidateSkill).filter(
                models.CandidateSkill.candidate_id == profile.id,
                models.CandidateSkill.normalized_skill == normalized
            ).first()
            if not existing_skill:
                new_skill = models.CandidateSkill(
                    candidate_id=profile.id,
                    skill_name=skill.get("skill_name", normalized),
                    normalized_skill=normalized,
                    proficiency_level="intermediate",
                    confidence_score=0.9,
                    evidence_type="credential",
                    verified=True
                )
                db.add(new_skill)
            else:
                existing_skill.verified = True
                existing_skill.evidence_type = "credential"
                if existing_skill.confidence_score < 0.9:
                    existing_skill.confidence_score = 0.9
        db.commit()
        
    return credential

@router.get("/skills", response_model=List[schemas.SkillResponse])
def get_my_skills(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    profile = db.query(models.CandidateProfile).filter(models.CandidateProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    skills = db.query(models.CandidateSkill).filter(models.CandidateSkill.candidate_id == profile.id).all()
    return skills

@router.get("/{candidate_id}", response_model=schemas.CandidateProfileResponse)
def get_candidate_profile(candidate_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != "employer":
        raise HTTPException(status_code=403, detail="Not authorized")
    profile = db.query(models.CandidateProfile).filter(models.CandidateProfile.id == candidate_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return profile
