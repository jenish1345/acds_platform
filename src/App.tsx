import { useState } from 'react';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { LoginView } from './views/LoginView';
import { SignupView, SignupData } from './views/SignupView';
import { PricingView } from './views/PricingView';
import { SubscriptionView } from './views/SubscriptionView';
import { DataImportView } from './views/DataImportView';
import { DataUploadView } from './views/DataUploadView';
import { DashboardView } from './views/DashboardView';
import { AlertsView } from './views/AlertsView';
import { AnalysisView } from './views/AnalysisView';
import { ImpactView } from './views/ImpactView';
import { RecommendationsView } from './views/RecommendationsView';
import { HeatmapView } from './views/HeatmapView';
import { ReportView } from './views/ReportView';
import { mockUser } from './data/mockData';
import type { BillingInterval } from './types/subscription';
import type { Dataset, DatasetComparison, PredictiveInsight } from './types/dataset';
import type { Alert, KPI, CompanyHealth } from './types';
import { 
  calculateHealthScore, 
  detectRiskAlerts, 
  predictFinancialLoss,
  generatePredictiveInsights,
  identifyVulnerableDepartment
} from './services/aiEngine';
import { calculateStats, formatNumber } from './utils/dataProcessor';

type ViewType = 'dashboard' | 'alerts' | 'analysis' | 'impact' | 'recommendations' | 'heatmap' | 'report' | 'subscription' | 'pricing' | 'import' | 'upload';
type AppState = 'login' | 'signup' | 'pricing' | 'trial' | 'authenticated';

