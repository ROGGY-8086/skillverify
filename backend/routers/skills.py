from fastapi import APIRouter
from services import skill_taxonomy

router = APIRouter(prefix="/api/skills", tags=["Skills"])

@router.get("/taxonomy")
def get_taxonomy():
    return skill_taxonomy.SKILL_CATEGORIES

@router.get("/search")
def search_skills(q: str):
    return skill_taxonomy.search_skills(q)
