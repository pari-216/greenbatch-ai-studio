import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Thermometer, Gauge, Droplets, Clock, CheckCircle, Brain, Zap, AlertTriangle, Leaf, Activity } from 'lucide-react';
import { getSession, findCompany, getSuccessRate, getQualityScore, getRiskLevel, getRealtimeData, getOptimizationSuggestions, getSustainabilityMetrics, getAlerts } from '@/lib/store';
import AppLayout from '@/components/AppLayout';

const MedicineDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const session = getSession();
  const company = session ? findCompany(session.companyId) : null;
  const medicine = company?.medicines.find(m => m.id === id);

  const successRate = useMemo(() => getSuccessRate(id ?? ''), [id]);
  const qualityScore = useMemo(() => getQualityScore(id ?? ''), [id]);
  const riskLevel = getRiskLevel(successRate);
  const realtime = useMemo(() => getRealtimeData(), []);
  const suggestions = useMemo(() => getOptimizationSuggestions(), []);
  const sustainability = useMemo(() => getSustainabilityMetrics(), []);
  const alerts = getAlerts().filter(a => a.medicine === medicine?.name);

  if (!medicine) {
    return <AppLayout><p className="text-muted-foreground">Medicine not found.</p></AppLayout>;
  }

  const getIndicatorColor = (type: string) => {
    if (type === 'temp' && realtime.temperature > 30) return 'bg-warning';
    if (type === 'pressure' && realtime.pressure > 1.5) return 'bg-warning';
    return 'bg-primary';
  };

  return (
    <AppLayout>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/medicines')} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">{medicine.name}</h1>
              <span className="status-badge bg-accent text-primary text-xs">{medicine.status}</span>
            </div>
          </div>
          <button className="text-muted-foreground hover:text-foreground" onClick={() => window.location.reload()}>
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-5">
          {/* Left column - 2/3 */}
          <div className="col-span-2 space-y-5">
            {/* Ideal Conditions */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Ideal Conditions (Baseline)</h3>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { icon: Thermometer, label: 'Temperature', value: medicine.idealConditions.tempRange, color: 'text-info' },
                  { icon: Gauge, label: 'Pressure', value: medicine.idealConditions.pressureRange, color: 'text-info' },
                  { icon: Droplets, label: 'Moisture', value: medicine.idealConditions.moisture, color: 'text-info' },
                  { icon: Clock, label: 'Process Time', value: medicine.idealConditions.processTime, color: 'text-warning' },
                ].map(item => (
                  <div key={item.label} className="text-center">
                    <item.icon className={`w-5 h-5 mx-auto mb-2 ${item.color}`} />
                    <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                    <p className="font-semibold text-foreground text-sm">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Real-time Monitoring */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Real-time Monitoring</h3>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { icon: Thermometer, label: 'Temperature', value: `${realtime.temperature}°C`, indicator: getIndicatorColor('temp') },
                  { icon: Gauge, label: 'Pressure', value: `${realtime.pressure.toFixed(2)} bar`, indicator: getIndicatorColor('pressure') },
                  { icon: Droplets, label: 'Moisture', value: `${realtime.moisture}%`, indicator: 'bg-primary' },
                  { icon: Clock, label: 'Elapsed', value: `${realtime.elapsed} min`, indicator: 'bg-warning' },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className={`w-1 h-14 rounded-full ${item.indicator}`} />
                    <div>
                      <item.icon className="w-4 h-4 text-muted-foreground mb-1" />
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="font-bold text-primary text-lg">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Optimization Engine */}
            <div className="bg-gradient-to-r from-warning to-report-orange rounded-2xl p-5 text-warning-foreground">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5" />
                <h3 className="font-semibold">Optimization Engine</h3>
              </div>
              <div className="space-y-2">
                {suggestions.map((s, i) => (
                  <div key={i} className="flex items-center gap-3 bg-warning-foreground/10 rounded-xl px-4 py-3">
                    <Zap className="w-4 h-4 flex-shrink-0" />
                    <p className="text-sm font-medium">{s}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column - 1/3 */}
          <div className="space-y-5">
            {/* AI Prediction */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">AI Prediction</h3>
              </div>
              <div className="text-center mb-4">
                <p className="text-xs text-muted-foreground mb-1">Batch Success Probability</p>
                <p className="text-4xl font-bold text-primary">{successRate}%</p>
                <div className="h-2.5 bg-muted rounded-full overflow-hidden mt-3">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${successRate}%` }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Quality Score</p>
                  <p className="text-xl font-bold text-foreground">{qualityScore}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Risk Level</p>
                  <p className={`text-xl font-bold ${riskLevel === 'Low' ? 'text-primary' : riskLevel === 'Medium' ? 'text-warning' : 'text-destructive'}`}>{riskLevel}</p>
                </div>
              </div>
            </div>

            {/* Active Alerts */}
            <div className="bg-warning-light border border-warning/20 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-warning" />
                <h3 className="font-semibold text-foreground">Active Alerts</h3>
              </div>
              {alerts.length > 0 ? alerts.map(a => (
                <div key={a.id} className="mb-2">
                  <p className="font-medium text-foreground text-sm">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{a.description}</p>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground">No active alerts</p>
              )}
            </div>

            {/* Sustainability */}
            <div className="green-gradient-bg rounded-2xl p-5 text-primary-foreground">
              <div className="flex items-center gap-2 mb-3">
                <Leaf className="w-5 h-5" />
                <h3 className="font-semibold">Sustainability</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-sm text-primary-foreground/70">Waste Reduction</span><span className="font-bold">{sustainability.wasteReduction}%</span></div>
                <div className="flex justify-between"><span className="text-sm text-primary-foreground/70">Energy Saved</span><span className="font-bold">{sustainability.energySaved}%</span></div>
                <div className="flex justify-between"><span className="text-sm text-primary-foreground/70">Efficiency Gain</span><span className="font-bold">{sustainability.efficiencyGain}%</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default MedicineDetailPage;
