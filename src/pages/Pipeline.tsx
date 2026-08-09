import React, { useState } from 'react';
import { useTable } from '../lib/useTable';
import { Card, ErrorPanel, PageHeader, Spinner } from '../components/ui';

const stages = ['Lead', 'Qualified', 'Discovery', 'Proposal', 'Negotiation', 'Won', 'Lost'];

function currency(value: any) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

export default function Pipeline() {
  const deals = useTable('nexacrm_deals');
  const companies = useTable('nexacrm_companies');
  const [dragId, setDragId] = useState<string | null>(null);
  const [overStage, setOverStage] = useState<string | null>(null);

  const loading = deals.loading || companies.loading;
  const error = deals.error || companies.error;

  function companyName(id: string) {
    const company = companies.rows.find(function (item: any) {
      return item.id === id;
    });
    return company ? company.name : '—';
  }

  function stagePatch(stage: string) {
    const patch: any = { stage: stage };

    if (stage === 'Won') {
      patch.status = 'Won';
      patch.probability = 100;
    } else if (stage === 'Lost') {
      patch.status = 'Lost';
      patch.probability = 0;
    } else {
      patch.status = 'Open';
    }

    return patch;
  }

  async function dropToStage(stage: string) {
    if (!dragId) return;

    try {
      await deals.update(dragId, stagePatch(stage));
    } catch (err: any) {
      window.alert(err.message || 'Failed to move deal.');
    } finally {
      setDragId(null);
      setOverStage(null);
    }
  }

  if (loading) return <Spinner label="Loading pipeline..." />;
  if (error) return <ErrorPanel error={error} />;

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader title="Pipeline" subtitle="Drag deals between stages. Updates are saved to Supabase." />

      <div className="overflow-x-auto pb-4">
        <div className="flex gap-3" style={{ minWidth: stages.length * 250 }}>
          {stages.map(function (stage) {
            const stageDeals = deals.rows.filter(function (deal: any) {
              return deal.stage === stage;
            });

            const stageValue = stageDeals.reduce(function (sum: number, deal: any) {
              return sum + Number(deal.amount || 0);
            }, 0);

            return (
              <div
                key={stage}
                onDragOver={function (event) {
                  event.preventDefault();
                  setOverStage(stage);
                }}
                onDragLeave={function () {
                  setOverStage(null);
                }}
                onDrop={function () {
                  dropToStage(stage);
                }}
                className={
                  overStage === stage
                    ? 'flex w-60 shrink-0 flex-col rounded-xl bg-indigo-50 ring-2 ring-indigo-400 dark:bg-indigo-500/10'
                    : 'flex w-60 shrink-0 flex-col rounded-xl bg-slate-200/50 dark:bg-slate-900'
                }
              >
                <div className="flex items-center justify-between px-3 py-3">
                  <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">{stage}</div>
                  <div className="text-xs text-slate-500">{currency(stageValue)}</div>
                </div>

                <div className="flex-1 space-y-2 overflow-y-auto px-2 pb-2">
                  {stageDeals.length === 0 ? (
                    <div className="px-2 py-6 text-center text-xs text-slate-400">No deals</div>
                  ) : (
                    stageDeals.map(function (deal: any) {
                      return (
                        <div
                          key={deal.id}
                          draggable={true}
                          onDragStart={function () {
                            setDragId(deal.id);
                          }}
                          className="cursor-grab rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-800"
                        >
                          <div className="text-sm font-medium text-slate-800 dark:text-slate-100">{deal.name}</div>
                          <div className="mt-1 text-xs text-slate-500">{companyName(deal.company_id)}</div>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">{currency(deal.amount)}</div>
                            <div className="text-xs text-slate-400">{deal.probability}%</div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
