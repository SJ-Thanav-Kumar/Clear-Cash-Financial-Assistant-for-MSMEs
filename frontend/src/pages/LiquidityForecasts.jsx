import React from 'react';

const LiquidityForecasts = () => {
  return (
    <div className="max-w-7xl mx-auto min-h-screen pb-12">
      <div className="space-y-12">
        {/* Page Header & KPIs */}
        <section className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div className="space-y-3">
            <h1 className="text-4xl font-headline font-extrabold tracking-tight text-slate-900">Liquidity Modeling</h1>
            <p className="text-slate-500 font-body text-base max-w-xl leading-relaxed">Advanced scenario analysis for payment strategies and cross-bucket cash concentration modeling.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="bg-white border border-slate-200/60 p-6 rounded-2xl min-w-[220px] shadow-sm">
              <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-widest">Working Capital Health</span>
              <div className="flex items-center gap-4 mt-3">
                <span className="text-3xl font-bold font-headline text-slate-900">84.2%</span>
                <div className="h-2 w-20 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full w-[84%] bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                </div>
              </div>
              <p className="text-[11px] text-emerald-600 font-bold mt-3 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
                +2.4% vs prev. month
              </p>
            </div>
            <div className="bg-white border border-slate-200/60 p-6 rounded-2xl min-w-[220px] shadow-sm">
              <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-widest">Net Position (Mar)</span>
              <div className="flex items-center gap-3 mt-3">
                <span className="text-3xl font-bold font-headline text-slate-900">$4.2M</span>
                <span className="material-symbols-outlined text-emerald-500 text-2xl">insights</span>
              </div>
              <p className="text-[11px] text-slate-500 font-bold mt-3 uppercase tracking-wider">Projected Surplus</p>
            </div>
          </div>
        </section>

        {/* Interactive Cash Curve - Focal Point */}
        <section className="bg-white rounded-[2rem] border border-slate-200/80 shadow-lg shadow-slate-200/30 overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-slate-50/50">
            <div>
              <h2 className="text-2xl font-headline font-extrabold text-slate-900">Cash Curve Forecast</h2>
              <p className="text-sm text-slate-500 mt-1.5 font-medium">Simulated liquidity runway under multi-scenario payment schedules</p>
            </div>
            <div className="inline-flex bg-slate-100 p-1.5 rounded-xl border border-slate-200/80 shadow-inner">
              <button className="px-6 py-2.5 text-xs font-extrabold bg-white text-slate-900 rounded-lg shadow-sm">Baseline</button>
              <button className="px-6 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors">Scenario A (+15d)</button>
              <button className="px-6 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors">Risk Scenario</button>
            </div>
          </div>
          
          <div className="p-10">
            <div className="grid grid-cols-12 gap-12">
              <div className="col-span-12 lg:col-span-8 space-y-8">
                {/* Chart with Clean Axes */}
                <div className="h-[360px] w-full relative group">
                  {/* Grid Lines & Y-Axis Labels */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 text-[11px] font-bold text-slate-400">
                    <div className="flex items-center gap-4 w-full"><span className="w-12">$8.0M</span><div className="flex-1 border-t border-slate-100"></div></div>
                    <div className="flex items-center gap-4 w-full"><span className="w-12">$6.0M</span><div className="flex-1 border-t border-slate-100"></div></div>
                    <div className="flex items-center gap-4 w-full"><span className="w-12">$4.0M</span><div className="flex-1 border-t border-slate-100"></div></div>
                    <div className="flex items-center gap-4 w-full"><span className="w-12">$2.0M</span><div className="flex-1 border-t border-slate-100"></div></div>
                    <div className="flex items-center gap-4 w-full"><span className="w-12">$0</span><div className="flex-1 border-t border-slate-300"></div></div>
                  </div>
                  
                  {/* SVGs for the lines */}
                  <svg className="absolute inset-0 ml-[4.5rem] mb-8 w-[calc(100%-4.5rem)] h-[calc(100%-2rem)] overflow-visible">
                    <path d="M0 240 Q 150 180, 300 210 T 600 80 T 900 120" fill="none" stroke="#041627" strokeLinecap="round" strokeWidth="3.5"></path>
                    <path d="M0 240 Q 150 210, 300 240 T 600 150 T 900 180" fill="none" opacity="0.4" stroke="#94a3b8" strokeDasharray="6 6" strokeLinecap="round" strokeWidth="2.5"></path>
                    
                    {/* Key Interactive Points */}
                    <circle cx="300" cy="210" fill="#041627" r="6" stroke="white" strokeWidth="2.5" className="cursor-pointer hover:r-8 transition-all"></circle>
                    <circle cx="600" cy="80" fill="#041627" r="6" stroke="white" strokeWidth="2.5" className="cursor-pointer hover:r-8 transition-all"></circle>
                  </svg>
                  
                  {/* X-Axis Labels */}
                  <div className="absolute bottom-0 ml-[4.5rem] w-[calc(100%-4.5rem)] flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest pt-2">
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                    <span>Apr</span>
                    <span>May</span>
                    <span>Jun</span>
                  </div>
                </div>
                
                {/* Legend */}
                <div className="flex items-center gap-8 pl-[4.5rem]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3.5 h-3.5 rounded-full bg-primary"></div>
                    <span className="text-xs font-bold text-slate-700">Actuals &amp; Baseline</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-4 h-[3px] bg-slate-400"></div>
                    <span className="text-xs font-bold text-slate-500">Industry Benchmark</span>
                  </div>
                </div>
              </div>
              
              <div className="col-span-12 lg:col-span-4 flex flex-col justify-center">
                <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200/80 space-y-6 flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-2">
                    <span className="material-symbols-outlined text-emerald-600">lightbulb</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2 block">Modeling Insight</span>
                    <p className="text-[13px] text-slate-600 leading-relaxed font-medium">
                      Implementing a <span className="font-extrabold text-slate-900">15-day delay</span> on accounts payable in Q2 is projected to yield <span className="font-extrabold text-emerald-600 text-base block my-2">$1.24M</span> in additional liquidity without impacting vendor reliability scores.
                    </p>
                  </div>
                  <div className="h-px bg-slate-200 w-full my-2"></div>
                  <button className="w-full py-4 primary-gradient text-white rounded-xl text-xs font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 uppercase tracking-wide">
                    <span className="material-symbols-outlined text-[18px]">download</span>
                    Export Strategic Analysis
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Aging Buckets - Clean Professional Layout */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Receivables */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 px-2">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>south_west</span>
              </div>
              <div>
                <h3 className="text-xl font-headline font-bold text-slate-900">Accounts Receivable</h3>
                <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-widest">Inbound Cash Flow</p>
              </div>
            </div>
            
            <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
              <table className="cc-table bg-white">
                <thead className="bg-slate-50/80">
                  <tr>
                    <th>Bucket</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="font-bold text-slate-800 text-sm">0-30 Days</td>
                    <td className="font-bold text-sm">$2,840,000</td>
                    <td><span className="cc-badge positive">Healthy</span></td>
                    <td className="text-slate-500 text-[11px] font-bold">64 Invoices</td>
                  </tr>
                  <tr>
                    <td className="font-bold text-slate-800 text-sm">31-60 Days</td>
                    <td className="font-bold text-sm">$840,000</td>
                    <td><span className="cc-badge neutral">Monitor</span></td>
                    <td className="text-slate-500 text-[11px] font-bold">12 Invoices</td>
                  </tr>
                  <tr>
                    <td className="font-bold text-slate-800 text-sm">61-90 Days</td>
                    <td className="font-bold text-sm">$312,000</td>
                    <td><span className="bg-amber-100 text-amber-800 cc-badge">Follow-up</span></td>
                    <td className="text-emerald-600 text-[11px] font-extrabold uppercase tracking-wide">Critical</td>
                  </tr>
                  <tr className="bg-red-50/40">
                    <td className="font-bold text-red-700 text-sm">90+ Days</td>
                    <td className="font-bold text-red-700 text-sm">$128,000</td>
                    <td><span className="cc-badge negative">Risk</span></td>
                    <td className="text-red-600 text-[11px] font-extrabold uppercase tracking-wide">Collections</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Payables */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 px-2">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>north_east</span>
              </div>
              <div>
                <h3 className="text-xl font-headline font-bold text-slate-900">Accounts Payable</h3>
                <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-widest">Outbound Cash Flow</p>
              </div>
            </div>
            
            <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
              <table className="cc-table bg-white">
                <thead className="bg-slate-50/80">
                  <tr>
                    <th>Bucket</th>
                    <th>Amount</th>
                    <th>Priority</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="font-bold text-slate-800 text-sm">0-30 Days</td>
                    <td className="font-bold text-sm">$1,420,000</td>
                    <td><span className="cc-badge positive">Standard</span></td>
                    <td className="text-slate-500 text-[11px] font-bold italic">Trade payables</td>
                  </tr>
                  <tr>
                    <td className="font-bold text-slate-800 text-sm">31-60 Days</td>
                    <td className="font-bold text-sm">$210,000</td>
                    <td><span className="bg-indigo-100 text-indigo-800 cc-badge">Deferred</span></td>
                    <td className="text-slate-500 text-[11px] font-bold italic">Verification pending</td>
                  </tr>
                  <tr>
                    <td className="font-bold text-slate-800 text-sm">61-90 Days</td>
                    <td className="font-bold text-sm">$45,000</td>
                    <td><span className="cc-badge negative">Hold</span></td>
                    <td className="text-slate-500 text-[11px] font-bold italic">Disputed invoice</td>
                  </tr>
                  <tr className="bg-slate-50/80">
                    <td className="font-bold text-slate-600 text-sm">90+ Days</td>
                    <td className="font-bold text-slate-600 text-sm">$12,000</td>
                    <td><span className="cc-badge negative opacity-70">Hold</span></td>
                    <td className="text-slate-400 text-[11px] font-bold italic">Legacy items</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Net Position - Grid Presentation */}
        <section className="space-y-8 pb-8">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-2xl font-headline font-bold text-slate-900">Monthly Net Position Outlook</h3>
            <button className="text-[11px] font-bold text-slate-500 hover:text-primary uppercase tracking-widest flex items-center gap-1.5 transition-colors">
              View Detailed Ledger 
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {[
              { m: 'March', v: '$4.2M', t: '+12%', type: 'pos' },
              { m: 'April', v: '$3.9M', t: '-8%', type: 'neg' },
              { m: 'May', v: '$5.1M', t: '+31%', type: 'pos' },
              { m: 'June', v: '$4.8M', t: '-5%', type: 'neg' },
              { m: 'July', v: '$5.3M', t: '+10%', type: 'pos' },
              { m: 'August', v: '$6.1M', t: '+15%', type: 'pos' },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-slate-200/80 p-8 rounded-2xl text-center shadow-sm hover:shadow-md transition-shadow hover:border-slate-300">
                <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 mb-4">{item.m}</p>
                <div className="text-2xl font-extrabold font-headline text-slate-900">{item.v}</div>
                <div className={`mt-4 inline-block px-3 py-1.5 text-[11px] border font-bold rounded-lg ${
                  item.type === 'pos' 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                    : 'bg-red-50 text-red-700 border-red-100'
                }`}>
                  {item.t}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default LiquidityForecasts;
