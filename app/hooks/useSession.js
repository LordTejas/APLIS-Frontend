'use client';

import { useEffect } from 'react';
import { getSession } from '@/actions/auth';
import useSessionStore from '@/app/session.zustand';

const useSession = () => {
  const { session, loading, error, setSession } = useSessionStore();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const session = await getSession();
        setSession(session);
      } catch (error) {
        console.error('Error fetching session:', error);
      }
    };

    // Fetch session if not already set
    if (!session) {
      fetchSession();
    }

  }, [setSession]);

  return { session, loading, error };
};

export default useSession;