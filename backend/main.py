from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from database import engine, Base
from auth import router as auth_router
from routers.candidates import router as candidates_router
from routers.employers import router as employers_router
from routers.jobs import router as jobs_router
from routers.skills import router as skills_router
from routers.assessments import router as assessments_router
from routers.matching import router as matching_router
from routers.stats import router as stats_router

# Create tables
Base.metadata.create_all(bind=engine)

# Auto-seed initial demo dataset if fresh deployment
def auto_seed_if_empty():
    from database import SessionLocal
    import models
    db = SessionLocal()
    try:
        user_count = db.query(models.User).count()
        if user_count == 0:
            print("Database empty. Auto-seeding initial dataset...")
            try:
                from seed import seed
                seed()
                print("Auto-seeding completed successfully!")
            except Exception as se:
                print("Seed script error:", se)
    except Exception as e:
        print("Auto-seed check error:", e)
    finally:
        db.close()

auto_seed_if_empty()

# Create uploads directory if not exists
os.makedirs("uploads", exist_ok=True)

app = FastAPI(
    title="SkillVerify API",
    version="1.0.0"
)

# CORS setup - allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers BEFORE static mount
app.include_router(auth_router)
app.include_router(candidates_router)
app.include_router(employers_router)
app.include_router(jobs_router)
app.include_router(skills_router)
app.include_router(assessments_router)
app.include_router(matching_router)
app.include_router(stats_router)

# Static files mount AFTER routers
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
def read_root():
    return {"message": "SkillVerify API", "version": "1.0.0"}
