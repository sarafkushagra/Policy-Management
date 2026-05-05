export default function AboutPage() {
  return (
    <section className="publicPage">
      <p className="eyebrow">About TrustBridge</p>
      <h1>Built for the full insurance lifecycle.</h1>
      <p className="lead">The platform reduces paperwork and uncertainty by connecting policy purchase, underwriting, certificates, renewals, and claims in one organised system.</p>
      <div className="storyGrid">
        <article><h3>For policyholders</h3><p>Clear product comparison, premium estimates, online KYC, certificates, renewal reminders, and claim tracking.</p></article>
        <article><h3>For underwriters</h3><p>Product configuration, application visibility, risk-based pricing data, and administrative controls.</p></article>
        <article><h3>For claims teams</h3><p>Evidence review, workflow status changes, settlement references, and complete claim history.</p></article>
      </div>
    </section>
  );
}
