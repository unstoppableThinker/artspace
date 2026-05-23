import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from 'store/hooks';
import { loginWithToken } from 'store/slices/authSlice';
import { authApi } from 'api/auth';
import { extractError } from 'api/client';
import Input from 'components/ui/Input';
import Button from 'components/ui/Button';

export default function RegisterPage() {
  const dispatch = useAppDispatch();
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
      await dispatch(loginWithToken(access_token));
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

        <h2 className="text-xl font-semibold text-ink mb-1">Create an account</h2>
        <p className="text-sm text-ink-muted mb-7">Join the community of artists</p>

        <form onSubmit={submit} className="flex flex-col gap-4">
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
            <p className="text-sm text-red-500 bg-red-50 px-3 py-2.5 rounded">{error}</p>
          )}

          <Button type="submit" loading={loading} size="lg" className="w-full mt-1">
            Create account
          </Button>
        </form>

        <p className="text-center mt-6 text-sm text-ink-muted">
          Already a member?{' '}
          <Link to="/login" className="text-ink font-medium no-underline hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
