import React from 'react';

const StepCard = ({ number, title, description, icon: Icon }) => {
  return (
    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
      <div className="absolute -top-4 -right-4 text-[120px] font-black text-slate-200/50 group-hover:text-accent/10 transition-colors pointer-events-none select-none z-0">
        {number}
      </div>
      
      <div className="relative z-10">
        <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 border border-slate-100 group-hover:border-accent/20 transition-colors">
          <Icon className="h-7 w-7 text-accent" />
        </div>
        
        <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-600 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

export default StepCard;
