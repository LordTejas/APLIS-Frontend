import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

const useDashboardStore = create(immer((set) => ({
  menu: 'courses',
  subMenu: null,
  courseId: null,
  moduleId: null,
  contentId: null,
  
  setMenu: (menu) => set((state) => {state.menu = menu}),
  setSubMenu: (subMenu) => set((state) => {state.subMenu = subMenu}),
  setCourseId: (courseId) => set((state) => {state.courseId = courseId}),
  setModuleId: (moduleId) => set((state) => {state.moduleId = moduleId}),
  setContentId: (contentId) => set((state) => {state.contentId = contentId}),

})));


export default useDashboardStore; 