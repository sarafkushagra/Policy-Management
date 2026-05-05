import { Mail, MapPin, Phone } from 'lucide-react';

export default function ContactPage() {
  return (
    <section className="publicPage contactLayout">
      <div>
        <p className="eyebrow">Contact us</p>
        <h1>Questions about cover, claims, or renewals?</h1>
        <p className="lead">Send a message to the TrustBridge team. A policy service specialist will route it to the right desk.</p>
        <div className="contactList">
          <span><Phone /> +91 98765 43210</span>
          <span><Mail /> care@trustbridge.insure</span>
          <span><MapPin /> Bengaluru, India</span>
        </div>
      </div>
      <form className="panel contactForm">
        <label className="field"><span>Name</span><input placeholder="Your name" /></label>
        <label className="field"><span>Email</span><input type="email" placeholder="you@example.com" /></label>
        <label className="field"><span>Message</span><textarea rows="5" placeholder="Tell us what you need help with" /></label>
        <button className="primaryBtn" type="button">Send enquiry</button>
      </form>
    </section>
  );
}
