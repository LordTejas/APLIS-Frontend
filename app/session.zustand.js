import { create } from 'zustand';
import { getSessionFromToken } from '../actions/auth';

const useSessionStore = create((set) => ({
  session: null,
  loading: true,
  error: null,

  fetchSession: async () => {
    try {
      const session = await getSessionFromToken();
      set({ session, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));

export const useSession = () => {
  const { session, loading, error, fetchSession } = useSessionStore();
  return { session, loading, error, fetchSession };
};  
