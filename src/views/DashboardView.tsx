import React from 'react';
import { HealthScore } from '../components/Dashboard/HealthScore';
import { KPICard } from '../components/Dashboard/KPICard';
import { AlertCard } from '../components/Alerts/AlertCard';
import { AIInsightsCard } from '../components/Dashboard/AIInsightsCard';
import { ComparisonView } from '../components/Dashboard/ComparisonView';
import { companyHealth, kpis, alerts } from '../data/mockData';
import type { Dataset, DatasetComparison, PredictiveInsight } from '../types/dataset';
import type { Alert, KPI, CompanyHealth } from '../types';

interface DashboardViewProps {
  onNavigate: (view: string, alertId?: string) => void;
  currentDataset?: Dataset;
  comparisonData?: DatasetComparison;
  dynamicKPIs?: KPI[];
  dynamicAlerts?: Alert[];
  dynamicHealth?: CompanyHealth;
  predictiveInsights?: PredictiveInsight[];
  predictedLoss?: number;
  riskProbability?: number;
  vulnerableDepartment?: string;
  aiConfidence?: number;
  comparisonMode?: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ 
  onNavigate,
  currentDataset,
  comparisonData,
  dynamicKPIs,
  dynamicAlerts,
  dynamicHealth,
  predictiveInsights = [],
  predictedLoss = 0,
  riskProbability = 0,
  vulnerableDepartment = 'Not Available',
  aiConfidence = 0,
  comparisonMode = false
}) => {
  // Use dynamic data if available, otherwise fall back to mock data
  const displayHealth = dynamicHealth || companyHealth;
  const displayKPIs = dynamicKPIs || kpis;
  const displayAlerts = dynamicAlerts || alerts;
  const hasAIData = currentDataset && predictiveInsights.length > 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Executive Dashboard</h1>
        <p className="text-sm text-gray-600">
          {currentDataset 
            ? `AI-powered insights from ${currentDataset.metadata.name}` 
            : 'Real-time company health and risk monitoring'}
        </p>
      </div>

      {/* Comparison Mode */}
      {comparisonMode && comparisonData && (
        <ComparisonView comparison={comparisonData} />
      )}

      {/* Health Score & KPIs */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1">
          <HealthScore health={displayHealth} />
        </div>
        <div className="col-span-2 grid grid-cols-2 gap-4">
          {displayKPIs.map((kpi) => (
            <KPICard key={kpi.id} kpi={kpi} />
          ))}
        </div>
      </div>

      {/* AI Predictive Insights */}
      {hasAIData && (
        <AIInsightsCard
          insights={predictiveInsights}
          predictedLoss={predictedLoss}
          riskProbability={riskProbability}
          vulnerableDepartment={vulnerableDepartment}
          confidence={aiConfidence}
        />
      )}

      {/* Critical Alerts */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Critical Alerts</h2>
          <button
            onClick={() => onNavigate('alerts')}
            className="text-sm text-corporate-navy hover:text-corporate-darkblue font-medium"
          >
            View All Alerts →
          </button>
        </div>
        <div className="space-y-4">
          {displayAlerts.slice(0, 3).map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onViewDetails={(id) => onNavigate('analysis', id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
