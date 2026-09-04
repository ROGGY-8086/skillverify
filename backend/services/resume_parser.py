import re
from typing import Dict, Any

try:
    import PyPDF2
except ImportError:
    PyPDF2 = None

from services.skill_extractor import extract_skills_from_sections

def extract_text_from_pdf(file_path: str) -> str:
    """Extract all text from a PDF file."""
    if PyPDF2 is None:
        return f"Error: PyPDF2 is not installed. Could not extract from {file_path}"
        
    try:
        text = ""
        with open(file_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            for page_num in range(len(reader.pages)):
                page = reader.pages[page_num]
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        return text
    except Exception as e:
        print(f"Error extracting PDF: {e}")
        return ""

def identify_sections(text: str) -> Dict[str, str]:
    """
    Identify resume sections and return dict.
    """
    sections = {
        'summary': '',
        'education': '',
        'experience': '',
        'skills': '',
        'projects': '',
        'certifications': '',
        'other': ''
    }
    
    # Common section headers
    headers_regex = {
        'summary': r'^(SUMMARY|PROFILE|OBJECTIVE|ABOUT ME)\b',
        'education': r'^(EDUCATION|ACADEMICS|ACADEMIC BACKGROUND)\b',
        'experience': r'^(EXPERIENCE|WORK EXPERIENCE|EMPLOYMENT HISTORY|WORK HISTORY)\b',
        'skills': r'^(SKILLS|TECHNICAL SKILLS|CORE COMPETENCIES)\b',
        'projects': r'^(PROJECTS|PERSONAL PROJECTS|ACADEMIC PROJECTS)\b',
        'certifications': r'^(CERTIFICATIONS|COURSES|TRAINING)\b'
    }
    
    current_section = 'other'
    lines = text.split('\n')
    
    for line in lines:
        line_clean = line.strip().upper()
        found_header = False
        
        # Check if line matches any section header
        for sec_name, regex in headers_regex.items():
            if re.match(regex, line_clean):
                current_section = sec_name
                found_header = True
                break
                
        if not found_header and line.strip():
            sections[current_section] += line + "\n"
            
    return sections

def parse_resume(file_path: str) -> Dict[str, Any]:
    """
    Full resume parsing pipeline.
    """
    raw_text = extract_text_from_pdf(file_path)
    
    if not raw_text or raw_text.startswith("Error:"):
        # Fallback or handle error
        return {
            'raw_text': raw_text,
            'sections': {},
            'extracted_skills': []
        }
        
    sections = identify_sections(raw_text)
    extracted_skills = extract_skills_from_sections(sections)
    
    return {
        'raw_text': raw_text,
        'sections': sections,
        'extracted_skills': extracted_skills
    }
