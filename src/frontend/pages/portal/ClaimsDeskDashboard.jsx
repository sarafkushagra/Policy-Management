import { FileCheck2 } from 'lucide-react';
import { AdminClaimCard } from '../../components/ClaimCards.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import PageTitle from '../../components/PageTitle.jsx';
import Stat from '../../components/Stat.jsx';
import { usePolicyData } from '../../context/PolicyContext.jsx';
import { api, money } from '../../utils/api.js';

export default function ClaimsDeskDashboard() {
  const { data, refresh } = usePolicyData();
  const open = data.claims.filter(claim => !['Rejected', 'Disbursed'].includes(claim.status));
  const exposure = open.reduce((sum, claim) => sum + claim.amount, 0);
  const advance = async (claim, status) => {
    await api(`/api/claims/${claim.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes: `Moved to ${status} after evidence review.` })
    });
    refresh();
  };
  return (
    <section className="page">
      <PageTitle icon={<FileCheck2 />} title="Claims desk" copy="Verify uploaded evidence, update claim state, and trigger settlement references for valid claims." />
      <div className="summaryGrid">
        <Stat label="Open claims" value={open.length} />
        <Stat label="Claim exposure" value={money(exposure)} />
        <Stat label="Disbursed" value={data.claims.filter(claim => claim.status === 'Disbursed').length} />
      </div>
      <div className="panel">
        {data.claims.length === 0 ? <EmptyState text="No claims waiting for review." /> : data.claims.map(claim => (
          <AdminClaimCard key={claim.id} claim={claim} onAdvance={advance} />
        ))}
      </div>
    </section>
  );
}
