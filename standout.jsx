      {/* STANDOUT FEATURES SECTION */}
      <section id="standout" className="py-24 px-4 bg-slate-900 text-white overflow-hidden relative">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="mb-16 md:w-2/3">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-6 leading-tight">
              The SkillVerify Difference
            </h2>
            <p className="text-slate-400 text-lg font-medium">
              Existing platforms cover only a slice of the pipeline, focusing entirely on degrees or relying on self-declared data. Here is how we bridge the gap.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            
            {/* Left: Interactive Tabs */}
            <div className="lg:w-1/3 flex flex-col gap-2 relative">
              <div className="absolute left-[15px] top-4 bottom-4 w-px bg-slate-800"></div>
              {STANDOUT_FEATURES.map((feature, idx) => {
                const isActive = activeFeature === idx;
                return (
                  <button 
                    key={feature.id}
                    onClick={() => setActiveFeature(idx)}
                    className={`relative text-left flex items-center gap-4 py-4 pr-4 transition-all duration-300 group ${isActive ? 'opacity-100' : 'opacity-50 hover:opacity-80'}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 relative z-10 transition-colors duration-300 ${isActive ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'}`}>
                      <feature.icon className="w-4 h-4" />
                    </div>
                    <span className={`font-bold transition-all duration-300 ${isActive ? 'text-white text-lg' : 'text-slate-400 text-base'}`}>
                      {feature.short}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right: Feature Details */}
            <div className="lg:w-2/3">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden min-h-[320px] flex flex-col justify-center transition-all duration-500">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                
                {STANDOUT_FEATURES.map((feature, idx) => {
                  if (activeFeature !== idx) return null;
                  return (
                    <div key={feature.id} className="animate-in fade-in slide-in-from-right-8 duration-500">
                      <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 mb-8">
                        <feature.icon className="w-8 h-8 text-blue-400" />
                      </div>
                      <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">{feature.title}</h3>
                      <p className="text-slate-300 text-lg leading-relaxed font-medium">
                        {feature.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </section>
