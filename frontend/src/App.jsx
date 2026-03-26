import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import {
  Wallet, Clock, AlertTriangle, TrendingUp, Upload, Target,
  CheckCircle, XCircle, Loader2, ArrowUpDown, FileText, Image as ImageIcon,
  RefreshCw, ChevronUp, ChevronDown, ShieldAlert, BarChart2, List, Lock, User, LogOut, UserPlus
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

const API = 'http://127.0.0.1:8000';

// ─── Palette (Vibrant Dark) ───────────────────────────────────────────
const PIE_PALETTE = ['#818cf8', '#a78bfa', '#f472b6', '#fb7185', '#fbbf24', '#34d399', '#22d3ee', '#94a3b8'];

// ─── Utilities ─────────────────────────────────────────────────────────────
const fmt = (n) => `₹${Math.abs(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 0 })}`;
const fmtDate = (s) => {
  if (!s) return '';
  const d = new Date(s);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' });
};
function categorise(tx) {
  const d = (tx.counterparty || tx.raw_ref || '').toLowerCase();
  if (d.includes('salary') || d.includes('payroll') || d.includes('credit') || d.includes('deposit') || tx.amount > 0) return 'Income';
  if (d.includes('purchase') || d.includes('pos')) return 'Shopping';
  if (d.includes('atm') || d.includes('withdrawal')) return 'Cash';
  if (d.includes('check') || d.includes('cheque')) return 'Cheque';
  if (d.includes('fee') || d.includes('charge') || d.includes('service')) return 'Fees';
  if (d.includes('interest')) return 'Interest';
  return 'Other';
}

// ─── Components ───────────────────────────────────────────────────────────
const Spinner = ({ size = 20, className = "" }) => <Loader2 size={size} className={`animate-spin ${className}`} />;

const EmptyState = ({ icon: Icon, title, sub }) => (
  <div className="flex flex-col items-center justify-center py-20 text-slate-700 gap-3">
    <Icon size={44} className="text-slate-800" />
    <p className="font-semibold text-base text-slate-600">{title}</p>
    {sub && <p className="text-sm text-slate-700">{sub}</p>}
  </div>
);

// ─── AUTH PAGES (Login + Signup) ──────────────────────────────────────────
const AuthPage = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const endpoint = isLogin ? '/api/login' : '/api/signup';
      const res = await axios.post(`${API}${endpoint}`, { username, password });

      if (isLogin) {
        if (res.data.success) {
          localStorage.setItem('cc_token', res.data.token);
          localStorage.setItem('cc_user', username);
          onLogin();
        }
      } else {
        setSuccess('Account created! Please sign in.');
        setIsLogin(true);
      }
    } catch (err) {
      setError(err?.response?.data?.detail || (isLogin ? 'Invalid credentials.' : 'Signup failed.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[150px] rounded-full" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-emerald-600/10 blur-[150px] rounded-full" />

      <div className="w-full max-w-md bg-[#0f172a]/80 backdrop-blur-2xl border border-slate-800 p-12 rounded-[3.5rem] shadow-2xl relative z-10 border-t-white/5">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-tr from-indigo-500 via-violet-600 to-emerald-400 rounded-3xl flex items-center justify-center font-black text-white text-4xl mx-auto mb-8 shadow-[0_10px_30px_rgba(79,70,229,0.4)]">C</div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-3">
            {isLogin ? "System Entry" : "Register Node"}
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-xs">ClearCash By Silson</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest ml-1">Username</label>
            <div className="relative group">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-400" size={20} />
              <input
                type="text" value={username} onChange={e => setUsername(e.target.value)} required
                className="w-full bg-[#1e293b]/50 border border-slate-800 text-white pl-14 pr-6 py-5 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-slate-700 font-bold"
                placeholder="Username"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-emerald-400" size={20} />
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full bg-[#1e293b]/50 border border-slate-800 text-white pl-14 pr-6 py-5 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-slate-700 font-bold"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && <div className="text-rose-400 text-center py-2 rounded-2xl text-xs font-black uppercase tracking-widest leading-relaxed px-4">{error}</div>}
          {success && <div className="text-emerald-400 text-center py-2 rounded-2xl text-xs font-black uppercase tracking-widest leading-relaxed px-4">{success}</div>}

          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-black py-5 rounded-[1.8rem] shadow-lg transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70 uppercase tracking-widest text-sm">
            {loading ? <Spinner size={24} className="text-white" /> : (isLogin ? "Authenticate" : "Sign Up")}
          </button>
        </form>

        <div className="mt-12 text-center">
          <button onClick={() => setIsLogin(!isLogin)} className="text-emerald-400 hover:text-emerald-300 text-xs font-black uppercase tracking-widest transition-colors">
            {isLogin ? "Initialize Node" : "Access Console"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── DASHBOARD COMPONENTS ──────────────────────────────────────────────────

const KpiCard = ({ label, value, sub, gradient, icon: Icon, glow }) => (
  <div className={`relative overflow-hidden rounded-[2.5rem] p-8 text-white shadow-2xl transition-all hover:scale-[1.02] duration-500 bg-[#0f172a] border border-slate-800 border-t-white/5`}>
    <div className={`absolute -right-10 -top-10 w-48 h-48 rounded-full ${glow} blur-[60px] opacity-10`} />
    <div className="flex items-center gap-4 mb-8 relative z-10">
      <div className={`p-3 rounded-xl backdrop-blur-md border border-white/10 ${gradient} shadow-lg shadow-black/20 shrink-0`}>
        <Icon size={22} />
      </div>
      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 leading-tight">{label}</span>
    </div>
    <div className="text-4xl lg:text-5xl font-black tracking-tighter mb-3 relative z-10 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400 leading-tight">{value}</div>
    {sub && <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest relative z-10 flex items-center gap-2">
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse shrink-0" />
      <span>{sub}</span>
    </p>}
  </div>
);

const InsightsTab = ({ metrics, projection, transactions }) => {
  const spending = {};
  transactions.filter(t => t.amount < 0).forEach(t => {
    const cat = categorise(t);
    spending[cat] = (spending[cat] || 0) + Math.abs(t.amount);
  });
  const spendData = Object.entries(spending)
    .map(([name, value], i) => ({ name, value, fill: PIE_PALETTE[i % PIE_PALETTE.length] }))
    .sort((a, b) => b.value - a.value);

  const recentTx = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 8);

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <KpiCard icon={Wallet} label="Liquidity Reservoir" value={fmt(metrics.current_balance)}
          gradient="bg-indigo-600" glow="bg-indigo-600" />
        <KpiCard icon={Clock} label="Operational Horizon" value={`${metrics.days_to_zero}d`}
          sub="Live Projection Active"
          gradient="bg-violet-600" glow="bg-violet-600" />
        <KpiCard icon={AlertTriangle} label="System Fidelity" value={metrics.status}
          gradient="bg-emerald-600" glow="bg-emerald-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#0f172a] rounded-[3rem] shadow-2xl border border-slate-800 border-t-white/5 p-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20 shadow-inner">
                <TrendingUp className="text-indigo-400" size={24} />
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">Financial Trajectory</h3>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projection}>
                <defs>
                  <linearGradient id="neonGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="0" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="date" hide />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10, fontWeight: 900 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid #1e293b' }} />
                <Area type="monotone" dataKey="projected_balance" stroke="#818cf8" strokeWidth={4} fill="url(#neonGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#0f172a] rounded-[3rem] shadow-2xl border border-slate-800 border-t-white/5 p-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
              <BarChart2 className="text-emerald-400" size={24} />
            </div>
            <h3 className="text-xl font-black text-white tracking-tight">Expenditure Matrix</h3>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={spendData} layout="vertical" barSize={12}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} width={80} />
                <Bar dataKey="value" radius={[0, 10, 10, 0]}>
                  {spendData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-[#0f172a] rounded-[3rem] p-1 shadow-2xl border border-slate-800 border-t-white/5 overflow-hidden">
        <div className="px-10 py-6 border-b border-slate-800 bg-slate-900/40">
          <h3 className="text-xl font-black text-white tracking-tight">Universal Ledger</h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {recentTx.map((tx, i) => (
            <div key={tx.transaction_id || i} className="flex items-center gap-6 p-8 rounded-[2rem] bg-[#1e293b]/20 border border-slate-800 relative overflow-hidden group">
              <div className={`absolute left-0 top-0 w-1.5 h-full ${tx.amount > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              <div className="flex-1 min-w-0">
                <p className="font-black text-white text-lg truncate mb-1">{tx.counterparty || 'ANON_NODE'}</p>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{fmtDate(tx.date)}</p>
              </div>
              <div className="text-right">
                <p className={`text-xl font-black tracking-tighter ${tx.amount > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{tx.amount > 0 ? '+' : '−'}{fmt(tx.amount)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── TAB: Payments ────────────────────────────────────────────────────────────
const PaymentsTab = () => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/api/decision/rankings`).then(r => setRankings(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-96"><Spinner size={40} className="text-indigo-500" /></div>;

  return (
    <div className="bg-[#0f172a] rounded-[3rem] p-10 shadow-2xl border border-slate-800">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {rankings.map((item) => (
          <div key={item.id} className="bg-[#1e293b]/20 border border-slate-800 rounded-[2.5rem] p-8 flex flex-col gap-6"
            style={{ borderLeft: `8px solid ${item.score > 80 ? '#f43f5e' : item.score > 40 ? '#f59e0b' : '#10b981'}` }}>
            <div className="flex justify-between items-center">
              <h4 className="text-xl font-black text-white truncate pr-4">{item.counterparty}</h4>
              <span className="shrink-0 px-4 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.recommendation}</span>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Payload</p>
                <p className="text-3xl font-black text-white tracking-tighter">{fmt(item.amount)}</p>
              </div>
              <div className="w-1/2">
                <div className="h-2 w-full bg-slate-900 rounded-full border border-slate-800 mb-2">
                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${item.score}%`, background: item.score > 80 ? '#f43f5e' : item.score > 40 ? '#f59e0b' : '#10b981' }} />
                </div>
                {item.reasons && (
                  <div className="flex flex-wrap items-center justify-end gap-1 mt-3">
                    {item.reasons.map((r, i) => (
                      <span key={i} className="px-2 py-1 bg-slate-900/80 border border-slate-800 rounded-md text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">
                        {r}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── TAB: Ingestion ──────────────────────────────────────────────────────────
const UploadTab = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const fileRef = useRef(null);

  const handleFile = useCallback(async (file) => {
    if (!file) return;
    setResult(null); setUploading(true);
    const fd = new FormData(); fd.append('file', file);
    try {
      const endpoint = file.type === 'application/pdf' ? 'bank-statement' : 'receipt';
      const res = await axios.post(`${API}/api/upload/${endpoint}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setResult({ ok: true, message: res.data.message || 'Node Authenticated' });
      onUploadSuccess();
    } catch (err) {
      setResult({ ok: false, message: err?.response?.data?.detail || 'Handshake failed' });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }, [onUploadSuccess]);

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div onClick={() => !uploading && fileRef.current?.click()} className="cursor-pointer transition-all rounded-[4rem] p-24 text-center border-4 border-dashed border-slate-800 bg-[#0f172a] hover:border-indigo-500/50">
        <input ref={fileRef} type="file" className="hidden" accept=".pdf,image/*" onChange={e => handleFile(e.target.files[0])} disabled={uploading} />
        {uploading ? <Spinner size={40} className="mx-auto text-indigo-500" /> : <Upload size={48} className="mx-auto text-slate-700 mb-6" />}
        <p className="text-4xl font-black text-white tracking-tighter">Upload Financial Data</p>
        <p className="text-slate-600 font-bold mt-4 uppercase tracking-[0.3em] text-xs leading-relaxed">Supports PDFs and image fragments alone</p>
      </div>
      {result && (
        <div className={`p-8 rounded-[2.5rem] border-2 flex items-center gap-6 ${result.ok ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/5 border-rose-500/20 text-rose-400'}`}>
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl ${result.ok ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
            {result.ok ? <CheckCircle size={28} /> : <XCircle size={28} />}
          </div>
          <div>
            <p className="text-2xl font-black tracking-tight">{result.ok ? 'Protocol Synced' : 'Conflict Detected'}</p>
            <p className="text-slate-600 font-black mt-1 uppercase tracking-[0.2em] text-[10px]">{result.message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── MAIN APP ROUTER ──────────────────────────────────────────────────────────
export default function App() {
  const [isLogged, setIsLogged] = useState(!!localStorage.getItem('cc_token'));
  const [metrics, setMetrics] = useState({ current_balance: 0, days_to_zero: 0, status: 'Active' });
  const [projection, setProjection] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [quarantine, setQuarantine] = useState([]);
  const [activeTab, setActiveTab] = useState('insights');
  const [refreshing, setRefreshing] = useState(false);

  const fetchAll = useCallback(async () => {
    if (!isLogged) return;
    setRefreshing(true);
    try {
      const [m, p, t, q] = await Promise.all([
        axios.get(`${API}/api/liquidity/overview`),
        axios.get(`${API}/api/liquidity/projection`),
        axios.get(`${API}/api/transactions`),
        axios.get(`${API}/api/quarantine`),
      ]);
      setMetrics(m.data); setProjection(p.data); setTransactions(t.data); setQuarantine(q.data);
    } catch (e) { console.error(e); }
    finally { setRefreshing(false); }
  }, [isLogged]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const onLogout = () => { localStorage.clear(); setIsLogged(false); };

  if (!isLogged) return <AuthPage onLogin={() => setIsLogged(true)} />;

  const NAV_ITEMS = [
    { id: 'insights', label: 'Homepage', icon: TrendingUp },
    { id: 'payments', label: 'Priority Rankings', icon: BarChart2 },
    { id: 'upload', label: 'Data Ingestion', icon: RefreshCw },
  ];

  return (
    <div className="min-h-screen bg-[#020617] flex font-sans text-slate-200 selection:bg-emerald-500/30 overflow-x-hidden">

      {/* ── SIDEBAR ── */}
      <aside className="w-[100px] lg:w-[350px] bg-[#0f172a] p-6 lg:p-12 flex flex-col shrink-0 sticky top-0 h-screen transition-all shadow-[10px_0_40px_rgba(0,0,0,0.4)] border-r border-slate-800 z-50 overflow-y-auto">
        <div className="flex items-center gap-5 mb-20 relative z-10">
          <div className="w-14 lg:w-16 h-14 lg:h-16 bg-gradient-to-tr from-indigo-600 via-violet-600 to-emerald-400 rounded-3xl flex items-center justify-center font-black text-white text-2xl lg:text-3xl shrink-0 shadow-2xl">C</div>
          <div className="block shrink-0">
            <h1 className="text-2xl lg:text-3xl font-black text-white tracking-tighter">ClearCash</h1>
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mt-1">By Silson</p>
          </div>
        </div>

        <nav className="space-y-6 flex-grow relative z-10">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`group flex items-center gap-6 px-4 lg:px-8 py-6 rounded-[2.5rem] font-black w-full transition-all duration-300 relative overflow-hidden
                ${activeTab === id ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}>
              {activeTab === id && <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600" />}
              <div className="relative z-10 shrink-0"><Icon size={26} /></div>
              <span className="hidden lg:block text-xs lg:text-sm tracking-[0.2em] uppercase relative z-10 font-black whitespace-nowrap">{label}</span>
              {id === 'upload' && quarantine.length > 0 && (
                <div className="ml-auto w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_12px_#f43f5e] relative z-10 hidden lg:block" />
              )}
            </button>
          ))}
        </nav>

        <div className="relative z-10 mt-12 bg-[#1e293b]/50 rounded-[3rem] p-6 lg:p-10 border border-slate-800 shadow-2xl">
          <div className="flex items-center gap-6 mb-10">
            <div className="w-12 lg:w-14 h-12 lg:h-14 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 border border-slate-700 flex items-center justify-center text-white font-black text-xl shrink-0">
              {(localStorage.getItem('cc_user') || 'S').charAt(0).toUpperCase()}
            </div>
            <div className="hidden lg:block">
              <p className="text-lg font-black text-white leading-tight">{localStorage.getItem('cc_user') || 'Silson Admin'}</p>
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mt-1">Node Authorized</p>
            </div>
          </div>
          <button onClick={onLogout} className="w-full flex items-center justify-center gap-4 py-5 bg-slate-900/50 hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase transition-all border border-slate-800 active:scale-95">
            <LogOut size={16} className="shrink-0" />
            <span className="hidden lg:block">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 min-w-0 relative z-10">
        <header className="sticky top-0 z-40 bg-[#020617]/80 backdrop-blur-3xl border-b border-slate-800/40 px-8 lg:px-20 py-10 lg:py-14 flex items-center justify-between gap-6">
          <div className="min-w-0">
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.5em] mb-3 leading-none whitespace-nowrap">T3 FINTECH</p>
            <h2 className="text-4xl lg:text-6xl font-black text-white tracking-tighter leading-none">{NAV_ITEMS.find(n => n.id === activeTab).label}</h2>
          </div>
          <div className="flex items-center gap-6 lg:gap-10 shrink-0">
            <button onClick={fetchAll} disabled={refreshing} className="hidden sm:flex items-center gap-4 px-8 lg:px-10 py-5 bg-indigo-600 text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-[1.8rem] shadow-xl transition-all active:scale-95 disabled:opacity-50 border-t border-t-white/20 whitespace-nowrap">
              <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
            <div className="w-16 lg:w-20 h-16 lg:h-20 bg-[#0f172a] rounded-[2rem] flex items-center justify-center border border-slate-800 relative shrink-0 shadow-2xl">
              <Target size={32} className="text-emerald-500 relative z-10" />
            </div>
          </div>
        </header>

        <div className="p-8 lg:p-20 pb-40 max-w-[1700px] mx-auto w-full">
          {activeTab === 'insights' && <InsightsTab metrics={metrics} projection={projection} transactions={transactions} />}
          {activeTab === 'payments' && <PaymentsTab />}
          {activeTab === 'upload' && <UploadTab onUploadSuccess={fetchAll} />}
        </div>
      </main>
    </div>
  );
}