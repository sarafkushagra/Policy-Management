import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import MarketingLayout from './layouts/MarketingLayout.jsx';
import PortalLayout from './layouts/PortalLayout.jsx';
import AboutPage from './pages/public/AboutPage.jsx';
import ContactPage from './pages/public/ContactPage.jsx';
import HomePage from './pages/public/HomePage.jsx';
import LoginPage from './pages/public/LoginPage.jsx';
import ProductsPage from './pages/public/ProductsPage.jsx';
import TestimonialsPage from './pages/public/TestimonialsPage.jsx';
import AdminDashboard from './pages/portal/AdminDashboard.jsx';
import ClaimsDeskDashboard from './pages/portal/ClaimsDeskDashboard.jsx';
import ClaimsPage from './pages/portal/ClaimsPage.jsx';
import PolicyholderDashboard from './pages/portal/PolicyholderDashboard.jsx';
import ProductManagementPage from './pages/portal/ProductManagementPage.jsx';
import PurchasePage from './pages/portal/PurchasePage.jsx';

function RequireRole({ roles, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to={homeFor(user.role)} replace />;
  return children;
}

function homeFor(role) {
  if (role === 'Underwriter') return '/portal/admin/dashboard';
  if (role === 'Claims Adjuster') return '/portal/claims/dashboard';
  return '/portal/policyholder/dashboard';
}

export default function App() {
  return (
    <Routes>
      <Route element={<MarketingLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/testimonials" element={<TestimonialsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route path="/portal" element={<PortalLayout />}>
        <Route index element={<PortalRedirect />} />
        <Route path="policyholder/dashboard" element={<RequireRole roles={['Policyholder']}><PolicyholderDashboard /></RequireRole>} />
        <Route path="policyholder/claims" element={<RequireRole roles={['Policyholder']}><ClaimsPage /></RequireRole>} />
        <Route path="policyholder/purchase" element={<RequireRole roles={['Policyholder']}><PurchasePage /></RequireRole>} />
        <Route path="admin/dashboard" element={<RequireRole roles={['Underwriter']}><AdminDashboard /></RequireRole>} />
        <Route path="admin/products" element={<RequireRole roles={['Underwriter']}><ProductManagementPage /></RequireRole>} />
        <Route path="admin/claims" element={<RequireRole roles={['Underwriter']}><ClaimsDeskDashboard /></RequireRole>} />
        <Route path="claims/dashboard" element={<RequireRole roles={['Claims Adjuster']}><ClaimsDeskDashboard /></RequireRole>} />
      </Route>
    </Routes>
  );
}

function PortalRedirect() {
  const { user } = useAuth();
  return <Navigate to={user ? homeFor(user.role) : '/login'} replace />;
}
