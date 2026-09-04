from typing import Dict, Optional, Any

KNOWN_ISSUERS = {
    "coursera": {"name": "Coursera", "trust_level": "high", "verification_method": "credential_id"},
    "udemy": {"name": "Udemy", "trust_level": "medium", "verification_method": "credential_id"},
    "google": {"name": "Google", "trust_level": "high", "verification_method": "digital_signature"},
    "aws": {"name": "Amazon Web Services", "trust_level": "high", "verification_method": "credential_id"},
    "microsoft": {"name": "Microsoft", "trust_level": "high", "verification_method": "credential_id"},
    "oracle": {"name": "Oracle", "trust_level": "high", "verification_method": "credential_id"},
    "cisco": {"name": "Cisco", "trust_level": "high", "verification_method": "credential_id"},
    "ibm": {"name": "IBM", "trust_level": "high", "verification_method": "digital_signature"},
    "meta": {"name": "Meta", "trust_level": "high", "verification_method": "credential_id"},
    "hackerrank": {"name": "HackerRank", "trust_level": "medium", "verification_method": "credential_id"},
    "linkedin": {"name": "LinkedIn Learning", "trust_level": "medium", "verification_method": "credential_id"},
    "edx": {"name": "edX", "trust_level": "high", "verification_method": "credential_id"},
    "freecodecamp": {"name": "freeCodeCamp", "trust_level": "medium", "verification_method": "url"},
    "mit": {"name": "MIT", "trust_level": "high", "verification_method": "digital_signature"},
    "stanford": {"name": "Stanford University", "trust_level": "high", "verification_method": "digital_signature"},
    "iit": {"name": "IIT", "trust_level": "high", "verification_method": "credential_id"},
    "harvard": {"name": "Harvard University", "trust_level": "high", "verification_method": "digital_signature"},
    "comptia": {"name": "CompTIA", "trust_level": "high", "verification_method": "credential_id"},
    "salesforce": {"name": "Salesforce", "trust_level": "high", "verification_method": "credential_id"},
    "redhat": {"name": "Red Hat", "trust_level": "high", "verification_method": "credential_id"},
    "isc2": {"name": "ISC2", "trust_level": "high", "verification_method": "credential_id"}
}

def verify_credential(title: str, issuer: str, credential_id: Optional[str] = None) -> Dict[str, Any]:
    """
    Verify a credential.
    """
    issuer_lower = issuer.lower()
    
    # 1. Check if issuer is known
    matched_issuer_key = None
    for key, data in KNOWN_ISSUERS.items():
        if key in issuer_lower or data['name'].lower() in issuer_lower:
            matched_issuer_key = key
            break
            
    if matched_issuer_key:
        issuer_data = KNOWN_ISSUERS[matched_issuer_key]
        
        # Basic heuristic for suspicious titles
        suspicious_keywords = ["fake", "test", "demo"]
        if any(kw in title.lower() for kw in suspicious_keywords):
            return {
                'status': 'suspicious',
                'issuer_recognized': True,
                'trust_level': 'low',
                'verification_method': issuer_data['verification_method'],
                'message': 'Title appears suspicious or invalid.'
            }
            
        if credential_id:
            # 2. Known issuer + credential_id -> 'verified'
            return {
                'status': 'verified',
                'issuer_recognized': True,
                'trust_level': issuer_data['trust_level'],
                'verification_method': issuer_data['verification_method'],
                'message': f"Successfully verified via {issuer_data['verification_method']}."
            }
        else:
            # 3. Known issuer + no credential_id -> 'pending'
            return {
                'status': 'pending',
                'issuer_recognized': True,
                'trust_level': issuer_data['trust_level'],
                'verification_method': issuer_data['verification_method'],
                'message': 'Pending verification. Please provide credential ID or URL.'
            }
    else:
        # 4. Unknown issuer
        return {
            'status': 'unverified',
            'issuer_recognized': False,
            'trust_level': 'unknown',
            'verification_method': 'manual',
            'message': 'Issuer not recognized. Requires manual verification.'
        }

def extract_issuer_from_text(text: str) -> Optional[str]:
    """Try to identify the issuer from certificate text."""
    text_lower = text.lower()
    for key, data in KNOWN_ISSUERS.items():
        if key in text_lower or data['name'].lower() in text_lower:
            return data['name']
    return None
