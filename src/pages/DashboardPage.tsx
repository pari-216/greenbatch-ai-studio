import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, CheckCircle, Leaf, AlertTriangle, TrendingUp } from 'lucide-react';
import { getSession, findCompany, getSuccessRate, getSustainabilityMetrics, getAlerts } from '@/lib/store';
import AppLayout from '@/components/AppLayout';

const DashboardPage = () => {
  const navigate = useNavigate();
  const session = getSession();
  const company = session ? findCompany(session.companyId) : null;
  const alerts = getAlerts();
  const activeAlerts = alerts.filter(a => !a.acknowledged);

  const sustainability = useMemo(() => getSustainabilityMetrics(), []);

  const medicines = company?.medicines ?? [];
  const avgSuccess = useMemo(() => {
    if (medicines.length === 0) return 0;
    return +(medicines.reduce((sum, m) => sum + getSuccessRate(m.id), 0) / medicines.length).toFixed(1);
  }, [medicines]);

  const stats = [
    { label: 'Active Batches', value: medicines.length, icon: Activity, color: 'bg-primary text-primary-foreground' },
    { label: 'Success Rate', value: `${avgSuccess}%`, icon: CheckCircle, color: 'bg-primary text-primary-foreground' },
    { label: 'Waste Reduced', value: `${sustainability.wasteReduction}%`, icon: Leaf, color: 'bg-primary text-primary-foreground' },
    { label: 'Active Alerts', value: activeAlerts.length, icon: AlertTriangle, color: 'bg-warning text-warning-foreground' },
  ];

  return (
    <AppLayout>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground text-sm">Welcome back, {session?.companyName}</p>
          </div>
          <p className="text-xs text-primary">Last updated: {new Date().toLocaleTimeString()}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {stats.map(s => (
            <div key={s.label} className="bg-card border border-border rounded-2xl p-5">
              <div className={`stat-icon ${s.color} mb-3`}>
                <s.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Medicines + Alerts */}
        <div className="grid grid-cols-5 gap-6 mb-8">
          {/* Medicines list */}
          <div className="col-span-3 bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Medicines</h3>
              <button onClick={() => navigate('/medicines')} className="text-primary text-sm hover:underline">View All →</button>
            </div>
            <div className="space-y-3">
              {medicines.map(m => {
                const success = getSuccessRate(m.id);
                return (
                  <div key={m.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center">
                        <Activity className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">{m.name}</p>
                        <p className="text-xs text-primary capitalize">{m.status}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground text-sm">{success}%</p>
                      <p className="text-xs text-muted-foreground">Success</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="col-span-2 bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Recent Alerts</h3>
              <button onClick={() => navigate('/alerts')} className="text-primary text-sm hover:underline">View All →</button>
            </div>
            <div className="space-y-3">
              {alerts.slice(0, 3).map(a => (
                <div key={a.id} className={`p-3 rounded-xl ${a.severity === 'Medium' ? 'bg-warning-light' : 'bg-muted'}`}>
                  <div className="flex items-start gap-2">
                    <AlertTriangle className={`w-4 h-4 mt-0.5 ${a.severity === 'Medium' ? 'text-warning' : 'text-muted-foreground'}`} />
                    <div>
                      <p className="font-medium text-foreground text-sm">{a.title}</p>
                      <p className="text-xs text-muted-foreground">{a.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sustainability */}
        <div className="green-gradient-bg rounded-2xl p-6 text-primary-foreground">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5" />
            <h3 className="font-semibold">Sustainability Impact</h3>
          </div>
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center">
              <p className="text-3xl font-bold">{sustainability.wasteReduction}%</p>
              <p className="text-sm text-primary-foreground/70">Waste Reduction</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{sustainability.energySaved}%</p>
              <p className="text-sm text-primary-foreground/70">Energy Saved</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">{sustainability.efficiencyGain}%</p>
              <p className="text-sm text-primary-foreground/70">Efficiency Gain</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
