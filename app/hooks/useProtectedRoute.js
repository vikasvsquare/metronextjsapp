// hooks/useProtectedRoute.js
'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const useProtectedRoute = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Do nothing while loading
    if (!session) router.push('/login');
  }, [session, status, router]);

  return { session, status };
};

export default useProtectedRoute;
