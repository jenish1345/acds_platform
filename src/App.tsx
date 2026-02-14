import { useState } from 'react';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { LoginView } from './views/LoginView';
import { SignupView, SignupData } from './views/SignupView';
import { PricingView } from './views/PricingView';
import { SubscriptionView } from './views/SubscriptionView';
import { DataImportView } from './views/DataImportView';
import { DashboardView } from './views/DashboardView';
import { AlertsView } from './views/AlertsView';
import { AnalysisView } from './views/AnalysisView';
import { ImpactView } from './views/ImpactView';
import { RecommendationsView } from './views/RecommendationsView';
import { HeatmapView } from './views/HeatmapView';
import { ReportView } from './views/ReportView';
import { mockUser } from './data/mockData';
import type { BillingInterval } from './types/subscription';

type ViewType = 'dashboard' | 'alerts' | 'analysis' | 'impact' | 'recommendations' | 'heatmap' | 'report' | 'subscription' | 'pricing' | 'import';
type AppState = 'login' | 'signup' | 'pricing' | 'trial' | 'authenticated';

function App() {
  const [appState, setAppState] = useState<AppState>('login');
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [selectedAlertId, setSelectedAlertId] = useState<string | undefined>();

  const handleLogin = (email: string, password: string) => {
    // Simple mock authentication
    if (email && password) {
      setAppState('authenticated');
    }
  };

  const handleSignup = (data: SignupData) => {
    console.log('Signup data:', data);
    // In production, this would create account and start trial
    setAppState('pricing');
  };

  const handleSelectPlan = (planId: string, interval: BillingInterval) => {
    console.log('Selected plan:', planId, interval);
    // In production, this would redirect to Stripe checkout
    // For demo, just start trial
    setAppState('trial');
    setTimeout(() => setAppState('authenticated'), 1000);
  };

  const handleLogout = () => {
    setAppState('login');
    setActiveView('dashboard');
  };

  const handleNavigate = (view: string, alertId?: string) => {
    setActiveView(view as ViewType);
    if (alertId) {
      setSelectedAlertId(alertId);
    }
  };

  // Login/Signup Flow
  if (appState === 'login') {
    return (
      <div>
        <LoginView onLogin={handleLogin} />
        <div className="fixed bottom-4 right-4">
          <button
            onClick={() => setAppState('signup')}
            className="btn-primary"
          >
            Start Free Trial
          </button>
        </div>
      </div>
    );
  }

  if (appState === 'signup') {
    return <SignupView onSignup={handleSignup} />;
  }

  if (appState === 'pricing') {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <PricingView onSelectPlan={handleSelectPlan} />
      </div>
    );
  }

  if (appState === 'trial') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-corporate-navy to-corporate-darkblue flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Setting up your trial...</h2>
          <p className="text-gray-300">This will only take a moment</p>
        </div>
      </div>
    );
  }

  // Main Application
  return (
    <div className="min-h-screen flex flex-col">
      <Header user={mockUser} onLogout={handleLogout} />
      <div className="flex flex-1">
        <Sidebar activeView={activeView} onNavigate={handleNavigate} />
        <main className="flex-1 p-8 bg-gray-50 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {activeView === 'dashboard' && <DashboardView onNavigate={handleNavigate} />}
            {activeView === 'alerts' && <AlertsView onNavigate={handleNavigate} />}
            {activeView === 'analysis' && <AnalysisView selectedAlertId={selectedAlertId} onNavigate={handleNavigate} />}
            {activeView === 'impact' && <ImpactView onNavigate={handleNavigate} />}
            {activeView === 'recommendations' && <RecommendationsView />}
            {activeView === 'heatmap' && <HeatmapView />}
            {activeView === 'report' && <ReportView />}
            {activeView === 'import' && <DataImportView />}
            {activeView === 'subscription' && <SubscriptionView />}
            {activeView === 'pricing' && <PricingView onSelectPlan={handleSelectPlan} />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
