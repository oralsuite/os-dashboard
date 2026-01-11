'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { LoadingScreen } from '@/components/ui';

export default function HomePage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleAuth = async () => {
      // Check for token in URL (coming from landing page)
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');

      if (token) {
        // Store the token
        api.setToken(token);
        // Clean URL
        window.history.replaceState({}, document.title, '/');
        // Small delay to ensure localStorage is updated
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Check if we have a valid token
      const storedToken = api.getToken();

      if (storedToken) {
        // Go to dashboard
        router.replace('/dashboard');
      } else {
        // Redirect to landing for login
        const landingUrl = process.env.NEXT_PUBLIC_LANDING_URL || 'http://localhost:3200';
        window.location.href = `${landingUrl}/login`;
      }

      setIsProcessing(false);
    };

    handleAuth();
  }, [router]);

  return <LoadingScreen />;
}
