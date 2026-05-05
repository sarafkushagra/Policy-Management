import { ArrowRight, BadgeCheck, Clock3, FileText, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="heroCopy">
          <p className="eyebrow">Policy management made clear</p>
          <h1>Insurance that is easier to buy, understand, renew, and claim.</h1>
          <p>TrustBridge gives policyholders a transparent portal while underwriters and claim teams get structured workflows for faster decisions.</p>
          <div className="heroActions">
            <Link className="primaryBtn" to="/products">Explore plans <ArrowRight size={18} /></Link>
            <Link className="secondaryBtn" to="/login">Sign in to portal</Link>
          </div>
        </div>
        <div className="heroPanel">
          <div className="policyPreview">
            <span className="status issued">Policy issued</span>
            <h2>Health Shield Family</h2>
            <p>Coverage INR 5,00,000 · Renewal in 29 days</p>
            <div className="heroSteps">
              <span><BadgeCheck size={16} /> Premium calculated</span>
              <span><FileText size={16} /> Certificate generated</span>
              <span><Clock3 size={16} /> Claim status visible</span>
            </div>
          </div>
        </div>
      </section>
      <section className="contentBand">
        {[
          ['Instant premium engine', 'Age, cover, risk score, tenure, and claim history feed transparent pricing.'],
          ['Digital KYC and certificates', 'Proposal submission, mock Cloudinary document records, and PDF policy certificates.'],
          ['Claim state workflow', 'Submitted, verified, approved, disbursed, or rejected with traceable history.']
        ].map(([title, copy]) => (
          <article className="featureTile" key={title}>
            <ShieldCheck />
            <h3>{title}</h3>
            <p>{copy}</p>
          </article>
        ))}
      </section>
    </>
  );
}
