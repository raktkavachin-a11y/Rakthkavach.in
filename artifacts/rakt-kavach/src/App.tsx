import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Router as WouterRouter, Switch, Redirect } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import { AuthProvider } from '@/context/auth';
import { I18nProvider } from '@/context/i18n';
import { SupabaseProvider } from '@/context/supabase-provider';
import PwaInstallPrompt from '@/components/PwaInstallPrompt';
import AdminDashboard from '@/pages/AdminDashboard';
import DonorDashboard from '@/pages/DonorDashboard';
import HospitalDashboard from '@/pages/HospitalDashboard';
import Login from '@/pages/Login';
import ProfileCompletion from '@/pages/ProfileCompletion';

const queryClient = new QueryClient();

// ⚡ प्रोग्रेसिव ऐप (PWA) डाउनलोड पॉपअप को एक्टिव करने का कोड यहाँ जोड़ दिया है
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Rakt Kavach PWA Activation Success!'))
      .catch(err => console.error('PWA Activation Failed: ', err));
  });
}

export default function App(): JSX.Element { 
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <AuthProvider>
          <SupabaseProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
              <ErrorBoundary>
                <Switch>
                  <Route path="/" component={Login} />
                  <Route path="/profile/complete" component={ProfileCompletion} />
                  <Route path="/donor" component={DonorDashboard} />
                  <Route path="/hospital" component={HospitalDashboard} />
                  <Route path="/admin" component={AdminDashboard} />
                  <Route><Redirect to="/" /></Route>
                </Switch>
                <PwaInstallPrompt />
              </ErrorBoundary>
            </WouterRouter>
          </SupabaseProvider>
        </AuthProvider>
      </I18nProvider>
    </QueryClientProvider>
  ); 
}
