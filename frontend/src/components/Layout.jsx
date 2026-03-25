import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

const Layout = () => {
  const location = useLocation();

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Data', path: '/data' },
    { name: 'Forecasts', path: '/forecasts' },
    { name: 'Actions', path: '/actions' },
    { name: 'Settings', path: '/settings' },
  ];

  const sideNavLinks = [
    { name: 'Live Cash Balance', path: '/dashboard', icon: 'payments' },
    { name: 'DCOH Monitor', path: '/dcoh', icon: 'hourglass_empty' },
    { name: 'Risk Exposure', path: '/risk', icon: 'monitoring' },
  ];

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm flex justify-between items-center px-8 h-16">
        <div className="flex items-center gap-12">
          <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white font-headline">LiquidityOS</span>
          <div className="hidden md:flex space-x-8 h-full items-center pt-1">
            {navLinks.map((link) => {
              const isActive = location.pathname.startsWith(link.path);
              return (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={`font-manrope text-sm font-semibold transition-colors duration-200 ${
                    isActive
                      ? 'text-slate-900 dark:text-white border-b-2 border-slate-900 dark:border-white pb-5 translate-y-[2px]'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {link.name}
                </NavLink>
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-2 hidden sm:block"></div>
          <div className="flex items-center gap-3 pl-2">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-900 dark:text-white leading-none">Alex Rivera</p>
              <p className="text-[10px] text-slate-500 font-medium mt-1 uppercase tracking-wider">CFO</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-slate-200 overflow-hidden ring-2 ring-white dark:ring-slate-800 shadow-sm">
              <img
                alt="User Profile"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBem7FOIDymPpTdQQ5JXxuiVSiVBQ2EyP1iRXAM4129yXVOthVLNTGA5fnMoRSeiFpDXj5gWmlUXpkgtb6oi0PbQ9DZL7ZyNDcoBQBGRNPNiCM9iO9MDZSs413Jsl2M4MvB5YD4rQUj6lXlpkiKj839jmVnw5yjOZXtuX3wgA6WolF8kopbIvs5TP921svFnjecpK2kTu5ankwbdhXC9vO_ElJceG8bIyU5fCZH5ilGT6cRF7ENxK_et4MMkSIWRcLUpnaMFUS7O0Y"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* SideNavBar & Main Content Wrapper */}
      <div className="flex flex-1 pt-16">
        {/* SideNavBar */}
        <aside className="w-64 fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white dark:bg-slate-900 border-r border-slate-200/50 dark:border-slate-800 flex flex-col p-6 z-40 hidden lg:flex">
          <div className="flex flex-col gap-1 mb-8">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Treasury Status</span>
            <span className="font-manrope font-extrabold text-slate-900 dark:text-white text-base">Financial Metrics</span>
          </div>
          <nav className="flex flex-col space-y-1.5 flex-1">
            {sideNavLinks.map((link) => {
              const isActive = location.pathname.startsWith(link.path);
              return (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm transition-all ${
                    isActive
                      ? 'bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                      : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white font-medium'
                  }`}
                >
                  <span className={`material-symbols-outlined ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                    {link.icon}
                  </span>
                  <span>{link.name}</span>
                </NavLink>
              );
            })}
          </nav>
          
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <button className="w-full primary-gradient text-white py-3 rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
              Refresh Data
            </button>
            <div className="flex flex-col space-y-1">
              <button className="flex items-center space-x-3 px-4 py-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg transition-colors">
                <span className="material-symbols-outlined text-[18px]">support_agent</span>
                <span className="text-[11px] font-semibold">Concierge Support</span>
              </button>
              <button className="flex items-center space-x-3 px-4 py-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg transition-colors">
                <span className="material-symbols-outlined text-[18px]">history</span>
                <span className="text-[11px] font-semibold">Audit Logs</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="w-full lg:ml-64 bg-surface p-8 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
