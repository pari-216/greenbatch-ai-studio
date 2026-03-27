import { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FlaskConical, LayoutDashboard, Pill, AlertTriangle, FileText, LogOut } from 'lucide-react';
import { getSession, clearSession, getAlerts } from '@/lib/store';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Medicines', icon: Pill, path: '/medicines' },
  { label: 'Alerts', icon: AlertTriangle, path: '/alerts' },
  { label: 'Reports', icon: FileText, path: '/reports' },
];

const AppLayout = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const session = getSession();
  const alertCount = getAlerts().filter(a => !a.acknowledged).length;

  useEffect(() => {
    if (!session) navigate('/');
  }, [session, navigate]);

  if (!session) return null;

  const handleLogout = () => {
    clearSession();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-60 border-r border-border flex flex-col bg-card">
        {/* Logo */}
        <div className="p-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <FlaskConical className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <p className="font-bold text-foreground text-sm">GreenBatch</p>
            <p className="text-xs text-primary">AI Platform</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2">
          {navItems.map(item => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-1 text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'text-primary bg-accent'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
                {item.label === 'Alerts' && alertCount > 0 && (
                  <span className="ml-auto w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                    {alertCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <p className="font-semibold text-foreground text-sm">{session.companyName}</p>
          <p className="text-xs text-muted-foreground">{session.role} Access</p>
          <button onClick={handleLogout} className="flex items-center gap-2 mt-3 text-primary text-sm hover:underline">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-14 border-b border-border flex items-center justify-end px-6 bg-card">
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">{session.companyName}</p>
              <p className="text-xs text-muted-foreground">ID: {session.companyId}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
              {session.companyName[0]}
            </div>
          </div>
        </header>
        <div className="flex-1 p-6 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
