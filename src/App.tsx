import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { AuthScreen } from './components/AuthScreen';
import { DashboardView } from './components/DashboardView';
import { BusinessClassification } from './components/BusinessClassification';
import { ProjectSpecifications } from './components/ProjectSpecifications';
import { ScenarioManager } from './components/ScenarioManager';
import { AccountSettings } from './components/AccountSettings';
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
    if (!isAuthenticated && !isDevMode && screenNumber >= 3) {
      setActiveScreen(2);
      return;
    }
    setActiveScreen(screenNumber);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setActiveScreen(3);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveScreen(2);
  };

  const isDark = themeMode === 'dark';
  const showSidebar = activeScreen !== 1 && activeScreen !== 2;
  const userIsAuth = isAuthenticated || isDevMode;

  return (
    <div className={`min-h-screen flex flex-col font-sans ${isDark ? 'bg-[#182129] text-white' : 'bg-slate-50 text-slate-900'}`}>
      <Header
        projectName="Distribuidora Aurora"
        activeScenarioName={currentScenarioName}
        onExportPdf={handleExportPdf}
        onLogout={userIsAuth ? handleLogout : undefined}
        isAuthenticated={userIsAuth}
      />

      <div className="flex flex-1">
        {showSidebar && (
          <Sidebar
            activeScreen={activeScreen}
            onSelectScreen={handleSelectScreen}
            isAuthenticated={userIsAuth}
            onLogout={userIsAuth ? handleLogout : undefined}
          />
        )}

        <main className={`flex-1 overflow-y-auto ${isDark ? 'bg-[#182129] text-white' : 'bg-slate-50 text-slate-900'}`}>
          {activeScreen === 1 && (
            <LandingPage
              onStartClick={() => {
                if (userIsAuth) {
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
          {activeScreen === 3 && (userIsAuth ? <DashboardView /> : <AuthScreen onLoginSuccess={handleLoginSuccess} />)}
          {activeScreen === 4 && (userIsAuth ? <BusinessClassification /> : <AuthScreen onLoginSuccess={handleLoginSuccess} />)}
          {activeScreen === 5 && (userIsAuth ? <ProjectSpecifications /> : <AuthScreen onLoginSuccess={handleLoginSuccess} />)}
          {activeScreen === 6 && (userIsAuth ? <ScenarioManager /> : <AuthScreen onLoginSuccess={handleLoginSuccess} />)}
          {activeScreen === 7 && (userIsAuth ? <AccountSettings onLogout={handleLogout} /> : <AuthScreen onLoginSuccess={handleLoginSuccess} />)}
        </main>
      </div>
    </div>
  );
}
