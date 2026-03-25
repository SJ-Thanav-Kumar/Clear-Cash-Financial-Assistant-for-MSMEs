import React from 'react';

const DataIngestion = () => {
  return (
    <div className="max-w-7xl mx-auto min-h-screen pb-12">
      <header className="mb-10">
        <h1 className="text-4xl font-headline font-extrabold text-on-surface tracking-tight mb-2">Data Ingestion Hub</h1>
        <p className="text-sm text-on-surface-variant max-w-2xl leading-relaxed">Centralized ledger intelligence. Upload financial documents, track normalization progress, and manually reconcile high-priority transactions.</p>
      </header>

      {/* Bento Layout: Top Row */}
      <div className="grid grid-cols-12 gap-8 mb-8">
        {/* Upload Area (8 Columns) */}
        <section className="col-span-12 lg:col-span-8 bg-white rounded-2xl p-8 relative overflow-hidden group border border-slate-200/60 shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl py-14 px-6 hover:border-primary/40 transition-colors cursor-pointer bg-slate-50/50">
            <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center mb-5 ring-8 ring-blue-50/50">
              <span className="material-symbols-outlined text-primary text-3xl">cloud_upload</span>
            </div>
            <h3 className="text-xl font-headline font-bold mb-2 text-slate-900">Upload Financial Assets</h3>
            <p className="text-sm text-slate-500 mb-8 text-center max-w-md">Drag &amp; drop Bank PDFs, Invoices, or Receipts. Our OCR will automatically extract metadata.</p>
            
            <div className="flex gap-4">
              <button className="primary-gradient text-white px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow">
                <span className="material-symbols-outlined text-sm">file_open</span>
                Browse Files
              </button>
              <button className="bg-transparent border border-slate-300 text-slate-700 font-bold px-6 py-2.5 rounded-lg text-sm hover:bg-slate-50 transition-colors">
                Connected Apps
              </button>
            </div>
          </div>
        </section>

        {/* Processing Status (4 Columns) */}
        <section className="col-span-12 lg:col-span-4 bg-slate-50 rounded-2xl p-8 border border-slate-200/60">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Pipeline Status</h3>
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></span>
          </div>

          <div className="space-y-6">
            {/* Status Item 1 */}
            <div className="flex items-start gap-4">
              <div className="mt-1.5 h-2 w-2 rounded-full bg-primary ring-4 ring-primary/10"></div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm font-bold text-slate-800">Normalizing Records</span>
                  <span className="text-[11px] font-bold text-primary">88%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[88%]"></div>
                </div>
                <p className="text-[11px] text-slate-500 mt-2 italic font-medium">Standardizing date formats across 12 banks...</p>
              </div>
            </div>

            {/* Status Item 2 */}
            <div className="flex items-start gap-4 opacity-50">
              <div className="mt-1.5 h-2 w-2 rounded-full bg-slate-400"></div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm font-bold text-slate-800">Deduplicating</span>
                  <span className="text-[11px] font-bold text-slate-500">Pending</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full"></div>
              </div>
            </div>

            {/* Status Item 3 */}
            <div className="flex items-start gap-4">
              <div className="mt-1.5 h-2 w-2 rounded-full bg-error ring-4 ring-error/10"></div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm font-bold text-slate-800">OCR Invoices</span>
                  <span className="text-[11px] font-bold text-error">Check</span>
                </div>
                <p className="text-[11px] text-error font-semibold mt-1 bg-red-50 p-2 rounded-md border border-red-100">2 manual reviews required for "Acme Corp" invoices.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">Queue Statistics</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-headline font-extrabold text-primary mb-1">1.2k</p>
                <p className="text-[10px] uppercase font-bold text-slate-400">Processed</p>
              </div>
              <div>
                <p className="text-2xl font-headline font-extrabold text-primary mb-1">0.4s</p>
                <p className="text-[10px] uppercase font-bold text-slate-400">Avg Latency</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Middle Row: Preview & Entry side-by-side */}
      <div className="grid grid-cols-12 gap-8">
        {/* Data Preview Table (8 Columns) */}
        <section className="col-span-12 lg:col-span-8 bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200/60 flex flex-col">
          <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="font-headline font-bold text-base flex items-center gap-2 text-slate-900">
              <span className="material-symbols-outlined text-[20px] text-slate-400">database</span>
              Extraction Preview
            </h3>
            <div className="flex gap-2">
              <span className="bg-primary text-white text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-widest shadow-sm">Draft</span>
              <span className="bg-slate-200 text-slate-600 text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-widest shadow-sm">42 Records</span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="cc-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Date</th>
                  <th>Counterparty</th>
                  <th className="text-right">Amount</th>
                  <th>Logic</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-xs font-mono font-bold text-primary">TX-9021-X</td>
                  <td className="text-xs text-slate-600 font-medium">Oct 24, 2023</td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="h-7 w-7 rounded-lg bg-orange-50 text-orange-600 border border-orange-100 flex items-center justify-center text-[10px] font-bold">GS</div>
                      <span className="text-sm font-semibold text-slate-800">Goldman Sachs</span>
                    </div>
                  </td>
                  <td className="text-sm font-bold text-right text-primary">-$14,500.00</td>
                  <td>
                    <span className="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2.5 py-1 rounded-md border border-emerald-100 flex items-center gap-1.5 w-fit">
                      <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      Merged with Bank Statement
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="text-xs font-mono font-bold text-primary">TX-4481-C</td>
                  <td className="text-xs text-slate-600 font-medium">Oct 23, 2023</td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="h-7 w-7 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center text-[10px] font-bold">AZ</div>
                      <span className="text-sm font-semibold text-slate-800">Amazon Web Services</span>
                    </div>
                  </td>
                  <td className="text-sm font-bold text-right text-primary">-$2,140.22</td>
                  <td>
                    <span className="bg-blue-50 text-blue-700 text-[11px] font-bold px-2.5 py-1 rounded-md border border-blue-100 flex items-center gap-1.5 w-fit">
                      <span className="material-symbols-outlined text-[14px]">sync_alt</span>
                      Normalizing
                    </span>
                  </td>
                </tr>
                <tr className="bg-red-50/50">
                  <td className="text-xs font-mono font-bold text-primary">TX-2210-M</td>
                  <td className="text-xs text-slate-600 font-medium">Oct 22, 2023</td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="h-7 w-7 rounded-lg bg-red-100 text-red-600 border border-red-200 flex items-center justify-center text-[11px] font-bold">?</div>
                      <span className="text-sm font-bold text-red-600">Unidentified Vendor</span>
                    </div>
                  </td>
                  <td className="text-sm font-bold text-right text-red-600">+$50,000.00</td>
                  <td>
                    <span className="bg-red-100 text-red-700 text-[11px] font-bold px-2.5 py-1 rounded-md border border-red-200 flex items-center gap-1.5 w-fit">
                      <span className="material-symbols-outlined text-[14px]">warning</span>
                      Manual Review Required
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="text-xs font-mono font-bold text-primary">TX-1182-B</td>
                  <td className="text-xs text-slate-600 font-medium">Oct 22, 2023</td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="h-7 w-7 rounded-lg bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center text-[10px] font-bold">ST</div>
                      <span className="text-sm font-semibold text-slate-800">Stripe Inc.</span>
                    </div>
                  </td>
                  <td className="text-sm font-bold text-right text-primary">+$12,050.00</td>
                  <td>
                    <span className="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2.5 py-1 rounded-md border border-emerald-100 flex items-center gap-1.5 w-fit">
                      <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      Deduplicated
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-slate-100 flex justify-center mt-auto bg-slate-50/50">
            <button className="text-[11px] font-bold text-primary flex items-center gap-1 uppercase tracking-widest hover:text-slate-900 transition-colors">
              View 38 More Transactions
              <span className="material-symbols-outlined text-sm">expand_more</span>
            </button>
          </div>
        </section>

        {/* Manual Entry Form (4 Columns) */}
        <aside className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl p-8 border border-slate-200/60 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-headline font-bold text-base text-slate-900">Manual Ledger Entry</h3>
              <span className="bg-blue-50 text-blue-600 border border-blue-100 text-[9px] px-2 py-1 rounded font-bold uppercase tracking-widest">Priority Reconcile</span>
            </div>

            <form className="space-y-5">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-700">Counterparty</label>
                  <span className="text-[9px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-md uppercase border border-red-100">Mandatory</span>
                </div>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border-0 border-b-2 border-slate-200 focus:border-primary focus:ring-0 text-sm py-2 px-3 transition-colors rounded-t-md font-medium placeholder:text-slate-400" 
                  placeholder="e.g. Acme Corp" 
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-slate-700">Date</label>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Optional</span>
                  </div>
                  <input 
                    type="date" 
                    className="w-full bg-slate-50 border-0 border-b-2 border-slate-200 focus:border-primary focus:ring-0 text-sm py-2 px-3 transition-colors rounded-t-md font-medium text-slate-600" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-sm text-slate-500 font-medium">$</span>
                    <input 
                      type="number" 
                      className="w-full pl-7 bg-slate-50 border-0 border-b-2 border-slate-200 focus:border-primary focus:ring-0 text-sm py-2 pr-3 transition-colors rounded-t-md font-bold text-slate-900" 
                      placeholder="0.00" 
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Transaction Type</label>
                <select className="w-full bg-slate-50 border-0 border-b-2 border-slate-200 focus:border-primary focus:ring-0 text-sm py-2 px-3 transition-colors rounded-t-md font-medium text-slate-700 cursor-pointer">
                  <option>Inbound ACH</option>
                  <option>Wire Transfer (Out)</option>
                  <option>Internal Sweep</option>
                  <option>Payroll Expense</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Notes / Description</label>
                <textarea 
                  className="w-full bg-slate-50 border-0 border-b-2 border-slate-200 focus:border-primary focus:ring-0 text-sm py-3 px-3 transition-colors rounded-t-md font-medium resize-none placeholder:text-slate-400" 
                  placeholder="Describe the transaction intent..." 
                  rows="3"
                ></textarea>
              </div>

              <button 
                type="button" 
                className="w-full py-3.5 mt-2 primary-gradient text-white font-manrope font-bold text-sm rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                Commit to Ledger
              </button>
            </form>
          </div>

          {/* Insights/Help Card */}
          <div className="bg-primary text-white p-6 rounded-2xl relative overflow-hidden shadow-xl shadow-primary/10">
            <div className="absolute right-0 bottom-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
            <div className="flex items-center gap-3 mb-3 relative z-10">
              <span className="material-symbols-outlined text-emerald-400">psychology</span>
              <h4 className="font-headline font-bold text-base">Smart Matching Tip</h4>
            </div>
            <p className="text-[13px] text-slate-300 leading-relaxed font-medium relative z-10 opacity-90">
              Our AI has detected <span className="text-white font-bold">3 pending entries</span> that look like duplicates from the SVB statement. Commit manually only if you are adding a new, unverified line item.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DataIngestion;
