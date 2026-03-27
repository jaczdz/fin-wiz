import { Outlet, NavLink } from 'react-router-dom';
import { Home, LineChart, Calculator, BookOpen, Menu, X, Activity } from 'lucide-react';
import { useState } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const INDICATORS = [
  { id: 'stopy', name: 'Stopy procentowe' },
  { id: 'inflacja', name: 'Inflacja (CPI)' },
  { id: 'wibor', name: 'WIBOR' },
  { id: 'wiron', name: 'WIRON' },
  { id: 'wibid', name: 'WIBID' },
  { id: 'polstr', name: 'POLSTR' },
];

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200/60 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex-shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)]",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full flex flex-col">
          <div className="h-20 flex items-center px-8 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center mr-3 shadow-lg shadow-indigo-600/20">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-display font-bold tracking-tight text-slate-900">FinWiz</span>
            <button 
              className="ml-auto lg:hidden text-slate-400 hover:text-slate-600 bg-slate-50 p-2 rounded-full"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-1.5">
            <NavLink
              to="/"
              className={({ isActive }) => cn(
                "flex items-center px-4 py-3 text-sm font-medium rounded-2xl transition-all duration-200",
                isActive 
                  ? "bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-100/50" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Home className="w-5 h-5 mr-3" />
              Strona Główna
            </NavLink>

            <div className="pt-6 pb-2">
              <p className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                Wskaźniki
              </p>
              <div className="space-y-1">
                {INDICATORS.map((indicator) => (
                  <NavLink
                    key={indicator.id}
                    to={`/wskazniki/${indicator.id}`}
                    className={({ isActive }) => cn(
                      "flex items-center px-4 py-2.5 text-sm font-medium rounded-2xl transition-all duration-200",
                      isActive 
                        ? "bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-100/50" 
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    {({ isActive }) => (
                      <>
                        <span className={cn(
                          "w-1.5 h-1.5 rounded-full mr-3",
                          isActive ? "bg-indigo-600" : "bg-slate-300"
                        )} />
                        {indicator.name}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>

            <div className="pt-6">
              <NavLink
                to="/kalkulator"
                className={({ isActive }) => cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-2xl transition-all duration-200",
                  isActive 
                    ? "bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-100/50" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Calculator className="w-5 h-5 mr-3" />
                Porównanie Kredytów
              </NavLink>

              <NavLink
                to="/dokumentacja"
                className={({ isActive }) => cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-2xl transition-all duration-200 mt-1.5",
                  isActive 
                    ? "bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-100/50" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <BookOpen className="w-5 h-5 mr-3" />
                Dokumentacja
              </NavLink>
            </div>
          </nav>
          
          <div className="p-6 m-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center text-xs font-medium text-slate-500">
              <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
              System operacyjny
            </div>
            <p className="text-[10px] text-slate-400 mt-1.5">Dane z portalu stooq.pl</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 flex items-center px-6 lg:hidden sticky top-0 z-30">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="ml-4 flex items-center">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center mr-2">
              <Activity className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-xl font-display font-bold text-slate-900">FinWiz</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-12">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
