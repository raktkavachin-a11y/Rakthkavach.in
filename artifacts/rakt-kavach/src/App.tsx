import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Redirect, Route, Router as WouterRouter, Switch } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import { AuthProvider } from '@/context/auth';
import { I18nProvider } from '@/context/i18n';
import { SupabaseProvider } from '@/context/supabase-provider';
import AdminDashboard from '@/pages/AdminDashboard';
import DonorDashboard from '@/pages/DonorDashboard';
import HospitalDashboard from '@/pages/HospitalDashboard';
import Login from '@/pages/Login';

const queryClient = new QueryClient();
export default function App(): JSX.Element { return <QueryClientProvider client={queryClient}><I18nProvider><AuthProvider><SupabaseProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><ErrorBoundary><Switch><Route path="/" component={Login} /><Route path="/donor" component={DonorDashboard} /><Route path="/hospital" component={HospitalDashboard} /><Route path="/admin" component={AdminDashboard} /><Route><Redirect to="/" /></Route></Switch></ErrorBoundary></WouterRouter></SupabaseProvider></AuthProvider></I18nProvider></QueryClientProvider>; }
