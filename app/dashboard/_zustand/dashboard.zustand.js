import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

const useDashboardStore = create(immer((set) => ({
  menu: 'courses',
  subMenu: null,

  setMenu: (menu) => set((state) => {state.menu = menu}),
  setSubMenu: (subMenu) => set((state) => {state.subMenu = subMenu}),
})));


export default useDashboardStore; 