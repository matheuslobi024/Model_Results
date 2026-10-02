import React from 'react';
import { Download, Layers, Sun, Moon, LogOut } from 'lucide-react';
import { useFinancialStore } from '../store/financialStore';

interface HeaderProps {
  projectName?: string;
  activeScenarioName?: string;
  onExportPdf?: () => void;
  onLogout?: () => void;
  isAuthenticated?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  projectName = "Distribuidora Aurora",
  activeScenarioName = "Base",
  onExportPdf,
  onLogout,
  isAuthenticated = false,
}) => {
  const { themeMode, toggleTheme } = useFinancialStore();
  const isDark = themeMode === 'dark';

  return (
    <header className={`${isDark ? 'bg-[#182129] border-[#2D3945] text-white' : 'bg-white border-slate-200 text-slate-900'} border-b sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={isDark ? "/logo-dark-reduced.jpg" : "/logo-light-reduced.jpg"}
            alt="Model Results Logo"
            className="h-10 w-auto object-contain"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>

        <div className={`hidden md:flex items-center gap-3 px-3 py-1.5 rounded-lg border ${
          isDark ? 'bg-[#202B36] border-[#2D3945]' : 'bg-slate-100 border-slate-200'
        }`}>
          <Layers className={`w-4 h-4 ${isDark ? 'text-[#C87A54]' : 'text-[#002D4A]'}`} />
          <span className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{projectName}</span>
          <span className="text-slate-400">|</span>
          <span className={`text-xs font-bold uppercase ${isDark ? 'text-[#C87A54]' : 'text-[#002D4A]'}`}>{activeScenarioName}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-all border ${
              isDark ? 'bg-[#202B36] hover:bg-slate-700 text-slate-200 border-[#2D3945]' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
            title="Alternar Modo Claro / Escuro"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          <button
            onClick={onExportPdf}
            className={`flex items-center gap-2 font-bold px-4 py-2 rounded-lg text-xs transition-all shadow-md active:scale-95 text-white ${
              isDark ? 'bg-[#C87A54] hover:bg-[#b06844]' : 'bg-[#002D4A] hover:bg-[#001D30]'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Exportar PDF</span>
          </button>

          {isAuthenticated && onLogout && (
            <button
              onClick={onLogout}
              className={`p-2 rounded-lg transition-all border text-red-500 ${
                isDark ? 'bg-red-500/10 hover:bg-red-500/20 border-red-500/30' : 'bg-red-50 hover:bg-red-100 border-red-200'
              }`}
              title="Sair da Conta"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