function App() {
  const [appState, setAppState] = useState<AppState>('login');
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [selectedAlertId, setSelectedAlertId] = useState<string | undefined>();
  
  // AI-powered dynamic data state
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [currentDataset, setCurrentDataset] = useState<Dataset | null>(null);
  const [comparisonMode] = useState(false);
  const [comparisonData] = useState<DatasetComparison | null>(null);
  
  // Dynamic dashboard data
  const [dynamicKPIs, setDynamicKPIs] = useState<KPI[] | undefined>(undefined);
  const [dynamicAlerts, setDynamicAlerts] = useState<Alert[] | undefined>(undefined);
  const [dynamicHealth, setDynamicHealth] = useState<CompanyHealth | undefined>(undefined);
  const [predictiveInsights, setPredictiveInsights] = useState<PredictiveInsight[]>([]);
  const [predictedLoss, setPredictedLoss] = useState(0);
  const [riskProbability, setRiskProbability] = useState(0);
  const [vulnerableDepartment, setVulnerableDepartment] = useState('Not Available');
  const [aiConfidence, setAiConfidence] = useState(0);

  // Process dataset and generate AI insights
  const processDataset = async (dataset: Dataset) => {
    try {
      // Calculate health score
      const healthScore = await calculateHealthScore(dataset);
      
      // Detect alerts
      const alerts = await detectRiskAlerts(dataset);
      
      // Generate predictive insights
      const insights = await generatePredictiveInsights(dataset);
      
      // Predict financial loss
      const lossData = await predictFinancialLoss(dataset);
      
      // Identify vulnerable department
      const vulnDept = identifyVulnerableDepartment(dataset);
      
      // Generate dynamic KPIs
      const kpis = generateDynamicKPIs(dataset);
      
      // Update state
      setDynamicHealth({
        overallScore: healthScore,
        riskStatus: healthScore >= 70 ? 'healthy' : healthScore >= 50 ? 'warning' : 'critical',
        lastUpdated: new Date().toISOString(),
        trend: 'stable'
      });
      
      setDynamicAlerts(alerts);
      setDynamicKPIs(kpis);
      setPredictiveInsights(insights);
      setPredictedLoss(lossData.estimatedLoss);
      setRiskProbability(Math.min(95, 60 + (alerts.length * 10)));
      setVulnerableDepartment(vulnDept);
      setAiConfidence(lossData.confidence);
      
    } catch (error) {
      console.error('Error processing dataset:', error);
    }
  };

  // Generate dynamic KPIs from dataset
  const generateDynamicKPIs = (dataset: Dataset): KPI[] => {
    const kpis: KPI[] = [];
    const { data, mappings } = dataset;
    
    if (!mappings) return kpis;
    
    // Revenue Growth KPI
    if (mappings.revenue) {
      const stats = calculateStats(data, mappings.revenue);
      const recent = data.slice(-2).map(row => Number(row[mappings.revenue!]));
      const change = recent.length === 2 ? ((recent[1] - recent[0]) / recent[0]) * 100 : 0;
      
      kpis.push({
        id: 'kpi_revenue',
        label: 'Revenue',
        value: `$${formatNumber(stats.mean)}`,
        change: Number(change.toFixed(1)),
        trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable'
      });
    }
    
    // Profit Margin KPI
    if (mappings.profit && mappings.revenue) {
      const profitStats = calculateStats(data, mappings.profit);
      const revenueStats = calculateStats(data, mappings.revenue);
      const margin = (profitStats.mean / revenueStats.mean) * 100;
      
      kpis.push({
        id: 'kpi_margin',
        label: 'Profit Margin',
        value: `${margin.toFixed(1)}%`,
        change: 0,
        trend: 'stable'
      });
    }
    
    // Customer Retention KPI
    if (mappings.retention) {
      const stats = calculateStats(data, mappings.retention);
      kpis.push({
        id: 'kpi_retention',
        label: 'Customer Retention',
        value: `${stats.mean.toFixed(1)}%`,
        change: 0,
        trend: stats.mean > 85 ? 'up' : 'down'
      });
    }
    
    // Employee Satisfaction KPI
    if (mappings.satisfaction) {
      const stats = calculateStats(data, mappings.satisfaction);
      kpis.push({
        id: 'kpi_satisfaction',
        label: 'Employee Satisfaction',
        value: `${stats.mean.toFixed(1)}/10`,
        change: 0,
        trend: stats.mean > 7.5 ? 'up' : 'down'
      });
    }
    
    return kpis;
  };

  // Handle dataset upload
  const handleDatasetUploaded = async (dataset: Dataset) => {
    setDatasets(prev => [...prev, dataset]);
    setCurrentDataset(dataset);
    await processDataset(dataset);
    setActiveView('dashboard');
  };

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
    // Reset AI data
    setCurrentDataset(null);
    setDynamicKPIs(undefined);
    setDynamicAlerts(undefined);
    setDynamicHealth(undefined);
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
            {activeView === 'dashboard' && (
              <DashboardView 
                onNavigate={handleNavigate}
                currentDataset={currentDataset || undefined}
                comparisonData={comparisonData || undefined}
                dynamicKPIs={dynamicKPIs}
                dynamicAlerts={dynamicAlerts}
                dynamicHealth={dynamicHealth}
                predictiveInsights={predictiveInsights}
                predictedLoss={predictedLoss}
                riskProbability={riskProbability}
                vulnerableDepartment={vulnerableDepartment}
                aiConfidence={aiConfidence}
                comparisonMode={comparisonMode}
              />
            )}
            {activeView === 'alerts' && <AlertsView onNavigate={handleNavigate} />}
            {activeView === 'analysis' && <AnalysisView selectedAlertId={selectedAlertId} onNavigate={handleNavigate} />}
            {activeView === 'impact' && <ImpactView onNavigate={handleNavigate} />}
            {activeView === 'recommendations' && <RecommendationsView />}
            {activeView === 'heatmap' && <HeatmapView />}
            {activeView === 'report' && <ReportView />}
            {activeView === 'import' && <DataImportView />}
            {activeView === 'upload' && (
              <DataUploadView 
                onDatasetUploaded={handleDatasetUploaded}
                existingDatasets={datasets.map(ds => ds.metadata)}
              />
            )}
            {activeView === 'subscription' && <SubscriptionView />}
            {activeView === 'pricing' && <PricingView onSelectPlan={handleSelectPlan} />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
