import { ClipboardCheck } from 'lucide-react';
import PageTitle from '../../components/PageTitle.jsx';
import PolicyCard from '../../components/PolicyCard.jsx';
import Stat from '../../components/Stat.jsx';
import { usePolicyData } from '../../context/PolicyContext.jsx';
import { money } from '../../utils/api.js';

export default function AdminDashboard() {
  const { data } = usePolicyData();
  const premium = data.policies.reduce((sum, policy) => sum + policy.annualPremium, 0);
  return (
    <section className="page">
      <PageTitle icon={<ClipboardCheck />} title="Admin dashboard" copy="Monitor issued policies, product inventory, premium book, and open claim exposure." />
      <div className="summaryGrid">
        <Stat label="Issued policies" value={data.policies.length} />
        <Stat label="Products" value={data.products.length} />
        <Stat label="Annual premium book" value={money(premium)} />
        <Stat label="Claims" value={data.claims.length} />
      </div>
      <div className="policyList">
        {data.policies.map(policy => <PolicyCard key={policy.id} policy={policy} />)}
      </div>
    </section>
  );
}
