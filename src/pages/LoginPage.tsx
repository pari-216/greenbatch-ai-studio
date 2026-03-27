import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FlaskConical, ArrowLeft, Lock, Users } from 'lucide-react';
import { findCompany, setSession } from '@/lib/store';

const demoCredentials = [
  { name: 'PharmaCorp', id: 'PH123' },
  { name: 'MedLife Labs', id: 'ML456' },
  { name: 'BioGen Industries', id: 'BG789' },
];

const roles = ['Manager', 'Operator', 'Production'] as const;

const LoginPage = () => {
  const navigate = useNavigate();
  const [companyId, setCompanyId] = useState('');
  const [selectedRole, setSelectedRole] = useState<typeof roles[number]>('Manager');
  const [error, setError] = useState('');

  const handleLogin = () => {
    const company = findCompany(companyId.trim());
    if (!company) {
      setError('Invalid Company ID. Please check and try again.');
      return;
    }
    setSession({ companyId: company.id, companyName: company.name, role: selectedRole });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen green-gradient-bg flex flex-col items-center justify-center p-4">
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </button>

      <div className="glass-card rounded-2xl p-8 w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-xl bg-primary-foreground/10 border border-primary-foreground/20 flex items-center justify-center mb-4">
            <FlaskConical className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-primary-foreground">Welcome Back</h2>
          <p className="text-primary-foreground/60 text-sm mt-1">Enter your workspace credentials</p>
        </div>

        <hr className="border-primary-foreground/10 mb-6" />

        {/* Demo credentials */}
        <div className="rounded-xl border border-primary-foreground/15 p-4 mb-6">
          <p className="text-primary-foreground/80 text-sm font-semibold mb-2">Demo Credentials:</p>
          {demoCredentials.map(c => (
            <div key={c.id} className="flex justify-between text-primary-foreground/60 text-sm py-0.5">
              <span>{c.name}</span>
              <span className="font-mono">{c.id}</span>
            </div>
          ))}
        </div>

        {/* Company ID */}
        <div className="mb-5">
          <label className="text-primary-foreground/80 text-sm font-semibold mb-2 block">Company ID</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-foreground/40" />
            <input
              type="text"
              value={companyId}
              onChange={e => { setCompanyId(e.target.value); setError(''); }}
              placeholder="Enter your Company ID"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-primary-foreground/10 border border-primary-foreground/15 text-primary-foreground placeholder:text-primary-foreground/30 focus:outline-none focus:border-primary-foreground/40 transition-colors"
            />
          </div>
        </div>

        {/* Role selection */}
        <div className="mb-6">
          <label className="text-primary-foreground/80 text-sm font-semibold mb-2 block">Select Role</label>
          <div className="grid grid-cols-3 gap-2">
            {roles.map(role => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  selectedRole === role
                    ? 'bg-primary-foreground text-primary'
                    : 'bg-primary-foreground/10 text-primary-foreground/70 border border-primary-foreground/15 hover:bg-primary-foreground/20'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-destructive text-sm mb-4 text-center">{error}</p>
        )}

        {/* Enter */}
        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary-foreground text-primary font-semibold hover:bg-primary-foreground/90 transition-all duration-200"
        >
          <Users className="w-5 h-5" />
          Enter Workspace
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
