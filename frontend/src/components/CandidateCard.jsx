import React from 'react';
import { MapPin, Briefcase } from 'lucide-react';
import SkillBadge from './SkillBadge';
import MatchScoreCard from './MatchScoreCard';

const CandidateCard = ({ candidate, matchScore, onClick }) => {
  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all cursor-pointer group"
      onClick={() => onClick && onClick(candidate.id)}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-grow">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-lg font-semibold text-slate-900 group-hover:text-accent transition-colors">
              {candidate.name}
            </h3>
            {candidate.isVerified && (
              <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Verified
              </span>
            )}
          </div>
          <p className="text-slate-600 font-medium mb-3">{candidate.headline || 'Software Engineer'}</p>
          
          <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-4">
            {candidate.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                <span>{candidate.location}</span>
              </div>
            )}
            {candidate.experienceYears !== undefined && (
              <div className="flex items-center gap-1.5">
                <Briefcase className="h-4 w-4" />
                <span>{candidate.experienceYears} Yrs Exp.</span>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Top Skills</p>
            <div className="flex flex-wrap gap-2">
              {candidate.skills?.slice(0, 4).map((skill, idx) => (
                <SkillBadge 
                  key={idx} 
                  skill={typeof skill === 'string' ? skill : skill.name} 
                  proficiency={skill.proficiency || 'intermediate'}
                  verified={skill.verified}
                />
              ))}
              {candidate.skills?.length > 4 && (
                <span className="text-xs text-slate-500 self-center">+{candidate.skills.length - 4} more</span>
              )}
            </div>
          </div>
        </div>
        
        {matchScore !== undefined && (
          <div className="flex flex-col items-center gap-2">
            <MatchScoreCard score={matchScore} size="md" />
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateCard;
