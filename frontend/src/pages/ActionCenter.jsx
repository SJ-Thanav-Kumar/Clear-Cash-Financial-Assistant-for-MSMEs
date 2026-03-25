import React from 'react';

const ActionCenter = () => {
  return (
    <div className="max-w-7xl mx-auto min-h-screen pb-12">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold font-headline tracking-tight text-slate-900 mb-3">Action Center</h1>
        <p className="text-slate-500 max-w-2xl text-base leading-relaxed">Prioritize and negotiate enterprise obligations using AI-driven scoring and strategic recommendations.</p>
      </header>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-8">
        
        {/* Obligation Priority Table (Column 1-8) */}
        <section className="col-span-12 xl:col-span-8 space-y-8">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-200">
            <div className="bg-slate-50 border-b border-slate-100 px-8 py-5 flex justify-between items-center">
              <h3 className="font-headline font-extrabold text-slate-900 text-lg">Obligation Priority Table</h3>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase tracking-widest rounded-md pulse-glow flex items-center gap-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Live AI Analysis
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="cc-table">
                <thead>
                  <tr>
                    <th className="font-extrabold">Priority</th>
                    <th className="font-extrabold">Counterparty</th>
                    <th className="font-extrabold">Amount</th>
                    <th className="font-extrabold">Recommended Action</th>
                    <th className="font-extrabold text-right">Reasoning</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Row 1 */}
                  <tr className="group">
                    <td>
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-red-100 text-red-600 font-extrabold text-xs flex justify-center items-center shadow-sm">01</span>
                        <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-error w-[95%]"></div>
                        </div>
                      </div>
                    </td>
                    <td className="font-bold text-slate-900 text-sm">Global Cloud Infrastructure</td>
                    <td className="font-mono text-sm font-bold text-slate-600">$245,000.00</td>
                    <td>
                      <span className="px-2.5 py-1 bg-primary text-white text-[10px] font-bold rounded-md uppercase tracking-wider shadow-sm">PAY IMMEDIATELY</span>
                    </td>
                    <td className="text-right">
                      <button className="text-primary hover:text-slate-900 text-[11px] font-extrabold uppercase tracking-wide flex items-center gap-0.5 ml-auto transition-colors">
                        Expand <span className="material-symbols-outlined text-[16px]">expand_less</span>
                      </button>
                    </td>
                  </tr>
                  {/* AI Expansion Row (CoT) */}
                  <tr className="bg-blue-50/50">
                    <td className="px-8 py-6 border-b border-slate-200" colSpan="5">
                      <div className="flex gap-4 border-l-2 border-primary pl-6">
                        <span className="material-symbols-outlined text-primary text-2xl mt-0.5">psychology</span>
                        <div className="space-y-2.5">
                          <p className="text-[10px] font-extrabold uppercase tracking-widest text-primary">Chain-of-Thought (CoT) Analysis</p>
                          <p className="text-sm text-slate-600 leading-relaxed font-medium">
                            "We recommend <span className="text-slate-900 font-bold">immediate payment</span> due to a high 'Penalty Score' (2.5% daily accrual starting tomorrow). Relationship score with GCI is currently 4.2/10; missing this window will trigger a service suspension clause affecting 4 internal product units. Flexibility is <span className="text-error font-bold">Zero</span>."
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                  {/* Row 2 */}
                  <tr className="group">
                    <td>
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 font-extrabold text-xs flex justify-center items-center shadow-sm">02</span>
                        <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 w-[62%]"></div>
                        </div>
                      </div>
                    </td>
                    <td className="font-bold text-slate-900 text-sm">Starlight Marketing Group</td>
                    <td className="font-mono text-sm font-bold text-slate-600">$42,500.00</td>
                    <td>
                      <span className="px-2.5 py-1 bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-bold rounded-md uppercase tracking-wider shadow-sm">NEGOTIATE</span>
                    </td>
                    <td className="text-right">
                      <button className="text-primary hover:text-slate-900 text-[11px] font-extrabold uppercase tracking-wide flex items-center gap-0.5 ml-auto transition-colors">
                        Reasoning <span className="material-symbols-outlined text-[16px]">expand_more</span>
                      </button>
                    </td>
                  </tr>
                  {/* Row 3 */}
                  <tr className="group">
                    <td>
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 font-extrabold text-xs flex justify-center items-center shadow-sm border border-slate-200">03</span>
                        <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-slate-400 w-[30%]"></div>
                        </div>
                      </div>
                    </td>
                    <td className="font-bold text-slate-900 text-sm">Apex Janitorial Services</td>
                    <td className="font-mono text-sm font-bold text-slate-600">$12,000.00</td>
                    <td>
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold rounded-md uppercase tracking-wider shadow-sm">DEFER (14D)</span>
                    </td>
                    <td className="text-right">
                      <button className="text-primary hover:text-slate-900 text-[11px] font-extrabold uppercase tracking-wide flex items-center gap-0.5 ml-auto transition-colors">
                        Reasoning <span className="material-symbols-outlined text-[16px]">expand_more</span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Metric Breakout */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-32">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Avg. Urgency Score</span>
              <div className="text-3xl font-headline font-extrabold text-slate-900">8.4<span className="text-sm font-bold text-slate-400 ml-1">/10</span></div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-32">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Flexibility Index</span>
              <div className="text-2xl font-headline font-extrabold text-amber-500 uppercase tracking-tight">Medium</div>
            </div>
            <div className="bg-red-50 p-6 rounded-2xl border border-red-100 shadow-sm flex flex-col justify-between h-32">
              <span className="text-[10px] font-extrabold text-red-500 uppercase tracking-widest">Penalty Exposure</span>
              <div className="text-3xl font-headline font-extrabold text-error">$14k</div>
            </div>
          </div>
        </section>

        {/* Action Panel (Column 9-12) */}
        <aside className="col-span-12 xl:col-span-4 flex flex-col h-full">
          <div className="primary-gradient text-white p-8 rounded-3xl shadow-xl shadow-primary/20 relative overflow-hidden flex-1 flex flex-col">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            
            <div className="relative z-10 flex-1 flex flex-col">
              <div className="mb-8">
                <span className="text-[10px] font-bold tracking-[0.2em] text-blue-300 uppercase">Action Panel</span>
                <h2 className="text-2xl font-headline font-extrabold mt-1">Negotiation Engine</h2>
                <p className="text-blue-100 text-sm mt-1.5 font-medium">Counterparty: Starlight Marketing</p>
              </div>

              {/* Counterparty Health */}
              <div className="p-5 bg-white/10 rounded-xl border border-white/20 backdrop-blur-md mb-8">
                <div className="flex justify-between items-end mb-4">
                  <span className="text-xs font-semibold text-blue-100">Relationship Score</span>
                  <span className="text-2xl font-headline font-extrabold text-emerald-400">7.8</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 w-[78%]"></div>
                </div>
              </div>

              {/* AI Draft Section */}
              <div className="space-y-3 flex-1">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-blue-300 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">auto_fix_high</span>
                  AI-Generated Negotiation Draft
                </label>
                <div className="p-6 bg-white/95 text-slate-800 rounded-xl text-sm leading-prose shadow-inner font-medium border border-slate-200">
                  <p className="mb-4 text-slate-900 font-bold">Dear Finance Team at Starlight,</p>
                  <p className="mb-4">We value our ongoing partnership and the exceptional marketing results achieved this quarter. We are currently optimizing our treasury flows and would like to propose a <span className="font-bold text-primary bg-blue-50 px-1 rounded">15-day extension</span> on Invoice #SMG-992 in exchange for a 2% volume increase in next quarter's commitment.</p>
                  <p className="mb-4">Please let us know if this structural adjustment aligns with your current receivables strategy.</p>
                  <p className="text-slate-600 font-semibold">Regards,<br/>Treasury Operations</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                <button className="flex items-center justify-center gap-2 py-3.5 bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20 pulse-glow">
                  <span className="material-symbols-outlined text-[18px]">send</span>
                  Send Email
                </button>
                <button className="flex items-center justify-center gap-2 py-3.5 bg-transparent border-2 border-slate-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-slate-800 transition-colors">
                  <span className="material-symbols-outlined text-[18px]">schedule</span>
                  Schedule
                </button>
              </div>
              
              <button className="w-full py-4 mt-2 text-blue-300 hover:text-white text-[11px] uppercase tracking-widest font-bold flex items-center justify-center gap-1.5 transition-colors">
                <span className="material-symbols-outlined text-[16px]">edit_note</span>
                Modify Negotiation Strategy
              </button>
            </div>
          </div>
        </aside>

      </div>

      {/* Secondary Insights / Asymmetric Layout Element */}
      <div className="mt-12 grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-5 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <h4 className="font-headline font-extrabold text-xl text-slate-900 mb-6">Market Flexibility Benchmark</h4>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full border-4 border-emerald-500 flex items-center justify-center shrink-0 bg-emerald-50">
              <span className="font-headline font-extrabold text-3xl text-emerald-600">A+</span>
            </div>
            <div className="space-y-2 text-left">
              <p className="text-[13px] font-extrabold uppercase tracking-widest text-slate-400">Top-Tier Status</p>
              <p className="text-sm text-slate-600 font-medium leading-relaxed">Your payment reliability permits <span className="font-bold text-slate-900">12% higher-than-average flexibility</span> in vendor negotiations compared to peers.</p>
            </div>
          </div>
        </div>
        
        <div className="col-span-12 lg:col-span-7 rounded-3xl overflow-hidden relative min-h-[220px] flex items-center group shadow-sm border border-slate-200">
          <img 
            alt="Financial Data" 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCm1lXsAJ5Mw5yTM88f0n8UQy1wAbs1uoFhIo6qQQNV0Jl5Krh9Jk1mv667xZcHLzcNU9EQijCMiMr1XCO8tJ_ihwv_SvWzMplASMF6JR4IrXXjxyxAbCQNwUJumX6diL51ydr0ITS7E9YFID4KJsYXmY3XJBc0RpSIwDSoVK6pE7PnZXOpquSQBRRXHFQgZfy7LxK_gADq1nFMzjJ6YGZT_fjvhGOzOQWFO9_n70nHcRkk3fZ4X9QTl8D9DGYx7ba7GXBABLrOaE"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-transparent opacity-90"></div>
          <div className="relative z-10 p-10 lg:p-12 max-w-lg">
            <h3 className="text-white font-headline font-extrabold text-2xl mb-3">Automated Optimization</h3>
            <p className="text-blue-100 text-sm font-medium leading-relaxed">Enable 'Autonomous mode' to allow LiquidityOS to execute negotiations below $5,000 automatically based on your preset risk profile.</p>
            <button className="mt-8 px-8 py-3 bg-white text-primary font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-slate-100 transition-colors shadow-lg">Configure Automations</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionCenter;
