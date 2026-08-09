import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Button, Card, Input, Label } from '../components/ui';

function AuthShell(props: any) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6 dark:bg-slate-950">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white">N</div>
          <div className="text-xl font-semibold">NexaCRM</div>
        </div>
        <Card className="p-6">{props.children}</Card>
      </div>
    </div>
  );
}

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: any) {
    event.preventDefault();
    setMessage('');

    if (!supabase) {
      setMessage('Supabase is not configured.');
      return;
    }

    if (!email || !password) {
      setMessage('Email and password are required.');
      return;
    }

    setLoading(true);
    const result = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });
    setLoading(false);

    if (result.error) {
      setMessage(result.error.message);
    } else {
      navigate('/');
    }
  }

  return (
    <AuthShell>
      <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Sign in</h1>
      <p className="mb-5 mt-1 text-sm text-slate-500 dark:text-slate-400">Access your NexaCRM workspace.</p>

      {message ? <div className="mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">{message}</div> : null}

      <form onSubmit={submit} className="space-y-4">
        <div>
          <Label>Email</Label>
          <Input type="email" value={email} onChange={function (e: any) { setEmail(e.target.value); }} placeholder="you@company.com" />
        </div>

        <div>
          <Label>Password</Label>
          <Input type="password" value={password} onChange={function (e: any) { setPassword(e.target.value); }} placeholder="********" />
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>

      <div className="mt-5 space-y-1 text-center text-sm text-slate-500">
        <Link className="block text-indigo-600 hover:underline" to="/forgot-password">Forgot password?</Link>
        <Link className="block text-indigo-600 hover:underline" to="/register">Create an account</Link>
      </div>
    </AuthShell>
  );
}

export function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: any) {
    event.preventDefault();
    setMessage('');

    if (!supabase) {
      setMessage('Supabase is not configured.');
      return;
    }

    if (!name || !email) {
      setMessage('Name and email are required.');
      return;
    }

    if (password.length < 8) {
      setMessage('Password must be at least 8 characters.');
      return;
    }

    if (password !== confirm) {
      setMessage('Passwords do not match.');
      return;
    }

    setLoading(true);
    const result = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: name
        }
      }
    });
    setLoading(false);

    if (result.error) {
      setMessage(result.error.message);
    } else {
      setMessage('Account created. If email confirmation is enabled, check your inbox before signing in.');
    }
  }

  return (
    <AuthShell>
      <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Create account</h1>
      <p className="mb-5 mt-1 text-sm text-slate-500 dark:text-slate-400">Start managing your pipeline.</p>

      {message ? <div className="mb-4 rounded-lg bg-sky-50 p-3 text-sm text-sky-700 dark:bg-sky-950/30 dark:text-sky-300">{message}</div> : null}

      <form onSubmit={submit} className="space-y-4">
        <div>
          <Label>Full name</Label>
          <Input value={name} onChange={function (e: any) { setName(e.target.value); }} placeholder="Alex Rivera" />
        </div>

        <div>
          <Label>Email</Label>
          <Input type="email" value={email} onChange={function (e: any) { setEmail(e.target.value); }} placeholder="you@company.com" />
        </div>

        <div>
          <Label>Password</Label>
          <Input type="password" value={password} onChange={function (e: any) { setPassword(e.target.value); }} placeholder="At least 8 characters" />
        </div>

        <div>
          <Label>Confirm password</Label>
          <Input type="password" value={confirm} onChange={function (e: any) { setConfirm(e.target.value); }} placeholder="Repeat password" />
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Creating account...' : 'Create account'}
        </Button>
      </form>

      <div className="mt-5 text-center text-sm text-slate-500">
        <Link className="text-indigo-600 hover:underline" to="/login">Back to sign in</Link>
      </div>
    </AuthShell>
  );
}

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: any) {
    event.preventDefault();
    setMessage('');

    if (!supabase) {
      setMessage('Supabase is not configured.');
      return;
    }

    if (!email) {
      setMessage('Email is required.');
      return;
    }

    setLoading(true);
    const result = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password'
    });
    setLoading(false);

    if (result.error) {
      setMessage(result.error.message);
    } else {
      setMessage('Password reset email sent. Check your inbox.');
    }
  }

  return (
    <AuthShell>
      <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Forgot password</h1>
      <p className="mb-5 mt-1 text-sm text-slate-500 dark:text-slate-400">We will send a reset link to your email.</p>

      {message ? <div className="mb-4 rounded-lg bg-sky-50 p-3 text-sm text-sky-700 dark:bg-sky-950/30 dark:text-sky-300">{message}</div> : null}

      <form onSubmit={submit} className="space-y-4">
        <div>
          <Label>Email</Label>
          <Input type="email" value={email} onChange={function (e: any) { setEmail(e.target.value); }} placeholder="you@company.com" />
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Sending...' : 'Send reset link'}
        </Button>
      </form>

      <div className="mt-5 text-center text-sm text-slate-500">
        <Link className="text-indigo-600 hover:underline" to="/login">Back to sign in</Link>
      </div>
    </AuthShell>
  );
}

export function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: any) {
    event.preventDefault();
    setMessage('');

    if (!supabase) {
      setMessage('Supabase is not configured.');
      return;
    }

    if (password.length < 8) {
      setMessage('Password must be at least 8 characters.');
      return;
    }

    if (password !== confirm) {
      setMessage('Passwords do not match.');
      return;
    }

    setLoading(true);
    const result = await supabase.auth.updateUser({ password: password });
    setLoading(false);

    if (result.error) {
      setMessage(result.error.message);
    } else {
      navigate('/login');
    }
  }

  return (
    <AuthShell>
      <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Reset password</h1>
      <p className="mb-5 mt-1 text-sm text-slate-500 dark:text-slate-400">Choose a new password for your account.</p>

      {message ? <div className="mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">{message}</div> : null}

      <form onSubmit={submit} className="space-y-4">
        <div>
          <Label>New password</Label>
          <Input type="password" value={password} onChange={function (e: any) { setPassword(e.target.value); }} placeholder="New password" />
        </div>

        <div>
          <Label>Confirm new password</Label>
          <Input type="password" value={confirm} onChange={function (e: any) { setConfirm(e.target.value); }} placeholder="Repeat new password" />
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Saving...' : 'Update password'}
        </Button>
      </form>
    </AuthShell>
  );
}
