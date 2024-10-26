'use client';

import { useEffect } from 'react';
import { getUserFromToken } from '@/actions/auth';
import useUserStore from '../session.zustand';
import { useRouter } from 'next/navigation';

const useAuth = () => {

  const router = useRouter();
  const { setUser } = useUserStore();

  useEffect(() => {
    const user = getUserFromToken();

    if (user) {
      setUser(user);
    } else {
      router.push('/signin');
    }
  }, []);
};

export default useAuth;
