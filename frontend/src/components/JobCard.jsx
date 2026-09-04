import React from 'react';
import { MapPin, Briefcase, DollarSign } from 'lucide-react';
import SkillBadge from './SkillBadge';
import MatchScoreCard from './MatchScoreCard';

const JobCard = ({ job, matchScore, onApply }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-grow">
          <h3 className="text-lg font-semibold text-slate-900 mb-1">{job.title}</h3>
          <p className="text-slate-600 font-medium mb-4">{job.company || 'Company Name'}</p>
          
          <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-4">
            {job.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                <span>{job.location}</span>
              </div>
            )}
            {job.employmentType && (
              <div className="flex items-center gap-1.5">
                <Briefcase className="h-4 w-4" />
                <span>{job.employmentType}</span>
              </div>
            )}
            {(job.salaryMin || job.salaryMax) && (
              <div className="flex items-center gap-1.5">
                <DollarSign className="h-4 w-4" />
                <span>${job.salaryMin?.toLocaleString()} - ${job.salaryMax?.toLocaleString()}</span>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Required Skills</p>
            <div className="flex flex-wrap gap-2">
              {job.skills?.slice(0, 5).map((skill, idx) => (
                <SkillBadge 
                  key={idx} 
                  skill={typeof skill === 'string' ? skill : skill.name} 
                  proficiency={skill.proficiency || 'intermediate'} 
                />
              ))}
              {job.skills?.length > 5 && (
                <span className="text-xs text-slate-500 self-center">+{job.skills.length - 5} more</span>
              )}
            </div>
          </div>
        </div>
        
        {matchScore !== undefined ? (
          <div className="flex flex-col items-center gap-3">
            <MatchScoreCard score={matchScore} size="md" />
            {onApply && (
              <button 
                onClick={() => onApply(job.id)}
                className="w-full bg-accent text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-600 transition-colors"
              >
                Apply Now
              </button>
            )}
          </div>
        ) : (
          onApply && (
            <button 
              onClick={() => onApply(job.id)}
              className="shrink-0 bg-accent text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-600 transition-colors"
            >
              Apply Now
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default JobCard;
