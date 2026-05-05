import { Link, NavLink, Outlet } from 'react-router-dom';
import Footer from '../components/Footer.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function MarketingLayout() {
  const { user } = useAuth();
  return (
    <div className="marketingShell">
      <header className="siteHeader">
        <Link to="/" className="siteBrand"><span>TB</span>TrustBridge</Link>
        <nav className="siteNav">
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/testimonials">Testimonials</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>
        <Link className="primaryBtn compactBtn" to={user ? '/portal' : '/login'}>{user ? 'Open portal' : 'Sign in'}</Link>
      </header>
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
