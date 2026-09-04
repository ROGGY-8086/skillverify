import React from 'react';
import { CheckCircle2, FileText, Code, GraduationCap, Link as LinkIcon } from 'lucide-react';

const getProficiencyColor = (proficiency) => {
  switch (proficiency?.toLowerCase()) {
    case 'advanced':
    case 'expert':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'intermediate':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'basic':
    case 'beginner':
    default:
      return 'bg-slate-100 text-slate-800 border-slate-200';
  }
};

const getEvidenceIcon = (type) => {
  switch (type?.toLowerCase()) {
    case 'assessment':
      return <CheckCircle2 className="h-3 w-3" />;
    case 'resume':
      return <FileText className="h-3 w-3" />;
    case 'github':
    case 'portfolio':
      return <Code className="h-3 w-3" />;
    case 'certification':
    case 'degree':
      return <GraduationCap className="h-3 w-3" />;
    default:
      return <LinkIcon className="h-3 w-3" />;
  }
};

const SkillBadge = ({ skill, proficiency, confidence, evidenceType, verified = false }) => {
  const colorClass = getProficiencyColor(proficiency);
  
  return (
    <div 
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${colorClass} group relative cursor-default`}
      title={confidence ? `Confidence: ${Math.round(confidence * 100)}%` : undefined}
    >
      {verified && <CheckCircle2 className="h-3.5 w-3.5 text-success" />}
      <span>{skill}</span>
      {evidenceType && (
        <span className="opacity-70 ml-1" title={`Evidence: ${evidenceType}`}>
          {getEvidenceIcon(evidenceType)}
        </span>
      )}
    </div>
  );
};

export default SkillBadge;
