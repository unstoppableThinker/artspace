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
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="w-full max-w-sm">

        <Link to="/" className="no-underline block text-center mb-10">
          <h1 className="font-serif text-3xl font-semibold text-ink tracking-tight">Artspace</h1>
        </Link>

        <h2 className="text-xl font-semibold text-ink mb-1">Welcome back</h2>
        <p className="text-sm text-ink-muted mb-7">Sign in to your account</p>

        <form onSubmit={submit} className="flex flex-col gap-4">
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
            <p className="text-sm text-red-500 bg-red-50 px-3 py-2.5 rounded">{error}</p>
          )}

          <Button type="submit" loading={loading} size="lg" className="w-full mt-1">
            Sign in
          </Button>
        </form>

        <p className="text-center mt-6 text-sm text-ink-muted">
          Don't have an account?{' '}
          <Link to="/register" className="text-ink font-medium no-underline hover:underline">
            Join Artspace
          </Link>
        </p>
      </div>
    </div>
  );
}
