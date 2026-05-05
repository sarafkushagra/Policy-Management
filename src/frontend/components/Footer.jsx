import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="siteFooter">
      <div>
        <Link className="footerBrand" to="/">TrustBridge</Link>
        <p>Digital insurance infrastructure for policyholders, underwriters, and claims teams.</p>
      </div>
      <div className="footerLinks">
        <Link to="/products">Products</Link>
        <Link to="/about">About</Link>
        <Link to="/testimonials">Testimonials</Link>
        <Link to="/contact">Contact</Link>
      </div>
      <div className="footerContact">
        <span><Phone size={16} /> +91 98765 43210</span>
        <span><Mail size={16} /> care@trustbridge.insure</span>
        <span><MapPin size={16} /> Bengaluru, India</span>
      </div>
    </footer>
  );
}
