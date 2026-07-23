import { create } from "zustand";

interface UIState {
  isSidebarOpen: boolean;
  isMobileSidebarOpen: boolean;
  theme: "light" | "dark";
  toggleSidebar: () => void;
  toggleMobileSidebar: () => void;
  setTheme: (theme: "light" | "dark") => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: true,
  isMobileSidebarOpen: false,
  theme: "dark",

  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  toggleMobileSidebar: () =>
    set((state) => ({
      isMobileSidebarOpen: !state.isMobileSidebarOpen,
    })),

  setTheme: (theme) => set({ theme }),
}));
