import { FileText } from 'lucide-react';
import Stat from './Stat.jsx';
import { usePolicyData } from '../context/PolicyContext.jsx';
import { money } from '../utils/api.js';

export default function PolicyCard({ policy, onClaim }) {
  const { data } = usePolicyData();
  const product = data.products.find(item => item.id === policy.productId);
  const user = data.users.find(item => item.id === policy.userId);
  return (
    <article className="policyCard">
      <div className="itemHeader">
        <div>
          <span className="subtle">{product?.type} policy</span>
          <h2>{policy.policyNumber}</h2>
          <p>{product?.name} issued to {user?.name}</p>
        </div>
        <span className="status issued">{policy.status}</span>
      </div>
      <div className="statGrid">
        <Stat label="Coverage" value={money(policy.coverage)} />
        <Stat label="Annual premium" value={money(policy.annualPremium)} />
        <Stat label="Renewal date" value={policy.expiryDate} />
        <Stat label="KYC" value={policy.kyc.type} />
      </div>
      <div className="actions">
        <a className="secondaryBtn" href={`/certificate/${policy.id}`} target="_blank" rel="noreferrer">
          <FileText size={17} /> Certificate
        </a>
        {onClaim && <button className="primaryBtn compactBtn" onClick={onClaim}>File claim</button>}
      </div>
    </article>
  );
}
