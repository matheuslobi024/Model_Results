import React from 'react';
import { Home, LayoutDashboard, Sliders, FileSpreadsheet, GitBranch, ShieldCheck, Lock } from 'lucide-react';
import { useFinancialStore } from '../store/financialStore';

interface SidebarProps {
  activeScreen: number;
  onSelectScreen: (screenNumber: number) => void;
  isAuthenticated?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeScreen, onSelectScreen, isAuthenticated = true }) => {
  const { themeMode } = useFinancialStore();
  const isDark = themeMode === 'dark';

  const menuItems = [
    { id: 1, label: 'Landing Page', icon: Home, requiresAuth: false },
    { id: 2, label: 'Autenticação / Login', icon: ShieldCheck, requiresAuth: false },
    { id: 3, label: 'Dashboard Principal', icon: LayoutDashboard, requiresAuth: true },
    { id: 4, label: 'Classificação & Canvas', icon: Sliders, requiresAuth: true },
    { id: 5, label: 'Especificações & Custos', icon: FileSpreadsheet, requiresAuth: true },
    { id: 6, label: 'Gestor de Cenários', icon: GitBranch, requiresAuth: true },
  ];

  return (
    <aside className={`w-64 min-h-[calc(100vh-4rem)] p-4 border-r flex flex-col justify-between ${
      isDark ? 'bg-[#182129] text-white border-[#2D3945]' : 'bg-white text-slate-900 border-slate-200'
    }`}>
      <div className="space-y-4">
        <div className="px-3 py-2 flex items-center justify-center">
          <img
            src={isDark ? "/logo-dark-icon.jpg" : "/logo-light-icon.jpg"}
            alt="MR Symbol"
            className="h-12 w-auto object-contain"
          />
        </div>

        <nav className="space-y-1">
          <p className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Módulos do Sistema
          </p>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeScreen === item.id;
            const isLocked = item.requiresAuth && !isAuthenticated;

            return (
              <button
                key={item.id}
                onClick={() => onSelectScreen(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? isDark ? 'bg-[#C87A54] text-white shadow-md font-bold' : 'bg-[#002D4A] text-white shadow-md font-bold'
                    : isLocked
                      ? isDark ? 'text-slate-500 hover:bg-[#202B36]' : 'text-slate-400 hover:bg-slate-50'
                      : isDark ? 'text-slate-300 hover:bg-[#202B36] hover:text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : isLocked ? 'text-slate-400' : isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                  <span>Tela {item.id}: {item.label}</span>
                </div>
                {isLocked && <Lock className="w-3.5 h-3.5 text-slate-400" />}
              </button>
            );
          })}
        </nav>
      </div>

      <div className={`p-3 rounded-xl border text-[11px] ${
        isDark ? 'bg-[#202B36] border-[#2D3945] text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
      }`}>
        <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Model Results v1.0</p>
        <p className="mt-1">
          {isAuthenticated ? 'Sessão Ativa: Autenticado' : 'Acesso Restrito: Faça Login'}
        </p>
      </div>
    </aside>
  );
};
