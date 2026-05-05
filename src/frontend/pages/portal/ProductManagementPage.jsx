import { ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { Field, FormGrid, PanelHeading } from '../../components/Form.jsx';
import PageTitle from '../../components/PageTitle.jsx';
import ProductCard from '../../components/ProductCard.jsx';
import { usePolicyData } from '../../context/PolicyContext.jsx';
import { api } from '../../utils/api.js';

export default function ProductManagementPage() {
  const { data, refresh } = usePolicyData();
  const [product, setProduct] = useState({
    type: 'Health',
    name: '',
    basePremium: 8500,
    coverage: 600000,
    benefits: 'Cashless care, No claim bonus, Teleconsults',
    terms: '1 year renewable policy with standard KYC and underwriting checks.'
  });
  const update = event => setProduct(current => ({ ...current, [event.target.name]: event.target.value }));
  const submit = async event => {
    event.preventDefault();
    await api('/api/products', {
      method: 'POST',
      body: JSON.stringify({ ...product, benefits: product.benefits.split(',').map(item => item.trim()).filter(Boolean) })
    });
    setProduct(current => ({ ...current, name: '' }));
    refresh();
  };
  return (
    <section className="page">
      <PageTitle icon={<ShieldCheck />} title="Product management" copy="Create insurance plans with base premiums, benefits, coverage, and terms." />
      <div className="purchaseLayout">
        <form className="panel" onSubmit={submit}>
          <PanelHeading icon={<ShieldCheck />} title="Create plan" />
          <FormGrid>
            <Field label="Type"><select name="type" value={product.type} onChange={update}><option>Health</option><option>Life</option><option>Vehicle</option></select></Field>
            <Field label="Plan name"><input name="name" value={product.name} onChange={update} placeholder="Senior Care Plus" required /></Field>
            <Field label="Base premium"><input name="basePremium" type="number" value={product.basePremium} onChange={update} required /></Field>
            <Field label="Coverage"><input name="coverage" type="number" value={product.coverage} onChange={update} required /></Field>
          </FormGrid>
          <Field label="Benefits"><input name="benefits" value={product.benefits} onChange={update} /></Field>
          <Field label="Terms"><textarea name="terms" rows="4" value={product.terms} onChange={update} required /></Field>
          <button className="primaryBtn">Create product</button>
        </form>
        <div className="productStack">
          {data.products.map(item => <ProductCard key={item.id} product={item} />)}
        </div>
      </div>
    </section>
  );
}
