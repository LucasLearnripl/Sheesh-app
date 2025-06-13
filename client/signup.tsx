import { useState } from 'react';
import { signUp } from '../server/auth'; // path to your Supabase signup logic

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userId = await signUp(email, password, displayName);
      setSuccess(`✅ Signed up! User ID: ${userId}`);
      setError('');
    } catch (err: any) {
      setError(err.message);
      setSuccess('');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <input placeholder="Display Name" value={displayName} onChange={e => setDisplayName(e.target.value)} />
        <button type="submit">Sign Up</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
}
