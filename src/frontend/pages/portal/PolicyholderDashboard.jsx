import { Bell, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../../components/EmptyState.jsx';
import PageTitle from '../../components/PageTitle.jsx';
import PolicyCard from '../../components/PolicyCard.jsx';
import Stat from '../../components/Stat.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { usePolicyData } from '../../context/PolicyContext.jsx';
import { api, money } from '../../utils/api.js';

export default function PolicyholderDashboard() {
  const { user } = useAuth();
  const { data, refresh } = usePolicyData();
  const navigate = useNavigate();
  const policies = data.policies.filter(policy => policy.userId === user.id);
  const claims = data.claims.filter(claim => policies.some(policy => policy.id === claim.policyId));
  const runRenewalSweep = async () => {
    await api('/api/renewals/sweep', { method: 'POST', body: '{}' });
    refresh();
  };
  return (
    <section className="page">
      <PageTitle icon={<LayoutDashboard />} title="My policyholder dashboard" copy="Your active cover, certificates, renewal reminders, and claims are organised here." action={<button className="secondaryBtn" onClick={runRenewalSweep}><Bell size={17} /> Renewal check</button>} />
      <div className="summaryGrid">
        <Stat label="Active policies" value={policies.length} />
        <Stat label="Total coverage" value={money(policies.reduce((sum, policy) => sum + policy.coverage, 0))} />
        <Stat label="Claims filed" value={claims.length} />
      </div>
      <div className="policyList">
        {policies.length === 0 ? <EmptyState text="No policies issued yet. Buy a policy to see it here." /> : policies.map(policy => (
          <PolicyCard key={policy.id} policy={policy} onClaim={() => navigate(`/portal/policyholder/claims?policy=${policy.id}`)} />
        ))}
      </div>
    </section>
  );
}
