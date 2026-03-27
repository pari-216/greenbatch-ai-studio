import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Activity, TrendingUp, AlertTriangle, ChevronRight } from 'lucide-react';
import { getSession, findCompany, getSuccessRate, getQualityScore, getRiskLevel, addMedicineToCompany } from '@/lib/store';
import AppLayout from '@/components/AppLayout';

const MedicinesPage = () => {
  const navigate = useNavigate();
  const session = getSession();
  const [refresh, setRefresh] = useState(0);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');

  const company = session ? findCompany(session.companyId) : null;
  const medicines = company?.medicines ?? [];

  const handleAdd = () => {
    if (!newName.trim() || !session) return;
    addMedicineToCompany(session.companyId, newName.trim());
    setNewName('');
    setShowAdd(false);
    setRefresh(r => r + 1);
  };

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Medicines</h1>
            <p className="text-muted-foreground text-sm">Manage and monitor your pharmaceutical products</p>
          </div>
          {session?.role === 'Manager' && (
            <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
              <Plus className="w-4 h-4" />
              Add Medicine
            </button>
          )}
        </div>

        {/* Add medicine dialog */}
        {showAdd && (
          <div className="bg-card border border-border rounded-2xl p-5 mb-6 flex items-end gap-4">
            <div className="flex-1">
              <label className="text-sm font-semibold text-foreground mb-2 block">Medicine Name</label>
              <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Enter medicine name"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <button onClick={handleAdd} className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold">Add</button>
            <button onClick={() => setShowAdd(false)} className="px-5 py-2.5 rounded-xl border border-border text-muted-foreground text-sm">Cancel</button>
          </div>
        )}

        {/* Medicine cards */}
        <div className="grid grid-cols-3 gap-5 mb-6">
          {medicines.map(m => {
            const success = getSuccessRate(m.id);
            const quality = getQualityScore(m.id);
            const risk = getRiskLevel(success);
            return (
              <div key={m.id} className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                    <Activity className="w-6 h-6 text-primary" />
                  </div>
                  <span className="status-badge bg-accent text-primary text-xs">{m.status}</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">{m.name}</h3>
                <div className="flex gap-6 mb-4">
                  <div>
                    <div className="flex items-center gap-1 text-muted-foreground text-xs mb-0.5">
                      <TrendingUp className="w-3 h-3" /> Success
                    </div>
                    <p className="font-bold text-foreground">{success}%</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-muted-foreground text-xs mb-0.5">
                      <AlertTriangle className="w-3 h-3" /> Risk
                    </div>
                    <p className={`font-bold ${risk === 'Low' ? 'text-primary' : risk === 'Medium' ? 'text-warning' : 'text-destructive'}`}>{risk}</p>
                  </div>
                </div>
                {/* Quality bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Quality Score</span>
                    <span>{quality}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${quality}%` }} />
                  </div>
                </div>
                <button onClick={() => navigate(`/medicines/${m.id}`)} className="flex items-center gap-1 text-primary text-sm font-medium hover:underline">
                  View Dashboard <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Add another card */}
        {session?.role === 'Manager' && (
          <button onClick={() => setShowAdd(true)} className="w-full border-2 border-dashed border-primary/30 rounded-2xl py-8 text-primary hover:bg-accent transition-colors flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" />
            Add Another Medicine
          </button>
        )}
      </div>
    </AppLayout>
  );
};

export default MedicinesPage;
