import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

const useSessionStore = create(immer((set) => ({
  session: null,
  loading: true,
  error: null,

  setSession: (session) => set((state) => {
    state.session = session;
    state.loading = false;
  }),

  clearSession: () => set((state) => {
    state.session = null;
    state.loading = false;
  }),

})));

export default useSessionStore;
