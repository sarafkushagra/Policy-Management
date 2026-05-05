import { Calculator, Sparkles, UploadCloud } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Field, FormGrid, PanelHeading } from '../../components/Form.jsx';
import PageTitle from '../../components/PageTitle.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { usePolicyData } from '../../context/PolicyContext.jsx';
import { api, money, quotePayload } from '../../utils/api.js';

export default function PurchasePage() {
  const { data, refresh } = usePolicyData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const [quote, setQuote] = useState(null);
  const [form, setForm] = useState({
    productId: params.get('product') || data.products[0]?.id || '',
    age: 32,
    coverage: 500000,
    riskScore: 1,
    priorClaims: 0,
    tenureYears: 1,
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    kycType: 'Aadhar',
    kycFileName: 'aadhar-demo.pdf',
    paymentMode: 'UPI'
  });
  const update = event => setForm(current => ({ ...current, [event.target.name]: event.target.value }));
  const calculate = async event => {
    event.preventDefault();
    setQuote(await api('/api/premium', { method: 'POST', body: JSON.stringify(quotePayload(form)) }));
  };
  const purchase = async event => {
    event.preventDefault();
    await api('/api/policies', { method: 'POST', body: JSON.stringify({ ...form, ...quotePayload(form) }) });
    await refresh();
    navigate('/portal/policyholder/dashboard');
  };
  return (
    <section className="page">
      <PageTitle icon={<Calculator />} title="Buy a policy" copy="Calculate premium, confirm proposal details, submit KYC, and generate a certificate." />
      <div className="purchaseLayout">
        <form className="panel" onSubmit={calculate}>
          <PanelHeading icon={<Sparkles />} title="Premium calculator" />
          <FormGrid>
            <Field label="Product"><select name="productId" value={form.productId} onChange={update}>{data.products.map(product => <option key={product.id} value={product.id}>{product.name}</option>)}</select></Field>
            <Field label="Age"><input name="age" type="number" min="18" value={form.age} onChange={update} /></Field>
            <Field label="Coverage"><input name="coverage" type="number" min="100000" step="50000" value={form.coverage} onChange={update} /></Field>
            <Field label="Risk score"><select name="riskScore" value={form.riskScore} onChange={update}><option value="1">Low</option><option value="2">Medium</option><option value="3">High</option></select></Field>
            <Field label="Prior claims"><input name="priorClaims" type="number" min="0" value={form.priorClaims} onChange={update} /></Field>
            <Field label="Tenure"><select name="tenureYears" value={form.tenureYears} onChange={update}><option value="1">1 year</option><option value="2">2 years</option><option value="3">3 years</option></select></Field>
          </FormGrid>
          <button className="primaryBtn">Calculate premium</button>
          {quote && <div className="quoteCard"><span>Estimated annual premium</span><strong>{money(quote.annualPremium)}</strong><p>Monthly estimate {money(quote.monthlyPremium)}.</p></div>}
        </form>
        <form className="panel" onSubmit={purchase}>
          <PanelHeading icon={<UploadCloud />} title="Proposal and KYC" />
          <FormGrid>
            <Field label="Full name"><input name="name" value={form.name} onChange={update} required /></Field>
            <Field label="Email"><input name="email" type="email" value={form.email} onChange={update} required /></Field>
            <Field label="Phone"><input name="phone" value={form.phone} onChange={update} required /></Field>
            <Field label="KYC type"><select name="kycType" value={form.kycType} onChange={update}><option>Aadhar</option><option>PAN</option><option>License</option></select></Field>
            <Field label="KYC document"><input name="kycFileName" value={form.kycFileName} onChange={update} required /></Field>
            <Field label="Payment mode"><select name="paymentMode" value={form.paymentMode} onChange={update}><option>UPI</option><option>Card</option><option>Net Banking</option></select></Field>
          </FormGrid>
          <button className="primaryBtn">Pay and issue policy</button>
        </form>
      </div>
    </section>
  );
}
