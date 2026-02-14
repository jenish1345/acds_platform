import React from 'react';
import { HealthScore } from '../components/Dashboard/HealthScore';
import { KPICard } from '../components/Dashboard/KPICard';
import { AlertCard } from '../components/Alerts/AlertCard';
import { companyHealth, kpis, alerts } from '../data/mockData';

interface DashboardViewProps {
  onNavigate: (view: string, alertId?: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Executive Dashboard</h1>
        <p className="text-sm text-gray-600">Real-time company health and risk monitoring</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1">
          <HealthScore health={companyHealth} />
        </div>
        <div className="col-span-2 grid grid-cols-2 gap-4">
          {kpis.map((kpi) => (
            <KPICard key={kpi.id} kpi={kpi} />
          ))}
        </div>
      </div>

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
          {alerts.slice(0, 3).map((alert) => (
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
