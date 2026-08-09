import React from 'react';
import { Card } from '../components/ui';

export default function SupabaseSetup() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6 dark:bg-slate-950">
      <Card className="w-full max-w-2xl p-6">
        <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Supabase setup required</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          This app is wired to Supabase, but no Supabase project is configured yet.
        </p>

        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-slate-600 dark:text-slate-300">
          <li>Create a project at supabase.com.</li>
          <li>Open the Supabase SQL Editor.</li>
          <li>Run the contents of supabase/schema.sql.</li>
          <li>Run the contents of supabase/policies.sql.</li>
          <li>Run the contents of supabase/seed.sql.</li>
          <li>Copy .env.example to .env.local.</li>
          <li>Set VITE_SUPABASE_URL to your Supabase project URL.</li>
          <li>Set VITE_SUPABASE_ANON_KEY to your Supabase anon/public key.</li>
          <li>Restart the dev server.</li>
        </ol>

        <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
          Do not use the service-role key in the frontend. The anon key is safe when Row Level Security is configured.
        </p>
      </Card>
    </div>
  );
}
