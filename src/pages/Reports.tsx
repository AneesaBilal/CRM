import React from 'react';
import { useTable } from '../lib/useTable';
import { Card, ErrorPanel, PageHeader, Spinner } from '../components/ui';

function currency(value: any) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(value || 0));
}

function BarList(props: any) {
  const rows = props.rows;
  const max = rows.reduce(function (m: number, r: any) { return Math.max(m, r.value); }, 0) || 1;

  return (
    <div className="space-y-3 p-5">
      {rows.length === 0 ? <p className="text-sm text-slate-400">No data yet.</p> : null}
      {rows.map(function (row: any) {
        const width = Math.max(4, Math.round((row.value / max) * 100));
        return (
          <div key={row.label}>
            <div className="mb-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>{row.label}</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">{row.display}</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
              <div className="h-2 rounded-full bg-indigo-500" style={{ width: width + '%' }}></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Reports() {
  const deals = useTable('nexacrm_deals');
  const leads = useTable('nexacrm_leads');
  const tasks = useTable('nexacrm_tasks');

  const loading = deals.loading || leads.loading || tasks.loading;
  const error = deals.error || leads.error || tasks.error;

  if (loading) return <Spinner label="Loading reports..." />;
  if (error) return <ErrorPanel error={error} />;

  const stageLabels = ['Lead', 'Qualified', 'Discovery', 'Proposal', 'Negotiation', 'Won', 'Lost'];
  const revenueByStage = stageLabels.map(function (stage) {
    const value = deals.rows
      .filter(function (d: any) { return d.stage === stage; })
      .reduce(function (sum: number, d: any) { return sum + Number(d.amount || 0); }, 0);
    return { label: stage, value: value, display: currency(value) };
  });

  const sourceLabels = ['Website', 'Referral', 'LinkedIn', 'Facebook', 'Instagram', 'Advertisement', 'Cold Call', 'Email Campaign', 'Other'];
  const leadsBySource = sourceLabels
    .map(function (source) {
      const count = leads.rows.filter(function (l: any) { return l.source === source; }).length;
      return { label: source, value: count, display: String(count) };
    })
    .filter(function (row) { return row.value > 0; });

  const taskLabels = ['To Do', 'In Progress', 'Completed', 'Cancelled'];
  const tasksByStatus = taskLabels.map(function (status) {
    const count = tasks.rows.filter(function (t: any) { return t.status === status; }).length;
    return { label: status, value: count, display: String(count) };
  });

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Reports" subtitle="Computed live from your Supabase data." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card>
          <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
            <h2 className="text-sm font-semibold">Revenue by stage</h2>
          </div>
          <BarList rows={revenueByStage} />
        </Card>

        <Card>
          <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
            <h2 className="text-sm font-semibold">Leads by source</h2>
          </div>
          <BarList rows={leadsBySource} />
        </Card>

        <Card>
          <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
            <h2 className="text-sm font-semibold">Tasks by status</h2>
          </div>
          <BarList rows={tasksByStatus} />
        </Card>
      </div>
    </div>
  );
}
