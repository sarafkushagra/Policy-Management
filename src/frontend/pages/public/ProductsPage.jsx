import { useState } from 'react';
import ProductCard from '../../components/ProductCard.jsx';
import { usePolicyData } from '../../context/PolicyContext.jsx';

export default function ProductsPage() {
  const { data } = usePolicyData();
  const [filter, setFilter] = useState('All');
  const products = filter === 'All' ? data.products : data.products.filter(product => product.type === filter);
  return (
    <section className="publicPage">
      <p className="eyebrow">Insurance products</p>
      <h1>Compare plans before you buy.</h1>
      <p className="lead">Choose from health, life, and vehicle products with transparent benefits and pricing inputs.</p>
      <div className="toolbar">
        {['All', 'Health', 'Life', 'Vehicle'].map(item => (
          <button key={item} className={filter === item ? 'segment active' : 'segment'} onClick={() => setFilter(item)}>{item}</button>
        ))}
      </div>
      <div className="productGrid">
        {products.map(product => <ProductCard key={product.id} product={product} />)}
      </div>
    </section>
  );
}
