import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Inbox, Target, Users, Building2, Handshake, KanbanSquare,
  Activity, CheckSquare, Calendar, Package, FileText, LifeBuoy, BarChart3,
  TrendingUp, UsersRound, Bell, Settings, LogOut
} from 'lucide-react';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { cn } from './ui';

const sections = [
  {
    title: 'Main',
    items: [
      { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
      { to: '/inbox', label: 'Inbox', icon: Inbox },
      { to: '/leads', label: 'Leads', icon: Target },
      { to: '/contacts', label: 'Contacts', icon: Users },
      { to: '/companies', label: 'Companies', icon: Building2 },
      { to: '/deals', label: 'Deals', icon: Handshake },
      { to: '/pipeline', label: 'Pipeline', icon: KanbanSquare },
      { to: '/activities', label: 'Activities', icon: Activity },
      { to: '/tasks', label: 'Tasks', icon: CheckSquare },
      { to: '/calendar', label: 'Calendar', icon: Calendar }
    ]
  },
  {
    title: 'Management',
    items: [
      { to: '/products', label: 'Products', icon: Package },
      { to: '/quotes', label: 'Quotes', icon: FileText },
      { to: '/tickets', label: 'Support Tickets', icon: LifeBuoy },
      { to: '/reports', label: 'Reports', icon: BarChart3 },
      { to: '/forecast', label: 'Forecast', icon: TrendingUp }
    ]
  },
  {
    title: 'Workspace',
    items: [
      { to: '/team', label: 'Team', icon: UsersRound },
      { to: '/notifications', label: 'Notifications', icon: Bell },
      { to: '/settings', label: 'Settings', icon: Settings }
    ]
  }
];

export default function Layout() {
  const navigate = useNavigate();
  const auth = useAuth();
  const user = auth.user;

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    navigate('/login');
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-slate-800 bg-slate-900 text-slate-300 md:flex">
        <div className="flex items-center gap-2 px-4 py-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">N</div>
          <div className="text-base font-semibold text-white">NexaCRM</div>
        </div>

        <nav className="flex-1 space-y-4 overflow-y-auto px-3 pb-4">
          {sections.map(function (section) {
            return (
              <div key={section.title}>
                <div className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  {section.title}
                </div>
                <div className="space-y-1">
                  {section.items.map(function (item) {
                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        className={function (opts: any) {
                          return cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                            opts.isActive ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                          );
                        }}
                      >
                        <item.icon size={16} />
                        {item.label}
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-sm text-slate-500 dark:text-slate-400">
            {user && user.email ? user.email : 'Signed in'}
          </div>
          <button
            onClick={signOut}
            className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <LogOut size={14} />
            Sign out
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
