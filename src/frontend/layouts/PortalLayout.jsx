import { Bell, Calculator, ClipboardCheck, FileCheck2, LayoutDashboard, LifeBuoy, LogOut, ShieldCheck } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { usePolicyData } from '../context/PolicyContext.jsx';


export default function PortalLayout() {
  const { user, logout } = useAuth();
  const { data, loading, error } = usePolicyData();
  const nav = navFor(user?.role);
  const openClaims = data.claims.filter(claim => !['Rejected', 'Disbursed'].includes(claim.status)).length;

  return (
    <div className="app">
      <aside className="sidebar">
        <NavLink to="/" className="brand">
          <span className="brandMark">TB</span>
          <span><strong>TrustBridge</strong><small>{user?.role || 'Portal'}</small></span>
        </NavLink>
        <nav className="nav">
          {nav.map(item => <NavItem key={item.to} {...item} />)}
        </nav>
        <div className="supportPanel">
          <LifeBuoy size={20} />
          <div><strong>Need help?</strong><span>Claim desk online</span></div>
        </div>
      </aside>
      <main className="main">
        <header className="topbar">
          <div>
            <p className="eyebrow">Authenticated workspace</p>
            <h1>{headingFor(user?.role)}</h1>
          </div>
          <div className="topMetrics">
            <div className="metricPill"><ShieldCheck size={18} /><span>Signed in</span><strong>{user?.name}</strong></div>
            <div className="metricPill"><Bell size={18} /><span>Open claims</span><strong>{openClaims}</strong></div>
            <button className="secondaryBtn" onClick={logout}><LogOut size={17} /> Logout</button>
          </div>
        </header>
        {error && <div className="alert">{error}</div>}
        {loading ? <div className="loading">Loading policy workspace...</div> : <Outlet />}
      </main>
    </div>
  );
}

function NavItem({ to, icon, label }) {
  return (
    <NavLink to={to} className={({ isActive }) => `navItem ${isActive ? 'active' : ''}`}>
      {icon}<span>{label}</span>
    </NavLink>
  );
}

function navFor(role) {
  if (role === 'Underwriter') {
    return [
      { to: '/portal/admin/dashboard', icon: <LayoutDashboard size={18} />, label: 'Admin Dashboard' },
      { to: '/portal/admin/products', icon: <ClipboardCheck size={18} />, label: 'Products' },
      { to: '/portal/admin/claims', icon: <FileCheck2 size={18} />, label: 'Claims Review' }
    ];
  }
  if (role === 'Claims Adjuster') {
    return [{ to: '/portal/claims/dashboard', icon: <FileCheck2 size={18} />, label: 'Claims Desk' }];
  }
  return [
    { to: '/portal/policyholder/dashboard', icon: <LayoutDashboard size={18} />, label: 'My Policies' },
    { to: '/portal/policyholder/purchase', icon: <Calculator size={18} />, label: 'Buy Policy' },
    { to: '/portal/policyholder/claims', icon: <FileCheck2 size={18} />, label: 'My Claims' }
  ];
}

function headingFor(role) {
  if (role === 'Underwriter') return 'Underwriter portal for approvals, products, and risk controls.';
  if (role === 'Claims Adjuster') return 'Claims desk for evidence review and settlement actions.';
  return 'Policyholder dashboard for cover, renewals, certificates, and claims.';
}
