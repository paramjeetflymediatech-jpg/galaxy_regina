import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Panel | Galaxy Movers Regina',
  description:
    'Admin panel for Galaxy Movers Regina with login, signup, and dashboard management.',
  keywords: ['admin', 'panel', 'Galaxy Movers Regina', 'login', 'signup', 'dashboard'],
  openGraph: {
    title: 'Admin Panel | Galaxy Movers Regina',
    description:
      'Secure admin panel for managing Galaxy Movers Regina website content.',
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
