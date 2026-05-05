import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

const demoUsers = [
  ['Policyholder', 'aarav@example.com', 'user123'],
  ['Admin / Underwriter', 'admin@example.com', 'admin123'],
  ['Claims Adjuster', 'claims@example.com', 'claims123']
];

export default function LoginPage() {
  const { login, authError } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: 'aarav@example.com', password: 'user123' });
  const update = event => setForm(current => ({ ...current, [event.target.name]: event.target.value }));
  const submit = async event => {
    event.preventDefault();
    const user = await login(form.email, form.password);
    if (user.role === 'Underwriter') navigate('/portal/admin/dashboard');
    else if (user.role === 'Claims Adjuster') navigate('/portal/claims/dashboard');
    else navigate('/portal/policyholder/dashboard');
  };
  return (
    <section className="loginPage">
      <form className="panel loginCard" onSubmit={submit}>
        <div className="loginIcon"><ShieldCheck /></div>
        <h1>Sign in to TrustBridge</h1>
        <p>Use one of the demo accounts to open the correct role-based portal.</p>
        <label className="field"><span>Email</span><input name="email" type="email" value={form.email} onChange={update} /></label>
        <label className="field"><span>Password</span><input name="password" type="password" value={form.password} onChange={update} /></label>
        {authError && <div className="alert">{authError}</div>}
        <button className="primaryBtn">Sign in</button>
        <div className="demoAccounts">
          {demoUsers.map(([role, email, password]) => (
            <button type="button" key={email} onClick={() => setForm({ email, password })}>
              <strong>{role}</strong><span>{email} / {password}</span>
            </button>
          ))}
        </div>
      </form>
    </section>
  );
}
