from fastapi import APIRouter
import pandas as pd
import os

router = APIRouter(prefix="/api/stats", tags=["stats"])

@router.get("/market-insights")
def get_market_insights():
    file_path = "data/jobs_dataset.csv"
    if not os.path.exists(file_path):
        return {"error": "Dataset not found"}

    df = pd.read_csv(file_path)

    # 1. Top Roles
    roles = df['job_title'].value_counts().to_dict()
    top_roles = [{"name": k, "value": v} for k, v in roles.items()]

    # 2. Remote Work Distribution
    remote = df['remote_type'].value_counts().to_dict()
    remote_distribution = [{"name": k, "value": v} for k, v in remote.items()]

    # 3. Python Skills Requirement
    python_req = df['skills_python'].value_counts().to_dict()
    # 1 means required, 0 means not required
    python_stats = {
        "required": python_req.get(1, 0),
        "not_required": python_req.get(0, 0),
        "percentage": round(python_req.get(1, 0) / len(df) * 100, 1)
    }

    # 4. Average Years of Experience by Level
    exp_by_level = df.groupby('experience_level')['years_experience'].mean().round(1).to_dict()
    
    # 5. Top Hiring Industries
    industries = df['company_industry'].value_counts().head(5).to_dict()
    top_industries = [{"name": k, "value": v} for k, v in industries.items()]

    return {
        "total_jobs_analyzed": len(df),
        "top_roles": top_roles,
        "remote_distribution": remote_distribution,
        "python_stats": python_stats,
        "exp_by_level": exp_by_level,
        "top_industries": top_industries
    }
