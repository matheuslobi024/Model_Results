import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { AuthScreen } from './components/AuthScreen';
import { DashboardView } from './components/DashboardView';
import { BusinessClassification } from './components/BusinessClassification';
import { ProjectSpecifications } from './components/ProjectSpecifications';
import { ScenarioManager } from './components/ScenarioManager';
import { useFinancialStore } from './store/financialStore';

export default function App() {
  const isDevMode = import.meta.env.DEV;

  // In dev mode (npm run dev), authenticated by default & opens directly on Screen 3 (Dashboard)
  // In user / prod mode (npm start / npm run build & preview), requires login & opens on Screen 1 (Landing Page)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(isDevMode);
  const [activeScreen, setActiveScreen] = useState<number>(isDevMode ? 3 : 1);

  const { activeScenarioId, scenarios, themeMode } = useFinancialStore();
  const currentScenarioName = scenarios.find((s) => s.id === activeScenarioId)?.name || 'Base';

  const handleExportPdf = () => {
    window.open('/Relatorio_Executivo_Model_Results.pdf', '_blank');
  };

  const handleSelectScreen = (screenNumber: number) => {
    // In user mode (non-dev & not authenticated), block access to modules 3, 4, 5, 6
    if (!isAuthenticated && !isDevMode && screenNumber >= 3) {
      setActiveScreen(2); // Redirect to Login screen
      return;
    }
    setActiveScreen(screenNumber);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setActiveScreen(3); // Navigate to Dashboard on successful login
  };

  const isDark = themeMode === 'dark';

  return (
    <div className={`min-h-screen flex flex-col font-sans ${isDark ? 'bg-[#182129] text-white' : 'bg-slate-50 text-slate-900'}`}>
      <Header
        projectName="Distribuidora Aurora"
        activeScenarioName={currentScenarioName}
        onExportPdf={handleExportPdf}
      />

      <div className="flex flex-1">
        <Sidebar
          activeScreen={activeScreen}
          onSelectScreen={handleSelectScreen}
          isAuthenticated={isAuthenticated || isDevMode}
        />

        <main className={`flex-1 overflow-y-auto ${isDark ? 'bg-[#182129] text-white' : 'bg-slate-50 text-slate-900'}`}>
          {activeScreen === 1 && (
            <LandingPage
              onStartClick={() => {
                if (isAuthenticated || isDevMode) {
                  setActiveScreen(3);
                } else {
                  setActiveScreen(2);
                }
              }}
            />
          )}
          {activeScreen === 2 && (
            <AuthScreen onLoginSuccess={handleLoginSuccess} />
          )}
          {activeScreen === 3 && (isAuthenticated || isDevMode ? <DashboardView /> : <AuthScreen onLoginSuccess={handleLoginSuccess} />)}
          {activeScreen === 4 && (isAuthenticated || isDevMode ? <BusinessClassification /> : <AuthScreen onLoginSuccess={handleLoginSuccess} />)}
          {activeScreen === 5 && (isAuthenticated || isDevMode ? <ProjectSpecifications /> : <AuthScreen onLoginSuccess={handleLoginSuccess} />)}
          {activeScreen === 6 && (isAuthenticated || isDevMode ? <ScenarioManager /> : <AuthScreen onLoginSuccess={handleLoginSuccess} />)}
        </main>
      </div>
    </div>
  );
}
