import { FileCheck2, UploadCloud } from 'lucide-react';
import { useState } from 'react';
import { ClaimTimeline } from '../../components/ClaimCards.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import { Field, FormGrid, PanelHeading } from '../../components/Form.jsx';
import PageTitle from '../../components/PageTitle.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { usePolicyData } from '../../context/PolicyContext.jsx';
import { api } from '../../utils/api.js';

export default function ClaimsPage() {
  const { user } = useAuth();
  const { data, refresh } = usePolicyData();
  const params = new URLSearchParams(window.location.search);
  const policies = data.policies.filter(policy => policy.userId === user.id);
  const claims = data.claims.filter(claim => policies.some(policy => policy.id === claim.policyId));
  const [form, setForm] = useState({
    policyId: params.get('policy') || policies[0]?.id || '',
    incidentDate: new Date().toISOString().slice(0, 10),
    amount: 25000,
    description: 'Hospital bill and discharge summary for emergency treatment.',
    evidenceFileName: 'claim-proof.pdf'
  });
  const update = event => setForm(current => ({ ...current, [event.target.name]: event.target.value }));
  const submit = async event => {
    event.preventDefault();
    await api('/api/claims', { method: 'POST', body: JSON.stringify(form) });
    await refresh();
  };
  return (
    <section className="page">
      <PageTitle icon={<FileCheck2 />} title="My claims" copy="Submit proof, track claim state, and see verification history." />
      <div className="purchaseLayout">
        <form className="panel" onSubmit={submit}>
          <PanelHeading icon={<UploadCloud />} title="Initiate claim" />
          {policies.length === 0 ? <EmptyState text="You need an active policy before filing a claim." /> : (
            <>
              <FormGrid>
                <Field label="Policy"><select name="policyId" value={form.policyId} onChange={update}>{policies.map(policy => <option key={policy.id} value={policy.id}>{policy.policyNumber}</option>)}</select></Field>
                <Field label="Incident date"><input name="incidentDate" type="date" value={form.incidentDate} onChange={update} required /></Field>
                <Field label="Claim amount"><input name="amount" type="number" min="1000" value={form.amount} onChange={update} required /></Field>
                <Field label="Evidence file"><input name="evidenceFileName" value={form.evidenceFileName} onChange={update} required /></Field>
              </FormGrid>
              <Field label="Incident description"><textarea name="description" rows="5" value={form.description} onChange={update} required /></Field>
              <button className="primaryBtn">Submit claim</button>
            </>
          )}
        </form>
        {claims.length === 0 ? <EmptyState text="No claims submitted yet." /> : <ClaimTimeline claims={claims} />}
      </div>
    </section>
  );
}
