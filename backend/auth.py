from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
import bcrypt
import random
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from sqlalchemy.orm import Session
from database import get_db
from pydantic import BaseModel
import models
import schemas

SECRET_KEY = "skillverify-secret-key-change-in-production-2024"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440
OTP_EXPIRE_MINUTES = 5

# ──────────────────────────────────────────────
# In-memory OTP store:  email -> {otp, expires_at}
# ──────────────────────────────────────────────
otp_store: dict = {}

# ──────────────────────────────────────────────
# SMTP Configuration (Gmail example)
# Set these to enable real email sending.
# Leave SMTP_USER empty to use console-only mode.
# ──────────────────────────────────────────────
SMTP_HOST = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_USER = ""       # e.g. "yourapp@gmail.com"
SMTP_PASSWORD = ""   # e.g. "your-app-password"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/verify-otp")
router = APIRouter(prefix="/api/auth", tags=["auth"])


# ──────────────────────────────────────────────
# Password helpers
# ──────────────────────────────────────────────
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise credentials_exception
    return user


# ──────────────────────────────────────────────
# OTP helpers
# ──────────────────────────────────────────────
def generate_otp() -> str:
    """Generate a 6-digit OTP."""
    return str(random.randint(100000, 999999))

def store_otp(email: str, otp: str):
    """Store OTP with expiration."""
    otp_store[email] = {
        "otp": otp,
        "expires_at": datetime.utcnow() + timedelta(minutes=OTP_EXPIRE_MINUTES)
    }

def verify_otp_code(email: str, otp: str) -> bool:
    """Verify OTP is valid and not expired."""
    record = otp_store.get(email)
    if not record:
        return False
    if datetime.utcnow() > record["expires_at"]:
        del otp_store[email]
        return False
    if record["otp"] != otp:
        return False
    # OTP is valid — remove it (one-time use)
    del otp_store[email]
    return True

def send_otp_email(to_email: str, otp: str) -> bool:
    """
    Send OTP via email using SMTP.
    Falls back to console logging if SMTP is not configured.
    """
    print(f"\n{'='*50}")
    print(f"  OTP for {to_email}: {otp}")
    print(f"  (Valid for {OTP_EXPIRE_MINUTES} minutes)")
    print(f"{'='*50}\n")

    if not SMTP_USER or not SMTP_PASSWORD:
        print("  [SMTP not configured — OTP printed to console only]")
        return True

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"SkillVerify — Your Login OTP: {otp}"
        msg["From"] = SMTP_USER
        msg["To"] = to_email

        html = f"""
        <html>
        <body style="font-family: 'Inter', Arial, sans-serif; background: #f8fafc; padding: 40px;">
          <div style="max-width: 480px; margin: auto; background: white; border-radius: 16px; padding: 40px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
            <div style="text-align: center; margin-bottom: 24px;">
              <div style="display: inline-block; background: #1B2E35; color: white; padding: 8px 16px; border-radius: 8px; font-weight: bold; font-size: 18px;">
                🛡️ SkillVerify
              </div>
            </div>
            <h2 style="color: #1E293B; text-align: center; margin-bottom: 8px;">Login Verification</h2>
            <p style="color: #64748B; text-align: center; margin-bottom: 32px;">
              Use the following OTP to complete your sign-in. This code is valid for {OTP_EXPIRE_MINUTES} minutes.
            </p>
            <div style="background: #f0fdfa; border: 2px solid #14B8A6; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 32px;">
              <span style="font-size: 36px; font-weight: bold; letter-spacing: 12px; color: #1B2E35;">{otp}</span>
            </div>
            <p style="color: #94a3b8; text-align: center; font-size: 13px;">
              If you didn't request this code, please ignore this email.
            </p>
          </div>
        </body>
        </html>
        """
        msg.attach(MIMEText(html, "html"))

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.sendmail(SMTP_USER, to_email, msg.as_string())
        print(f"  ✅ OTP email sent to {to_email}")
        return True
    except Exception as e:
        print(f"  ⚠️ Email send failed: {e}")
        print(f"  [Falling back to console OTP]")
        return True  # Still return True — OTP was generated


# ──────────────────────────────────────────────
# Pydantic models for OTP flow
# ──────────────────────────────────────────────
class OTPResponse(BaseModel):
    otp_required: bool = True
    message: str
    email: str
    otp_preview: Optional[str] = None  # Only populated in dev/demo mode

class VerifyOTPRequest(BaseModel):
    email: str
    otp: str


# ──────────────────────────────────────────────
# Routes
# ──────────────────────────────────────────────

@router.post("/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = hash_password(user.password)
    new_user = models.User(
        email=user.email,
        password_hash=hashed_password,
        role=user.role,
        name=user.name
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    if user.role == "candidate":
        candidate_profile = models.CandidateProfile(user_id=new_user.id)
        db.add(candidate_profile)
    elif user.role == "employer":
        employer_profile = models.EmployerProfile(user_id=new_user.id, company_name=user.name)
        db.add(employer_profile)
    db.commit()
    return new_user


@router.post("/login", response_model=OTPResponse)
def login(login_req: schemas.LoginRequest, db: Session = Depends(get_db)):
    """Step 1: Validate credentials and send OTP to email."""
    user = db.query(models.User).filter(models.User.email == login_req.email).first()
    if not user or not verify_password(login_req.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    
    otp = generate_otp()
    store_otp(user.email, otp)
    send_otp_email(user.email, otp)
    
    # In demo mode (no SMTP), include OTP in response so the UI can show it
    otp_preview = otp if not SMTP_USER else None
    
    return OTPResponse(
        otp_required=True,
        message=f"OTP sent to {user.email}",
        email=user.email,
        otp_preview=otp_preview
    )


@router.post("/verify-otp", response_model=schemas.Token)
def verify_otp_endpoint(req: VerifyOTPRequest, db: Session = Depends(get_db)):
    """Step 2: Verify OTP and return JWT token."""
    if not verify_otp_code(req.email, req.otp):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired OTP. Please try again.",
        )
    
    user = db.query(models.User).filter(models.User.email == req.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/resend-otp", response_model=OTPResponse)
def resend_otp(login_req: schemas.LoginRequest, db: Session = Depends(get_db)):
    """Resend OTP (requires re-validation of credentials)."""
    user = db.query(models.User).filter(models.User.email == login_req.email).first()
    if not user or not verify_password(login_req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect credentials")
    
    otp = generate_otp()
    store_otp(user.email, otp)
    send_otp_email(user.email, otp)
    
    otp_preview = otp if not SMTP_USER else None
    
    return OTPResponse(
        otp_required=True,
        message=f"New OTP sent to {user.email}",
        email=user.email,
        otp_preview=otp_preview
    )


@router.get("/me", response_model=schemas.UserResponse)
def get_me(current_user: models.User = Depends(get_current_user)):
    return current_user
