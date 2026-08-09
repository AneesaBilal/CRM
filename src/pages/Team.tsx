import React from 'react';
import { useTable } from '../lib/useTable';
import { Card, ErrorPanel, PageHeader, Spinner } from '../components/ui';

function currency(value: any) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(value || 0));
}

export default function Team() {
  const profiles = useTable('nexacrm_profiles');
  const leads = useTable('nexacrm_leads');
  const deals = useTable('nexacrm_deals');

  const loading = profiles.loading || leads.loading || deals.loading;
  const error = profiles.error || leads.error || deals.error;

  if (loading) return <Spinner label="Loading team..." />;
  if (error) return <ErrorPanel error={error} />;

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Team" subtitle="Members from nexacrm_profiles with live performance." />

      <Card>
        {profiles.rows.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">No profiles yet. Profiles are created automatically when users register.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-800">
                  <th className="px-4 py-3 font-medium">Member</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Leads</th>
                  <th className="px-4 py-3 font-medium">Deals</th>
                  <th className="px-4 py-3 font-medium">Won revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {profiles.rows.map(function (profile: any) {
                  const leadCount = leads.rows.filter(function (l: any) { return l.owner_id === profile.id; }).length;
                  const ownedDeals = deals.rows.filter(function (d: any) { return d.owner_id === profile.id; });
                  const wonRevenue = ownedDeals
                    .filter(function (d: any) { return d.status === 'Won'; })
                    .reduce(function (s: number, d: any) { return s + Number(d.amount || 0); }, 0);

                  return (
                    <tr key={profile.id}>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-800 dark:text-slate-200">{profile.full_name || profile.email}</div>
                        <div className="text-xs text-slate-400">{profile.email}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{profile.role}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{leadCount}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{ownedDeals.length}</td>
                      <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">{currency(wonRevenue)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
