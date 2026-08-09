import React, { useEffect, useState } from 'react';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { Button, Card, ErrorPanel, Input, Label, PageHeader, Spinner } from '../components/ui';

export default function Settings() {
  const auth = useAuth();
  const user = auth.user;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(function () {
    if (!supabase || !user) {
      setLoading(false);
      return;
    }

    supabase
      .from('nexacrm_profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()
      .then(function (result: any) {
        if (result.error) {
          setError(result.error.message);
        } else if (result.data) {
          setFullName(result.data.full_name || '');
          setEmail(result.data.email || user.email || '');
          setRole(result.data.role || '');
        } else {
          setFullName(user.email || '');
          setEmail(user.email || '');
          setRole('Sales Representative');
        }

        setLoading(false);
      });
  }, [user]);

  async function save() {
    setMessage('');
    setError('');

    if (!supabase || !user) {
      setError('Supabase is not configured.');
      return;
    }

    setSaving(true);

    const result = await supabase.from('nexacrm_profiles').upsert({
      id: user.id,
      full_name: fullName.trim() || null,
      email: email.trim() || user.email
    });

    setSaving(false);

    if (result.error) {
      setError(result.error.message);
    } else {
      setMessage('Profile saved.');
    }
  }

  if (loading) return <Spinner label="Loading profile..." />;
  if (error) return <ErrorPanel error={error} />;

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Settings" subtitle="Your profile is stored in nexacrm_profiles." />

      <Card className="p-5">
        {message ? <div className="mb-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">{message}</div> : null}

        <div className="space-y-4">
          <div>
            <Label>Full name</Label>
            <Input value={fullName} onChange={function (e: any) { setFullName(e.target.value); }} placeholder="Your name" />
          </div>

          <div>
            <Label>Email</Label>
            <Input value={email} onChange={function (e: any) { setEmail(e.target.value); }} placeholder="you@company.com" />
          </div>

          <div>
            <Label>Role</Label>
            <Input value={role} disabled />
          </div>

          <Button onClick={save} disabled={saving}>
            {saving ? 'Saving...' : 'Save profile'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
