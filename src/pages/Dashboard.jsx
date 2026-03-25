import React from 'react';

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto min-h-screen pb-12">
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="font-headline text-4xl font-extrabold tracking-tighter text-on-surface">Executive Treasury Overview</h1>
          <p className="font-body text-sm text-on-surface-variant mt-2">Real-time liquidity analysis for Fiscal Q4</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-error/10 px-4 py-2 rounded-xl flex items-center gap-3 border border-error/20 shadow-sm">
            <span className="material-symbols-outlined text-error text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-error/80 tracking-widest">Critical Alert</span>
              <span className="text-error font-headline text-lg font-extrabold leading-none mt-0.5">7 Days Cash on Hand</span>
            </div>
          </div>
        </div>
      </header>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-8">
        
        {/* Primary Visualization: Waterfall Chart */}
        <section className="col-span-12 lg:col-span-8 bg-white rounded-2xl p-8 shadow-sm border border-slate-200/60">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="font-headline text-xl font-bold text-slate-900">Cash Flow Waterfall</h2>
              <span className="text-sm text-slate-500 mt-1 block">Projected liquidity movements over next 30 days</span>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-primary"></span> Opening</div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-tertiary-fixed"></span> Inflow</div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-error"></span> Outflow</div>
            </div>
          </div>
          
          <div className="h-72 flex items-end justify-between px-4 mt-6">
            <div className="flex flex-col items-center gap-2 w-16 group">
              <span className="text-xs font-bold text-slate-600">$2.4M</span>
              <div className="w-full bg-primary rounded-t-xl group-hover:opacity-90 transition-opacity" style={{ height: '180px' }}></div>
              <span className="text-[11px] font-semibold text-slate-500">Opening</span>
            </div>
            <div className="flex flex-col items-center gap-2 w-16 relative group">
              <span className="text-xs font-bold text-emerald-600">+$840k</span>
              <div className="w-full bg-emerald-100 border-2 border-emerald-500 pulse-bar rounded-xl mb-[60px] group-hover:bg-emerald-200 transition-colors" style={{ height: '60px' }}></div>
              <span className="text-[11px] font-semibold text-slate-500 absolute bottom-[-28px]">Sales</span>
            </div>
            <div className="flex flex-col items-center gap-2 w-16 relative group">
              <span className="text-xs font-bold text-emerald-600">+$210k</span>
              <div className="w-full bg-emerald-100 border-2 border-emerald-500 pulse-bar rounded-xl mb-[140px] group-hover:bg-emerald-200 transition-colors" style={{ height: '20px' }}></div>
              <span className="text-[11px] font-semibold text-slate-500 absolute bottom-[-28px]">Tax Credit</span>
            </div>
            <div className="flex flex-col items-center gap-2 w-16 relative group">
              <span className="text-xs font-bold text-error">-$1.2M</span>
              <div className="w-full bg-red-100 border-2 border-error rounded-xl mb-[80px] group-hover:bg-red-200 transition-colors" style={{ height: '90px' }}></div>
              <span className="text-[11px] font-semibold text-slate-500 absolute bottom-[-28px]">OpEx</span>
            </div>
            <div className="flex flex-col items-center gap-2 w-16 relative group">
              <span className="text-xs font-bold text-error">-$450k</span>
              <div className="w-full bg-red-100 border-2 border-error rounded-xl mb-[40px] group-hover:bg-red-200 transition-colors" style={{ height: '40px' }}></div>
              <span className="text-[11px] font-semibold text-slate-500 absolute bottom-[-28px]">Payroll</span>
            </div>
            <div className="flex flex-col items-center gap-2 w-16 group">
              <span className="text-xs font-bold text-slate-600">$1.8M</span>
              <div className="w-full bg-slate-800 rounded-t-xl group-hover:opacity-90 transition-opacity" style={{ height: '140px' }}></div>
              <span className="text-[11px] font-semibold text-slate-500">Net 30</span>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <div className="primary-gradient rounded-2xl p-8 text-white shadow-xl flex flex-col justify-between h-full relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <h2 className="font-headline text-xl font-bold mb-2">Quick Actions</h2>
              <p className="text-sm text-slate-300 leading-relaxed font-medium mt-1">Execute treasury maneuvers to optimize your 7-day outlook.</p>
            </div>
            
            <div className="flex flex-col gap-3 mt-8 relative z-10">
              <button className="w-full bg-white/10 hover:bg-white/20 border border-white/10 py-3.5 rounded-xl flex items-center justify-between px-5 transition-all group backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-emerald-400">upload_file</span>
                  <span className="text-sm font-bold tracking-wide">Upload Invoice</span>
                </div>
                <span className="material-symbols-outlined text-sm opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all">arrow_forward</span>
              </button>
              <button className="w-full bg-white/10 hover:bg-white/20 border border-white/10 py-3.5 rounded-xl flex items-center justify-between px-5 transition-all group backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-blue-300">schedule</span>
                  <span className="text-sm font-bold tracking-wide">Defer Payment</span>
                </div>
                <span className="material-symbols-outlined text-sm opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all">arrow_forward</span>
              </button>
            </div>
          </div>
        </section>

        {/* Liquidity Summary */}
        <section className="col-span-12 lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-8 flex flex-col justify-between border border-slate-200/60 shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Net Cash Position</span>
              <div className="font-headline text-4xl font-extrabold mt-3 text-slate-900">$1.84M</div>
            </div>
            <div className="flex items-center gap-2 mt-6 relative z-10">
              <span className="material-symbols-outlined text-error text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>trending_down</span>
              <span className="text-sm font-semibold text-error/90">-4.2% from last month</span>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-8 flex flex-col justify-between border border-slate-200/60 shadow-sm relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-tertiary-fixed"></div>
            <div className="relative z-10">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Working Capital</span>
              <div className="font-headline text-4xl font-extrabold mt-3 text-slate-900">$540k</div>
            </div>
            <div className="flex items-center gap-2 mt-6 relative z-10">
              <span className="material-symbols-outlined text-emerald-600 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
              <span className="text-sm font-semibold text-emerald-700">+12.8% cycle efficiency</span>
            </div>
          </div>
        </section>

        {/* Aging Snapshot */}
        <section className="col-span-12 lg:col-span-5 bg-white rounded-2xl p-8 shadow-sm border border-slate-200/60">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-headline text-lg font-bold text-slate-900">Aging Snapshot</h3>
            <span className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-slate-600 transition-colors">more_horiz</span>
          </div>
          
          <div className="space-y-7">
            <div>
              <div className="flex justify-between text-sm mb-2.5">
                <span className="font-semibold text-slate-600">0-30 Days</span>
                <span className="font-bold text-slate-900">$420,000</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2.5">
                <span className="font-semibold text-slate-600">31-60 Days</span>
                <span className="font-bold text-slate-900">$125,500</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-blue-400 h-2 rounded-full" style={{ width: '22%' }}></div>
              </div>
            </div>
            
            <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
              <span className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">Total AR Outstanding</span>
              <span className="text-lg font-extrabold text-slate-900">$545,500</span>
            </div>
          </div>
        </section>

        {/* Insights / Trends */}
        <section className="col-span-12 bg-white border border-slate-200/60 rounded-3xl p-8 lg:p-10 flex flex-col md:flex-row gap-10 items-center shadow-sm">
          <div className="md:w-5/12">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-3.5 py-1.5 rounded-full text-[10px] font-bold text-blue-700 uppercase tracking-widest mb-5">
              <span className="material-symbols-outlined text-sm">auto_awesome</span>
              AI Insight
            </div>
            <h4 className="font-headline text-2xl font-extrabold mb-3 text-slate-900">Forecast Neutrality at Risk</h4>
            <p className="text-sm font-medium text-slate-500 leading-relaxed">
              Based on current vendor velocity, your cash-on-hand will dip below the 5-day threshold by Thursday. 
              <span className="text-slate-800 font-bold"> Consider deferring the $180k CapEx payment scheduled for tomorrow.</span>
            </p>
          </div>
          <div className="md:w-7/12 h-40 w-full flex items-center justify-center bg-slate-50 rounded-2xl overflow-hidden relative border border-slate-100">
            <div className="absolute inset-0 opacity-40">
              <img className="w-full h-full object-cover mix-blend-multiply opacity-20" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbhI1urdqUq-sbwpaRcN9lGivMIokwFSi32k_u_d5c1LF8dctxyVfvIDmwdeQgIp4xABtIQVhD0jM5V9xwbfkXMkwSWN7Y_uTq9DdFIMZQnZXcNXIFNr8BB9AbsomhAkv03X6I4fPt7UZHqe4rPwLx-KUINLcNtFxdkzCHMxUp4LLwnUuMZFCpvSFHI83_RQ_9V0emtuuUb5xNLx0SKylUc0dOgAQmwFEHwAyzMytMhNi5ZXtgrtDOLcU6QiHngIVJxGt6NYi9yBY" alt="Data texture" />
            </div>
            
            <div className="relative z-10 flex gap-2 items-end h-20 w-full px-8 opacity-90">
              {/* Sparkline mock */}
              <div className="flex-1 bg-slate-300 rounded-t-sm h-6"></div>
              <div className="flex-1 bg-slate-300 rounded-t-sm h-10"></div>
              <div className="flex-1 bg-slate-300 rounded-t-sm h-16"></div>
              <div className="flex-1 bg-slate-300 rounded-t-sm h-14"></div>
              <div className="flex-1 bg-primary rounded-t-sm h-20 shadow-lg shadow-primary/20"></div>
              <div className="flex-1 bg-primary border-t-2 border-primary rounded-t-sm h-12 opacity-80"></div>
              <div className="flex-1 bg-primary rounded-t-sm h-10 opacity-60"></div>
              <div className="flex-1 bg-error rounded-t-sm h-6 animate-pulse"></div>
            </div>
          </div>
        </section>

      </div>
      
      {/* Contextual FAB */}
      <div className="fixed bottom-8 right-8 z-50">
        <button className="primary-gradient text-white p-4 rounded-full shadow-2xl shadow-primary/30 flex items-center gap-2 hover:scale-105 transition-transform">
          <span className="material-symbols-outlined">add</span>
          <span className="font-headline text-sm font-bold pr-2 hidden sm:block">New Transaction</span>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
