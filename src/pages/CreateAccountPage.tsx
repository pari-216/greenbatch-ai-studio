import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FlaskConical, ArrowLeft, Building2, Plus, X, Rocket } from 'lucide-react';
import { createCompany, setSession } from '@/lib/store';

const industries = ['Pharma', 'Chemicals', 'Biotech', 'Food & Beverage', 'Other'];
const scales = ['Small', 'Medium', 'Large'];

const CreateAccountPage = () => {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('Pharma');
  const [scale, setScale] = useState('Medium');
  const [medicineNames, setMedicineNames] = useState<string[]>(['']);
  const [createdId, setCreatedId] = useState('');
  const [error, setError] = useState('');

  const addMedicine = () => setMedicineNames([...medicineNames, '']);
  const removeMedicine = (i: number) => setMedicineNames(medicineNames.filter((_, idx) => idx !== i));
  const updateMedicine = (i: number, v: string) => {
    const copy = [...medicineNames];
    copy[i] = v;
    setMedicineNames(copy);
  };

  const handleCreate = () => {
    if (!companyName.trim()) { setError('Company name is required'); return; }
    const validMeds = medicineNames.filter(m => m.trim());
    if (validMeds.length === 0) { setError('Add at least one medicine'); return; }

    const company = createCompany(companyName.trim(), industry, scale, validMeds);
    setCreatedId(company.id);
  };

  const enterWorkspace = () => {
    setSession({ companyId: createdId, companyName: companyName.trim(), role: 'Manager' });
    navigate('/dashboard');
  };

  if (createdId) {
    return (
      <div className="min-h-screen green-gradient-bg flex flex-col items-center justify-center p-4">
        <div className="glass-card rounded-2xl p-8 w-full max-w-md animate-fade-in text-center">
          <div className="w-16 h-16 rounded-xl bg-primary-foreground/10 border border-primary-foreground/20 flex items-center justify-center mx-auto mb-4">
            <Rocket className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-primary-foreground mb-2">Workspace Created!</h2>
          <p className="text-primary-foreground/60 text-sm mb-6">Your secure access ID has been generated</p>
          <div className="rounded-xl bg-primary-foreground/10 border border-primary-foreground/15 p-4 mb-6">
            <p className="text-primary-foreground/60 text-xs mb-1">Your Company ID</p>
            <p className="text-3xl font-bold font-mono text-primary-foreground">{createdId}</p>
          </div>
          <p className="text-primary-foreground/50 text-xs mb-6">Save this ID — you'll need it to log in next time.</p>
          <button onClick={enterWorkspace} className="w-full py-3.5 rounded-xl bg-primary-foreground text-primary font-semibold hover:bg-primary-foreground/90 transition-all">
            Enter Your Workspace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen green-gradient-bg flex flex-col items-center justify-center p-4">
      <button onClick={() => navigate('/')} className="absolute top-6 left-6 flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </button>

      <div className="glass-card rounded-2xl p-8 w-full max-w-lg animate-fade-in">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-xl bg-primary-foreground/10 border border-primary-foreground/20 flex items-center justify-center mb-4">
            <Building2 className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-primary-foreground">Create Workspace</h2>
          <p className="text-primary-foreground/60 text-sm mt-1">Set up your company profile</p>
        </div>

        <hr className="border-primary-foreground/10 mb-6" />

        {/* Company Name */}
        <div className="mb-4">
          <label className="text-primary-foreground/80 text-sm font-semibold mb-2 block">Company Name</label>
          <input value={companyName} onChange={e => { setCompanyName(e.target.value); setError(''); }}
            placeholder="Enter company name"
            className="w-full px-4 py-3 rounded-xl bg-primary-foreground/10 border border-primary-foreground/15 text-primary-foreground placeholder:text-primary-foreground/30 focus:outline-none focus:border-primary-foreground/40" />
        </div>

        {/* Industry */}
        <div className="mb-4">
          <label className="text-primary-foreground/80 text-sm font-semibold mb-2 block">Industry Type</label>
          <div className="flex flex-wrap gap-2">
            {industries.map(ind => (
              <button key={ind} onClick={() => setIndustry(ind)}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${industry === ind ? 'bg-primary-foreground text-primary font-medium' : 'bg-primary-foreground/10 text-primary-foreground/70 border border-primary-foreground/15'}`}>
                {ind}
              </button>
            ))}
          </div>
        </div>

        {/* Scale */}
        <div className="mb-4">
          <label className="text-primary-foreground/80 text-sm font-semibold mb-2 block">Production Scale</label>
          <div className="grid grid-cols-3 gap-2">
            {scales.map(s => (
              <button key={s} onClick={() => setScale(s)}
                className={`py-2.5 rounded-xl text-sm font-medium transition-all ${scale === s ? 'bg-primary-foreground text-primary' : 'bg-primary-foreground/10 text-primary-foreground/70 border border-primary-foreground/15'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Medicines */}
        <div className="mb-6">
          <label className="text-primary-foreground/80 text-sm font-semibold mb-2 block">Medicine Names</label>
          <div className="space-y-2">
            {medicineNames.map((name, i) => (
              <div key={i} className="flex gap-2">
                <input value={name} onChange={e => updateMedicine(i, e.target.value)}
                  placeholder={`Medicine ${i + 1}`}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-primary-foreground/10 border border-primary-foreground/15 text-primary-foreground placeholder:text-primary-foreground/30 focus:outline-none text-sm" />
                {medicineNames.length > 1 && (
                  <button onClick={() => removeMedicine(i)} className="text-primary-foreground/40 hover:text-primary-foreground/70">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button onClick={addMedicine} className="mt-2 flex items-center gap-1 text-primary-foreground/60 hover:text-primary-foreground text-sm">
            <Plus className="w-4 h-4" /> Add another
          </button>
        </div>

        {error && <p className="text-red-300 text-sm mb-4 text-center">{error}</p>}

        <button onClick={handleCreate} className="w-full py-3.5 rounded-xl bg-primary-foreground text-primary font-semibold hover:bg-primary-foreground/90 transition-all">
          Generate Access ID
        </button>
      </div>
    </div>
  );
};

export default CreateAccountPage;
