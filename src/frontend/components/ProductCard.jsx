import { BadgeCheck, CreditCard, HeartPulse, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { money } from '../utils/api.js';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const buyPath = user?.role === 'Policyholder' ? `/portal/policyholder/purchase?product=${product.id}` : '/login';
  return (
    <article className="productCard">
      <div className="productTop">
        <span className={`typeBadge ${product.type.toLowerCase()}`}>{product.type}</span>
        {product.type === 'Health' ? <HeartPulse /> : product.type === 'Life' ? <ShieldCheck /> : <CreditCard />}
      </div>
      <h2>{product.name}</h2>
      <p>{product.summary}</p>
      <ul>
        {product.benefits.map(benefit => <li key={benefit}><BadgeCheck size={16} />{benefit}</li>)}
      </ul>
      <div className="priceRow">
        <span>Base premium <strong>{money(product.basePremium)}</strong></span>
        <span>Cover up to <strong>{money(product.coverage)}</strong></span>
      </div>
      <button className="primaryBtn" onClick={() => navigate(buyPath)}>Calculate premium</button>
    </article>
  );
}
