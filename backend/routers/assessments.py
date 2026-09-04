from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from auth import get_current_user
import models
import schemas
from services import skill_taxonomy
import json
import random
from datetime import datetime

router = APIRouter(prefix="/api/assessments", tags=["Assessments"])

@router.get("/results", response_model=List[schemas.AssessmentResultResponse])
def get_assessment_results(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != "candidate":
        raise HTTPException(status_code=403, detail="Not authorized")
    profile = db.query(models.CandidateProfile).filter(models.CandidateProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
        
    results = db.query(models.AssessmentResult).filter(models.AssessmentResult.candidate_id == profile.id).all()
    return results

@router.get("/available")
def list_available_assessments(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != "candidate":
        raise HTTPException(status_code=403, detail="Not authorized")
    skills = db.query(models.Assessment.skill_name).distinct().all()
    return [s[0] for s in skills]

@router.get("/{skill_name}", response_model=List[schemas.AssessmentQuestionResponse])
def get_assessment(skill_name: str, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != "candidate":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Try normalized name first, then raw name
    normalized = skill_taxonomy.normalize_skill(skill_name)
    search_name = normalized if normalized else skill_name
    
    questions = db.query(models.Assessment).filter(models.Assessment.skill_name == search_name).all()
    if not questions:
        questions = db.query(models.Assessment).filter(models.Assessment.skill_name == skill_name).all()
        if not questions:
            raise HTTPException(status_code=404, detail="Assessment not found")
    
    random.shuffle(questions)
    
    # Return questions without correct_answer, parse options from JSON
    result = []
    for q in questions:
        try:
            options = json.loads(q.options) if isinstance(q.options, str) else q.options
        except (json.JSONDecodeError, TypeError):
            options = []
        result.append({
            "id": q.id,
            "question": q.question,
            "options": options,
            "difficulty": q.difficulty
        })
    return result

@router.post("/{skill_name}/submit", response_model=schemas.AssessmentResultResponse)
def submit_assessment(skill_name: str, submission: schemas.AssessmentSubmit, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != "candidate":
        raise HTTPException(status_code=403, detail="Not authorized")
        
    profile = db.query(models.CandidateProfile).filter(models.CandidateProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    # Try normalized name
    normalized = skill_taxonomy.normalize_skill(skill_name)
    search_name = normalized if normalized else skill_name
    
    questions = db.query(models.Assessment).filter(models.Assessment.skill_name == search_name).all()
    if not questions:
        questions = db.query(models.Assessment).filter(models.Assessment.skill_name == skill_name).all()
        if not questions:
            raise HTTPException(status_code=404, detail="Assessment not found")
        
    correct = 0
    total = len(questions)
    question_map = {q.id: q.correct_answer for q in questions}
    
    # submission.answers is Dict[int, int] -> {question_id: selected_option_index}
    for question_id_str, selected_option in submission.answers.items():
        question_id = int(question_id_str)
        if question_id in question_map and question_map[question_id] == selected_option:
            correct += 1
            
    score = (correct / total) * 100 if total > 0 else 0
    level = "basic"
    if score > 70:
        level = "advanced"
    elif score > 40:
        level = "intermediate"
        
    result = models.AssessmentResult(
        candidate_id=profile.id,
        skill_name=search_name,
        score=score,
        level=level,
        completed_at=datetime.utcnow()
    )
    db.add(result)
    
    # Update or create skill with assessment evidence
    existing_skill = db.query(models.CandidateSkill).filter(
        models.CandidateSkill.candidate_id == profile.id,
        models.CandidateSkill.normalized_skill == search_name
    ).first()
    
    confidence = min(0.95, score / 100)
    
    if existing_skill:
        if confidence > existing_skill.confidence_score:
            existing_skill.confidence_score = confidence
            existing_skill.proficiency_level = level
            existing_skill.evidence_type = "assessment"
            existing_skill.verified = True
    else:
        new_skill = models.CandidateSkill(
            candidate_id=profile.id,
            skill_name=search_name,
            normalized_skill=search_name,
            proficiency_level=level,
            confidence_score=confidence,
            evidence_type="assessment",
            verified=True
        )
        db.add(new_skill)
        
    db.commit()
    db.refresh(result)
    return result
