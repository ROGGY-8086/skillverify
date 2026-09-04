# SkillVerify — AI-Powered Skill Credential Verification & Employment Matching Platform

An AI-powered trusted employment platform that verifies credentials, understands candidate skills, and intelligently matches verified talent with the right job opportunities.

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+

### Backend Setup
```bash
cd backend
pip3 install -r requirements.txt
python3 seed.py          # Seed demo data
python3 -m uvicorn main:app --reload --port 8000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Access
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

### Demo Accounts
| Role | Email | Password |
|------|-------|----------|
| Candidate | rahul@example.com | password123 |
| Candidate | priya@example.com | password123 |
| Candidate | amit@example.com | password123 |
| Employer | hr@techcorp.com | password123 |
| Employer | hr@datamind.com | password123 |

## 🏗️ Architecture

```
Frontend (React + Tailwind)  →  Backend API (FastAPI)  →  SQLite DB
                                      ↓
                              AI Services Layer
                         ├── Skill Taxonomy (200+ skills)
                         ├── Skill Extractor (NLP)
                         ├── Resume Parser (PDF)
                         ├── Credential Verifier
                         └── Job Matcher (weighted scoring)
```

## ✨ Key Features

### For Candidates
- 📄 **Resume Upload** — AI extracts skills from PDF resumes
- 🎓 **Credential Verification** — Verify certificates from 20+ known issuers
- 📊 **Skill Trust Profile** — Skills scored by confidence (credential > assessment > project > resume)
- 📝 **Skill Assessments** — MCQ-based tests that boost skill confidence
- 💼 **Job Recommendations** — AI-ranked jobs with match scores and skill gap analysis

### For Employers
- 📢 **Job Postings** — Create jobs with required/preferred skills from taxonomy
- 🔍 **Candidate Search** — AI-ranked candidates with match scores
- ✅ **Verified Skills** — See credential verification status for each candidate
- 📈 **Match Scoring** — Weighted algorithm (skills 40%, proficiency 20%, experience 15%, credentials 10%, assessment 10%, education 5%)

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| Frontend | React 18, Tailwind CSS, Vite, React Router v6, Lucide Icons |
| Backend | Python FastAPI, SQLAlchemy, SQLite |
| Auth | JWT (python-jose), bcrypt |
| AI/NLP | Rule-based skill extraction, TF-IDF similarity, weighted matching |
| Doc Processing | PyPDF2 for PDF parsing |

## 📁 Project Structure

```
skillverify/
├── backend/
│   ├── main.py              # FastAPI app
│   ├── database.py          # SQLite setup
│   ├── models.py            # 9 ORM models
│   ├── schemas.py           # Pydantic schemas
│   ├── auth.py              # JWT auth
│   ├── seed.py              # Demo data
│   ├── routers/             # API endpoints
│   │   ├── candidates.py
│   │   ├── employers.py
│   │   ├── jobs.py
│   │   ├── skills.py
│   │   ├── assessments.py
│   │   └── matching.py
│   └── services/            # AI engine
│       ├── skill_taxonomy.py
│       ├── skill_extractor.py
│       ├── resume_parser.py
│       ├── credential_verifier.py
│       └── job_matcher.py
├── frontend/
│   └── src/
│       ├── pages/           # 12 pages
│       ├── components/      # 8 shared components
│       ├── context/         # Auth state
│       └── api/             # API client
└── README.md
```

## 💡 Core Differentiator

> "Don't just tell employers what you can do — prove it."

Traditional job portals match resumes to jobs via keyword search. SkillVerify:
1. **Extracts** skills from resumes, projects, and certificates using AI
2. **Verifies** credentials against known issuers
3. **Assesses** candidates with skill-specific tests
4. **Scores** each skill with a confidence level based on evidence hierarchy
5. **Matches** candidates to jobs using a weighted multi-factor algorithm
