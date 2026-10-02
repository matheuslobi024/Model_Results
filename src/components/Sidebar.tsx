import React from 'react';
import { LayoutDashboard, Sliders, FileSpreadsheet, GitBranch, ArrowLeft, Wrench } from 'lucide-react';
import { useFinancialStore } from '../store/financialStore';

interface SidebarProps {
  activeScreen: number;
  onSelectScreen: (screenNumber: number) => void;
  isAuthenticated?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeScreen, onSelectScreen, isAuthenticated = true }) => {
  const { themeMode } = useFinancialStore();
  const isDark = themeMode === 'dark';

  // Do not render sidebar for Screen 1 (Landing Page) and Screen 2 (AuthScreen)
  if (activeScreen === 1 || activeScreen === 2) {
    return null;
  }

  const isToolsSection = activeScreen >= 4;

  const toolsMenuItems = [
    { id: 4, label: 'Classificação & Canvas', icon: Sliders },
    { id: 5, label: 'Especificações & Custos', icon: FileSpreadsheet },
    { id: 6, label: 'Gestor de Cenários', icon: GitBranch },
  ];

  const dashboardMenuItems = [
    { id: 3, label: 'Dashboard Principal', icon: LayoutDashboard },
    { id: 4, label: 'Ferramentas de Modelagem', icon: Wrench },
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

        {isToolsSection ? (
          /* Dedicated Sidebar for the last 3 pages (Screens 4, 5, 6 - Modeling & Configuration Tools) */
          <nav className="space-y-1">
            <button
              onClick={() => onSelectScreen(3)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold mb-3 transition-all ${
                isDark ? 'bg-[#202B36] text-slate-300 hover:text-white border border-[#2D3945]' : 'bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar ao Dashboard</span>
            </button>

            <p className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Ferramentas de Modelagem
            </p>

            {toolsMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectScreen(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? isDark ? 'bg-[#C87A54] text-white shadow-md font-bold' : 'bg-[#002D4A] text-white shadow-md font-bold'
                      : isDark ? 'text-slate-300 hover:bg-[#202B36] hover:text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                  <span>Tela {item.id}: {item.label}</span>
                </button>
              );
            })}
          </nav>
        ) : (
          /* Main Dashboard Sidebar (Screen 3) */
          <nav className="space-y-1">
            <p className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Visão Geral
            </p>
            {dashboardMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectScreen(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? isDark ? 'bg-[#C87A54] text-white shadow-md font-bold' : 'bg-[#002D4A] text-white shadow-md font-bold'
                      : isDark ? 'text-slate-300 hover:bg-[#202B36] hover:text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        )}
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
