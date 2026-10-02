import React from 'react';
import { LayoutDashboard, Sliders, FileSpreadsheet, GitBranch, ArrowLeft, Wrench, User, LogOut } from 'lucide-react';
import { useFinancialStore } from '../store/financialStore';

interface SidebarProps {
  activeScreen: number;
  onSelectScreen: (screenNumber: number) => void;
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeScreen,
  onSelectScreen,
  isAuthenticated = true,
  onLogout,
}) => {
  const { themeMode } = useFinancialStore();
  const isDark = themeMode === 'dark';

  // Do not render sidebar for Screen 1 (Landing Page) and Screen 2 (AuthScreen)
  if (activeScreen === 1 || activeScreen === 2) {
    return null;
  }

  const isToolsSection = activeScreen >= 4 && activeScreen <= 6;

  const toolsMenuItems = [
    { id: 4, label: 'Classificação & Canvas', icon: Sliders },
    { id: 5, label: 'Especificações & Custos', icon: FileSpreadsheet },
    { id: 6, label: 'Gestor de Cenários', icon: GitBranch },
  ];

  const mainMenuItems = [
    { id: 3, label: 'Dashboard Principal', icon: LayoutDashboard },
    { id: 4, label: 'Ferramentas de Modelagem', icon: Wrench },
    { id: 7, label: 'Configuração da Conta', icon: User },
  ];

  return (
    <aside className={`w-64 h-[calc(100vh-4rem)] sticky top-16 flex-shrink-0 p-4 border-r flex flex-col justify-between overflow-y-auto ${
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
          /* Dedicated Sidebar for Modeling & Configuration Tools (Screens 4, 5, 6) */
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
                  <span>{item.label}</span>
                </button>
              );
            })}

            <div className="pt-2 border-t border-slate-200 dark:border-[#2D3945]">
              <button
                onClick={() => onSelectScreen(7)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  activeScreen === 7
                    ? isDark ? 'bg-[#C87A54] text-white shadow-md font-bold' : 'bg-[#002D4A] text-white shadow-md font-bold'
                    : isDark ? 'text-slate-300 hover:bg-[#202B36] hover:text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <User className={`w-4 h-4 ${activeScreen === 7 ? 'text-white' : isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                <span>Configuração da Conta</span>
              </button>
            </div>
          </nav>
        ) : (
          /* Main Dashboard & Account Sidebar (Screen 3 and Screen 7) */
          <nav className="space-y-1">
            <p className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Menu da Plataforma
            </p>
            {mainMenuItems.map((item) => {
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

      <div className="space-y-3 pt-4">
        {onLogout && (
          <button
            onClick={onLogout}
            className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all text-red-500 border ${
              isDark ? 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20' : 'bg-red-50 border-red-200 hover:bg-red-100'
            }`}
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sair da Conta</span>
          </button>
        )}

        <div className={`p-3 rounded-xl border text-[11px] ${
          isDark ? 'bg-[#202B36] border-[#2D3945] text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
        }`}>
          <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Model Results v1.0</p>
          <p className="mt-1">
            {isAuthenticated ? 'Sessão Ativa: Autenticado' : 'Acesso Restrito: Faça Login'}
          </p>
        </div>
      </div>
    </aside>
  );
};
