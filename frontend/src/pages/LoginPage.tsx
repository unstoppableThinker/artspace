import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from 'context/AuthContext';
import { authApi } from 'api/auth';
import { extractError } from 'api/client';
import Input from 'components/ui/Input';
import Button from 'components/ui/Button';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { access_token } = await authApi.login(email, password);
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

        <h2 style={{ fontSize: 22, fontWeight: 600, margin: '0 0 6px' }}>Welcome back</h2>
        <p style={{ fontSize: 14, color: '#737373', margin: '0 0 28px' }}>
          Sign in to your account
        </p>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            autoFocus
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          {error && (
            <p style={{ margin: 0, fontSize: 13, color: '#ef4444', padding: '10px 12px', background: '#fef2f2', borderRadius: 4 }}>
              {error}
            </p>
          )}

          <Button type="submit" loading={loading} size="lg" style={{ width: '100%', marginTop: 4 }}>
            Sign in
          </Button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#737373' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#111', fontWeight: 500, textDecoration: 'none' }}>
            Join Artspace
          </Link>
        </p>
      </div>
    </div>
  );
}
