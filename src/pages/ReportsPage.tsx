import { useState, useMemo } from 'react';
import { Download, Calendar, Activity, Brain, Leaf, Zap } from 'lucide-react';
import { getSession, findCompany, getSustainabilityMetrics, randomVariation } from '@/lib/store';
import AppLayout from '@/components/AppLayout';

const periods = ['24h', '7days', '30days', '90days'] as const;

const ReportsPage = () => {
  const [period, setPeriod] = useState<typeof periods[number]>('7days');
  const session = getSession();
  const company = session ? findCompany(session.companyId) : null;
  const sustainability = useMemo(() => getSustainabilityMetrics(), [period]);

  const periodLabel: Record<string, string> = {
    '24h': 'the last 24 hours',
    '7days': 'the last 7 days',
    '30days': 'the last 30 days',
    '90days': 'the last 90 days',
  };

  const reports = [
    {
      title: 'Batch Performance Report', subtitle: 'Average Success Rate', color: 'bg-report-blue',
      icon: Activity, value: `${randomVariation(83, 3).toFixed(1)}%`,
      rows: [
        ['Active Batches', `${company?.medicines.length ?? 3}`],
        ['Quality Score', `${Math.round(randomVariation(85, 5))}`],
        ['Risk Assessment', 'Optimal'],
      ],
    },
    {
      title: 'Prediction Accuracy', subtitle: 'AI Model Accuracy', color: 'bg-report-purple',
      icon: Brain, value: `${randomVariation(94, 2).toFixed(1)}%`,
      rows: [
        ['Correct Predictions', `${Math.round(randomVariation(2, 1))}`],
        ['Variance', `±${randomVariation(2, 0.5).toFixed(1)}%`],
        ['Model Version', 'v2.4.1'],
      ],
    },
    {
      title: 'Waste Reduction', subtitle: 'Total Waste Reduced', color: 'bg-report-green',
      icon: Leaf, value: `${sustainability.wasteReduction}%`,
      rows: [
        ['Materials Saved', `${randomVariation(8, 2).toFixed(1)} kg`],
        ['Cost Reduction', `$${Math.round(randomVariation(12000, 3000)).toLocaleString()}`],
        ['Trend', 'Improving'],
      ],
    },
    {
      title: 'Optimization Impact', subtitle: 'Efficiency Gain', color: 'bg-report-orange',
      icon: Zap, value: `${sustainability.efficiencyGain}%`,
      rows: [
        ['Energy Saved', `${sustainability.energySaved}%`],
        ['Time Reduced', `${Math.round(randomVariation(10, 3))} min`],
        ['Suggestions Applied', `${Math.round(randomVariation(5, 2))}`],
      ],
    },
  ];

  const handleDownload = (title: string) => {
    const report = reports.find(r => r.title === title);
    if (!report) return;
    const text = `${report.title}\n${report.subtitle}\n\nValue: ${report.value}\n${report.rows.map(r => `${r[0]}: ${r[1]}`).join('\n')}\n\nPeriod: ${periodLabel[period]}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Reports</h1>
            <p className="text-muted-foreground text-sm">Generate and download performance reports</p>
          </div>
          <div className="flex bg-muted rounded-xl p-1">
            {periods.map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${period === p ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Period indicator */}
        <div className="flex items-center gap-2 bg-accent rounded-xl px-4 py-3 mb-6">
          <Calendar className="w-4 h-4 text-primary" />
          <p className="text-sm text-primary">Showing data for {periodLabel[period]}</p>
        </div>

        {/* Report cards */}
        <div className="grid grid-cols-2 gap-5">
          {reports.map(r => (
            <div key={r.title} className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className={`${r.color} p-4 flex items-center gap-3`}>
                <r.icon className="w-5 h-5 text-primary-foreground" />
                <div>
                  <p className="font-semibold text-primary-foreground text-sm">{r.title}</p>
                  <p className="text-primary-foreground/70 text-xs">{r.subtitle}</p>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-3xl font-bold text-foreground">{r.value}</p>
                  <button onClick={() => handleDownload(r.title)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground border border-border px-3 py-1.5 rounded-lg">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
                <div className="space-y-2">
                  {r.rows.map(([label, val]) => (
                    <div key={label} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="text-foreground font-medium">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default ReportsPage;
