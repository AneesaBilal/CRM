import React from 'react';
import { X } from 'lucide-react';

export function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

export function Button(props: any) {
  const { variant, className, ...rest } = props;
  const style = variant || 'primary';

  const styles: any = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
    secondary: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800',
    danger: 'bg-rose-600 text-white hover:bg-rose-700'
  };

  return (
    <button
      className={cn(
        'inline-flex h-9 items-center justify-center rounded-lg px-4 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        styles[style],
        className
      )}
      {...rest}
    />
  );
}

export function Input(props: any) {
  const { className, ...rest } = props;
  return (
    <input
      className={cn(
        'h-9 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100',
        className
      )}
      {...rest}
    />
  );
}

export function Textarea(props: any) {
  const { className, ...rest } = props;
  return (
    <textarea
      className={cn(
        'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100',
        className
      )}
      {...rest}
    />
  );
}

export function Select(props: any) {
  const { className, children, ...rest } = props;
  return (
    <select
      className={cn(
        'h-9 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100',
        className
      )}
      {...rest}
    >
      {children}
    </select>
  );
}

export function Label(props: any) {
  return <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-400">{props.children}</label>;
}

export function Card(props: any) {
  const { className, children, ...rest } = props;
  return (
    <div
      className={cn('rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900', className)}
      {...rest}
    >
      {children}
    </div>
  );
}

export function Badge(props: any) {
  const label = String(props.children);

  const tones: any = {
    New: 'bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300',
    Contacted: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300',
    Qualified: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
    Converted: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
    Lost: 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300',
    Won: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
    Open: 'bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300',
    Active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
    Lead: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    Discovery: 'bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300',
    Proposal: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300',
    Negotiation: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
    'To Do': 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    'In Progress': 'bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300',
    Completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
    Low: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
    Medium: 'bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300',
    High: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
    Urgent: 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300',
    Cold: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
    Warm: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
    Hot: 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300'
  };

  return (
    <span
      className={cn(
        'inline-flex items-center whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-medium',
        tones[label] || 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
      )}
    >
      {props.children}
    </span>
  );
}

export function Spinner(props: any) {
  return <div className="p-10 text-center text-sm text-slate-500">{props.label || 'Loading...'}</div>;
}

export function Empty(props: any) {
  return <div className="p-10 text-center text-sm text-slate-500">{props.title || 'No records found.'}</div>;
}

export function ErrorPanel(props: any) {
  return (
    <div className="m-6 rounded-xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300">
      <p className="font-semibold">Supabase error</p>
      <p className="mt-1">{props.error}</p>
      <p className="mt-2 text-xs">
        If a table does not exist, run supabase/schema.sql, supabase/policies.sql, and supabase/seed.sql in the Supabase SQL Editor.
      </p>
    </div>
  );
}

export function PageHeader(props: any) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{props.title}</h1>
        {props.subtitle ? <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{props.subtitle}</p> : null}
      </div>
      {props.action}
    </div>
  );
}

export function Modal(props: any) {
  if (!props.open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60" onClick={props.onClose}></div>
      <div className="relative w-full max-w-lg rounded-xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{props.title}</h2>
          <button onClick={props.onClose} className="rounded-md p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X size={16} />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto">{props.children}</div>

        {props.footer ? <div className="mt-5 flex justify-end gap-2">{props.footer}</div> : null}
      </div>
    </div>
  );
}
