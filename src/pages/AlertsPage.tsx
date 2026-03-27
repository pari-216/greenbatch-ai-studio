import { useState } from 'react';
import { AlertTriangle, Check, Activity } from 'lucide-react';
import { getAlerts } from '@/lib/store';
import AppLayout from '@/components/AppLayout';

const AlertsPage = () => {
  const [alerts, setAlerts] = useState(getAlerts());
  const activeAlerts = alerts.filter(a => !a.acknowledged);

  const acknowledge = (id: string) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, acknowledged: true } : a));
  };

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Alerts</h1>
            <p className="text-muted-foreground text-sm">Monitor and manage system alerts</p>
          </div>
          {activeAlerts.length > 0 && (
            <span className="px-4 py-2 rounded-full bg-destructive/10 text-destructive font-semibold text-sm">
              {activeAlerts.length} Active Alert{activeAlerts.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {activeAlerts.length > 0 && (
          <div className="mb-6">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Active Alerts</p>
            <div className="space-y-4">
              {activeAlerts.map(a => (
                <div key={a.id} className={`rounded-2xl p-5 border ${a.severity === 'Medium' ? 'bg-warning-light border-warning/20' : 'bg-muted border-border'}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className={`w-5 h-5 mt-0.5 ${a.severity === 'Medium' ? 'text-warning' : 'text-muted-foreground'}`} />
                      <div>
                        <p className="font-semibold text-foreground">{a.title}</p>
                        <p className="text-sm text-muted-foreground mt-0.5">{a.description}</p>
                        <div className="flex items-center gap-1.5 mt-2 text-primary text-xs">
                          <Activity className="w-3 h-3" />
                          {a.medicine}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`status-badge ${a.severity === 'High' ? 'bg-destructive/10 text-destructive' : a.severity === 'Medium' ? 'bg-warning/10 text-warning' : 'bg-muted text-muted-foreground'}`}>
                        {a.severity}
                      </span>
                      <button onClick={() => acknowledge(a.id)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                        <Check className="w-4 h-4" />
                        Acknowledge
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {alerts.filter(a => a.acknowledged).length > 0 && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Acknowledged</p>
            <div className="space-y-3">
              {alerts.filter(a => a.acknowledged).map(a => (
                <div key={a.id} className="rounded-2xl p-4 bg-muted/50 border border-border opacity-60">
                  <div className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-primary" />
                    <p className="text-sm text-foreground">{a.title}</p>
                    <span className="text-xs text-muted-foreground ml-auto">{a.medicine}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {alerts.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium">No alerts</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default AlertsPage;
