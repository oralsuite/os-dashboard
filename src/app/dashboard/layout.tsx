'use client';

import { useEffect } from 'react';
import { AuthProvider, useAuth } from '@/lib/auth';
import { SocketProvider } from '@/lib/socket';
import { NotificationProvider } from '@/lib/notifications';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { LoadingScreen } from '@/components/ui';

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      const landingUrl = process.env.NEXT_PUBLIC_LANDING_URL || 'http://localhost:3200';
      window.location.href = `${landingUrl}/login`;
    }
  }, [loading, user]);

  if (loading || !user) {
    return <LoadingScreen />;
  }

  return (
    <SocketProvider>
      <NotificationProvider>
        <div className="min-h-screen bg-gray-50">
          <Sidebar />
          <div className="pl-64">
            <Header />
            <main className="p-6">{children}</main>
          </div>
        </div>
      </NotificationProvider>
    </SocketProvider>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </AuthProvider>
  );
}
