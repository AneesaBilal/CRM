import React from 'react';
import { useTable } from '../lib/useTable';
import { Card, ErrorPanel, PageHeader, Spinner } from '../components/ui';

function currency(value: any) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(value || 0));
}

export default function Forecast() {
  const deals = useTable('nexacrm_deals');

  if (deals.loading) return <Spinner label="Loading forecast..." />;
  if (deals.error) return <ErrorPanel error={deals.error} />;

  const open = deals.rows.filter(function (d: any) { return d.status === 'Open'; });
  const won = deals.rows.filter(function (d: any) { return d.status === 'Won'; });

  const totalPipeline = open.reduce(function (s: number, d: any) { return s + Number(d.amount || 0); }, 0);
  const weighted = open.reduce(function (s: number, d: any) { return s + Math.round(Number(d.amount || 0) * Number(d.probability || 0) / 100); }, 0);
  const closedWon = won.reduce(function (s: number, d: any) { return s + Number(d.amount || 0); }, 0);
  const forecast = closedWon + weighted;
  const target = Math.round(totalPipeline * 1.2);
  const gap = Math.max(0, target - forecast);

  const months: any[] = [];
  for (let i = 0; i < 4; i++) {
    const d = new Date();
    d.setMonth(d.getMonth() + i);
    const label = d.toLocaleDateString('en-US', { month: 'short' });

    const monthDeals = open.filter(function (x: any) {
      if (!x.close_date) return false;
      const close = new Date(x.close_date);
      return close.getMonth() === d.getMonth() && close.getFullYear() === d.getFullYear();
    });

    months.push({
      label: label,
      pipeline: monthDeals.reduce(function (s: number, x: any) { return s + Number(x.amount || 0); }, 0),
      commit: monthDeals
        .filter(function (x: any) { return Number(x.probability || 0) >= 70; })
        .reduce(function (s: number, x: any) { return s + Number(x.amount || 0); }, 0)
    });
  }

  const maxMonth = months.reduce(function (m: number, row: any) { return Math.max(m, row.pipeline); }, 0) || 1;

  const cards = [
    { label: 'Total pipeline', value: currency(totalPipeline) },
    { label: 'Weighted pipeline', value: currency(weighted) },
    { label: 'Closed won', value: currency(closedWon) },
    { label: 'Forecast', value: currency(forecast) },
    { label: 'Target', value: currency(target) },
    { label: 'Gap to target', value: currency(gap) }
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Sales Forecast" subtitle="Weighted projections from real deal probabilities." />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-6">
        {cards.map(function (card) {
          return (
            <Card key={card.label} className="p-5">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-400">{card.label}</div>
              <div className="mt-2 text-lg font-semibold text-slate-900 dark:text-slate-100">{card.value}</div>
            </Card>
          );
        })}
      </div>

      <Card className="mt-6">
        <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <h2 className="text-sm font-semibold">Forecast by month</h2>
        </div>
        <div className="grid grid-cols-2 gap-6 p-6 md:grid-cols-4">
          {months.map(function (month) {
            const pipelineWidth = Math.max(4, Math.round((month.pipeline / maxMonth) * 100));
            const commitWidth = Math.max(4, Math.round((month.commit / maxMonth) * 100));
            return (
              <div key={month.label}>
                <div className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">{month.label}</div>
                <div className="space-y-2">
                  <div>
                    <div className="mb-1 text-xs text-slate-400">Pipeline {currency(month.pipeline)}</div>
                    <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                      <div className="h-2 rounded-full bg-indigo-500" style={{ width: pipelineWidth + '%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 text-xs text-slate-400">Commit {currency(month.commit)}</div>
                    <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                      <div className="h-2 rounded-full bg-emerald-500" style={{ width: commitWidth + '%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}