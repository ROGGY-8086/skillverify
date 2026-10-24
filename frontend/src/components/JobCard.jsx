import React from 'react';
import { MapPin, Briefcase, DollarSign, CheckCircle2 } from 'lucide-react';
import SkillBadge from './SkillBadge';
import MatchScoreCard from './MatchScoreCard';

const JobCard = ({ job, matchScore, onApply }) => {
  if (!job) return null;

  const title = job.title || job.job_title || job.job?.title || 'Job Opening';
  const company = job.company || job.company_name || job.employer?.company_name || job.job?.company || 'Company';
  const location = job.location || job.job?.location;
  const employmentType = job.employmentType || job.employment_type || job.job?.employment_type;
  const salaryMin = job.salaryMin || job.salary_min || job.job?.salary_min;
  const salaryMax = job.salaryMax || job.salary_max || job.job?.salary_max;
  const skillsList = job.skills || job.job_skills || job.job?.skills || [];
  const matchedSkills = job.skill_matches || [];
  const finalScore = matchScore !== undefined ? matchScore : job.match_score;
  const jobId = job.id || job.job_id || job.job?.id;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow flex flex-col justify-between">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-grow">
          <h3 className="text-lg font-semibold text-slate-900 mb-1">{title}</h3>
          <p className="text-slate-600 font-medium mb-4">{company}</p>
          
          <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-4">
            {location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-slate-400" />
                <span>{location}</span>
              </div>
            )}
            {employmentType && (
              <div className="flex items-center gap-1.5">
                <Briefcase className="h-4 w-4 text-slate-400" />
                <span className="capitalize">{employmentType}</span>
              </div>
            )}
            {(salaryMin || salaryMax) && (
              <div className="flex items-center gap-1.5">
                <DollarSign className="h-4 w-4 text-slate-400" />
                <span>${salaryMin?.toLocaleString()} - ${salaryMax?.toLocaleString()}</span>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Required Skills</p>
              {matchedSkills.length > 0 && (
                <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {matchedSkills.length} of {skillsList.length || matchedSkills.length} skills matched
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {skillsList.slice(0, 6).map((skill, idx) => {
                const sName = typeof skill === 'string' ? skill : (skill.name || skill.skill_name || '');
                const sProf = typeof skill === 'string' ? 'intermediate' : (skill.proficiency || skill.min_proficiency || 'intermediate');
                const isMatched = matchedSkills.some(m => m.toLowerCase() === sName.toLowerCase());

                return (
                  <div key={idx} className="relative">
                    <SkillBadge 
                      skill={sName} 
                      proficiency={sProf}
                      verified={isMatched}
                    />
                  </div>
                );
              })}
              {skillsList.length > 6 && (
                <span className="text-xs text-slate-500 self-center">+{skillsList.length - 6} more</span>
              )}
            </div>
          </div>
        </div>
        
        {finalScore !== undefined && (
          <div className="flex flex-col items-center gap-3 shrink-0">
            <MatchScoreCard score={Math.round(finalScore)} size="md" />
            {onApply && (
              <button 
                onClick={() => onApply(jobId)}
                className="w-full bg-accent text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-600 transition-colors"
              >
                Apply Now
              </button>
            )}
          </div>
        )}
      </div>

      {!finalScore && onApply && (
        <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
          <button 
            onClick={() => onApply(jobId)}
            className="bg-accent text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-teal-600 transition-colors"
          >
            Apply Now
          </button>
        </div>
      )}
    </div>
  );
};

export default JobCard;
