import { useAuth, type AuthRole } from '@/context/auth';
import { useLocation } from 'wouter';

const featureNames = [
  'identity','profile','eligibility','donation-history','blood-wallet','wallet-transfer','qr-pass','qr-verification','donor-registry','donor-search',
  'blood-request','request-matching','request-tracking','request-history','emergency-response','sos-cases','emergency-trends','hospital-dashboard','hospital-inventory','inventory-intake',
  'inventory-status','unit-timeline','traceability','blood-groups','component-stock','expiry-alerts','facility-network','facility-directory','institution-verification','institution-profile',
  'laboratory-dashboard','lab-verification','screening','test-results','quality-control','cold-chain','logistics','logistics-routes','dispatch','delivery-confirmation',
  'authority-dashboard','block-view','district-view','state-view','national-view','who-view','command-center','network-metrics','trend-analytics','coverage-map',
  'ai-guardian','risk-signals','anomaly-detection','forecasting','recommendations','audit-activity','audit-log','access-control','role-management','consent',
  'notifications','alerts','sms-otp','localization','accessibility','offline-mode','pwa-install','service-worker','data-export','reports',
  'integrations','abdm-connector','e-raktkosh-connector','api-status','connector-health','webhooks','data-sync','security','privacy','compliance',
  'founder-dashboard','programs','campaigns','partners','resource-planning','volunteer-network','help-center','feedback','support','system-status',
  'settings','feature-flags','release-notes','health-check','governance','policy-library','sop-library','analytics','platform-overview','landing',
] as const;

type FeatureProps = { name: string };
function FeaturePage({ name }: FeatureProps): JSX.Element {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  if (!user) { navigate('/'); return null; }
  return <main className="min-h-screen bg-[#030712] p-8 text-white"><h1 className="text-3xl font-black">{name.replaceAll('-', ' ')}</h1><p className="mt-2 text-slate-400">Rakt Kavach feature workspace</p></main>;
}

export const sopRoutes = featureNames.map((name) => ({
  path: `/features/${name}`,
  component: (props: Omit<FeatureProps, 'name'>) => <FeaturePage {...props} name={name} />,
}));

export const sopFeatureCount = sopRoutes.length;
export type SopRole = AuthRole;
