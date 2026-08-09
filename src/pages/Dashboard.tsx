import React from 'react';
import { Link } from 'react-router-dom';
import { useTable } from '../lib/useTable';
import { Badge, Card, ErrorPanel, PageHeader, Spinner, Empty } from '../components/ui';

function currency(value: any) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

export default function Dashboard() {
  const leads = useTable('nexacrm_leads');
  const deals = useTable('nexacrm_deals');
  const companies = useTable('nexacrm_companies');
  const tasks = useTable('nexacrm_tasks');

  const loading = leads.loading || deals.loading || companies.loading || tasks.loading;
  const error = leads.error || deals.error || companies.error || tasks.error;

  if (loading) return <Spinner label="Loading dashboard..." />;
  if (error) return <ErrorPanel error={error} />;

  const wonDeals = deals.rows.filter(function (deal: any) {
    return deal.status === 'Won';
  });

  const openDeals = deals.rows.filter(function (deal: any) {
    return deal.status === 'Open';
  });

  const openPipeline = openDeals.reduce(function (sum: number, deal: any) {
    return sum + Number(deal.amount || 0);
  }, 0);

  const wonRevenue = wonDeals.reduce(function (sum: number, deal: any) {
    return sum + Number(deal.amount || 0);
  }, 0);

  const newLeads = leads.rows.filter(function (lead: any) {
    return lead.status === 'New';
  }).length;

  const openTasks = tasks.rows.filter(function (task: any) {
    return task.status !== 'Completed';
  }).length;

  const stats = [
    { label: 'Won revenue', value: currency(wonRevenue) },
    { label: 'Open pipeline', value: currency(openPipeline) },
    { label: 'Open deals', value: String(openDeals.length) },
    { label: 'New leads', value: String(newLeads) },
    { label: 'Companies', value: String(companies.rows.length) },
    { label: 'Open tasks', value: String(openTasks) }
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Dashboard" subtitle="Live data from your Supabase workspace." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map(function (stat) {
          return (
            <Card key={stat.label} className="p-5">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-400">{stat.label}</div>
              <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">{stat.value}</div>
            </Card>
          );
        })}
      </div>

      <Card className="mt-6">
        <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Recent leads</h2>
        </div>

        {leads.rows.length === 0 ? (
          <Empty title="No leads yet. Run supabase/seed.sql or create leads." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-400 dark:border-slate-800">
                  <th className="px-5 py-3 font-medium">Lead</th>
                  <th className="px-5 py-3 font-medium">Company</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Score</th>
                  <th className="px-5 py-3 font-medium">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {leads.rows.slice(0, 8).map(function (lead: any) {
                  return (
                    <tr key={lead.id}>
                      <td className="px-5 py-3">
                        <Link to="/leads" className="font-medium text-slate-800 hover:text-indigo-600 dark:text-slate-200">
                          {lead.name}
                        </Link>
                      </td>
                      <td className="px-5 py-3 text-slate-500 dark:text-slate-400">{lead.company || '—'}</td>
                      <td className="px-5 py-3"><Badge>{lead.status}</Badge></td>
                      <td className="px-5 py-3"><Badge>{lead.score || 'Warm'}</Badge></td>
                      <td className="px-5 py-3 font-medium text-slate-700 dark:text-slate-300">{currency(lead.value)}</td>
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
