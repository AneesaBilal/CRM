import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/auth';
import { isSupabaseConfigured } from './lib/supabase';
import Layout from './components/Layout';
import SupabaseSetup from './pages/SupabaseSetup';
import { ForgotPassword, Login, Register, ResetPassword } from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Contacts from './pages/Contacts';
import Companies from './pages/Companies';
import Deals from './pages/Deals';
import Pipeline from './pages/Pipeline';
import Tasks from './pages/Tasks';
import Settings from './pages/Settings';
import Inbox from './pages/Inbox';
import Activities from './pages/Activities';
import CalendarPage from './pages/CalendarPage';
import Products from './pages/Products';
import Quotes from './pages/Quotes';
import Tickets from './pages/Tickets';
import Reports from './pages/Reports';
import Forecast from './pages/Forecast';
import Team from './pages/Team';
import Notifications from './pages/Notifications';
import NotFound from './pages/NotFound';

function Protected(props: any) {
  const auth = useAuth();

  if (auth.loading) {
    return <div className="p-10 text-sm text-slate-500">Checking authentication...</div>;
  }

  if (!auth.user) {
    return <Navigate to="/login" replace />;
  }

  return props.children;
}

function Router() {
  if (!isSupabaseConfigured) {
    return <SupabaseSetup />;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route
        element={
          <Protected>
            <Layout />
          </Protected>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/pipeline" element={<Pipeline />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/products" element={<Products />} />
        <Route path="/quotes" element={<Quotes />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/forecast" element={<Forecast />} />
        <Route path="/team" element={<Team />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}
