import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from 'context/AuthContext';
import { authApi } from 'api/auth';
import { extractError } from 'api/client';
import Input from 'components/ui/Input';
import Button from 'components/ui/Button';

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { access_token } = await authApi.register(form.username, form.email, form.password);
      await login(access_token);
      navigate('/feed');
    } catch (err) {
      setError(extractError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#fff', padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h1 style={{
            fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 600,
            margin: '0 0 40px', color: '#111', textAlign: 'center', letterSpacing: '-0.02em',
          }}>
            Artspace
          </h1>
        </Link>

        <h2 style={{ fontSize: 22, fontWeight: 600, margin: '0 0 6px' }}>Create an account</h2>
        <p style={{ fontSize: 14, color: '#737373', margin: '0 0 28px' }}>
          Join the community of artists
        </p>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input
            label="Username"
            value={form.username}
            onChange={set('username')}
            placeholder="yourname"
            required
            autoFocus
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={set('email')}
            placeholder="you@example.com"
            required
          />
          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={set('password')}
            placeholder="Min. 8 characters"
            required
          />

          {error && (
            <p style={{ margin: 0, fontSize: 13, color: '#ef4444', padding: '10px 12px', background: '#fef2f2', borderRadius: 4 }}>
              {error}
            </p>
          )}

          <Button type="submit" loading={loading} size="lg" style={{ width: '100%', marginTop: 4 }}>
            Create account
          </Button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#737373' }}>
          Already a member?{' '}
          <Link to="/login" style={{ color: '#111', fontWeight: 500, textDecoration: 'none' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
