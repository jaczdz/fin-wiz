import { Outlet, NavLink } from 'react-router-dom';
import { Home, LineChart, Calculator, BookOpen, Menu, X } from 'lucide-react';
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
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:flex-shrink-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full flex flex-col">
          <div className="h-16 flex items-center px-6 border-b border-slate-200">
            <LineChart className="w-6 h-6 text-indigo-600 mr-2" />
            <span className="text-lg font-bold text-slate-900">FinWiz</span>
            <button 
              className="ml-auto lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            <NavLink
              to="/"
              className={({ isActive }) => cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-700 hover:bg-slate-100"
              )}
            >
              <Home className="w-5 h-5 mr-3" />
              Strona Główna
            </NavLink>

            <div className="pt-4 pb-2">
              <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Wskaźniki
              </p>
              <div className="mt-2 space-y-1">
                {INDICATORS.map((indicator) => (
                  <NavLink
                    key={indicator.id}
                    to={`/wskazniki/${indicator.id}`}
                    className={({ isActive }) => cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-md pl-11",
                      isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-700 hover:bg-slate-100"
                    )}
                  >
                    {indicator.name}
                  </NavLink>
                ))}
              </div>
            </div>

            <NavLink
              to="/kalkulator"
              className={({ isActive }) => cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-700 hover:bg-slate-100"
              )}
            >
              <Calculator className="w-5 h-5 mr-3" />
              Porównanie Kredytów
            </NavLink>

            <NavLink
              to="/dokumentacja"
              className={({ isActive }) => cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-700 hover:bg-slate-100"
              )}
            >
              <BookOpen className="w-5 h-5 mr-3" />
              Dokumentacja
            </NavLink>
          </nav>
          
          <div className="p-4 border-t border-slate-200 text-xs text-slate-500">
            Dane z portalu stooq.pl
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 lg:hidden">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-md text-slate-500 hover:bg-slate-100"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="ml-4 text-lg font-bold text-slate-900">FinWiz</span>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
