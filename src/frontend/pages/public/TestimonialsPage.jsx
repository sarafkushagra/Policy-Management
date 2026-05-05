export default function TestimonialsPage() {
  const quotes = [
    ['Aarav Mehta', 'Policyholder', 'I could compare plans, buy health cover, and download the certificate without visiting a branch.'],
    ['Nisha Rao', 'Underwriter', 'The admin view keeps product, policy, and claim work in one place. It is easier to review risk.'],
    ['Kabir Sen', 'Claims Adjuster', 'The claim state flow makes it clear what needs evidence review and what is ready for payout.']
  ];
  return (
    <section className="publicPage">
      <p className="eyebrow">Testimonials</p>
      <h1>Trusted by every role in the policy journey.</h1>
      <div className="testimonialGrid">
        {quotes.map(([name, role, quote]) => (
          <article className="testimonial" key={name}>
            <p>"{quote}"</p>
            <strong>{name}</strong>
            <span>{role}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
