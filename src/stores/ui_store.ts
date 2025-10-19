/**
 * UI Store - Zustand State Management
 * Manages dashboard UI state (modals, panels, notifications, theme)
 */

import { create } from 'zustand';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export interface UIState {
  // Modal states
  isNewProofModalOpen: boolean;
  isSettingsModalOpen: boolean;
  isDetailsModalOpen: boolean;

  // Panel states
  isDetailsPanelOpen: boolean;
  isSidebarOpen: boolean;

  // Notification state
  notifications: Notification[];

  // Theme state
  isDarkMode: boolean;
  themeMode: 'auto' | 'light' | 'dark';

  // Modal actions
  openNewProofModal: () => void;
  closeNewProofModal: () => void;
  toggleNewProofModal: () => void;

  openSettingsModal: () => void;
  closeSettingsModal: () => void;

  openDetailsModal: () => void;
  closeDetailsModal: () => void;

  // Panel actions
  openDetailsPanel: () => void;
  closeDetailsPanel: () => void;
  toggleDetailsPanel: () => void;

  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;

  // Notification actions
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;

  // Theme actions
  setThemeMode: (mode: 'auto' | 'light' | 'dark') => void;
  toggleDarkMode: () => void;
  setDarkMode: (isDark: boolean) => void;

  // Utilities
  reset: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  // Initial state
  isNewProofModalOpen: false,
  isSettingsModalOpen: false,
  isDetailsModalOpen: false,
  isDetailsPanelOpen: false,
  isSidebarOpen: true,
  notifications: [],
  isDarkMode: false,
  themeMode: 'auto',

  // New Proof Modal
  openNewProofModal: () => {
    set({ isNewProofModalOpen: true });
  },

  closeNewProofModal: () => {
    set({ isNewProofModalOpen: false });
  },

  toggleNewProofModal: () => {
    set((state) => ({
      isNewProofModalOpen: !state.isNewProofModalOpen,
    }));
  },

  // Settings Modal
  openSettingsModal: () => {
    set({ isSettingsModalOpen: true });
  },

  closeSettingsModal: () => {
    set({ isSettingsModalOpen: false });
  },

  // Details Modal
  openDetailsModal: () => {
    set({ isDetailsModalOpen: true });
  },

  closeDetailsModal: () => {
    set({ isDetailsModalOpen: false });
  },

  // Details Panel
  openDetailsPanel: () => {
    set({ isDetailsPanelOpen: true });
  },

  closeDetailsPanel: () => {
    set({ isDetailsPanelOpen: false });
  },

  toggleDetailsPanel: () => {
    set((state) => ({
      isDetailsPanelOpen: !state.isDetailsPanelOpen,
    }));
  },

  // Sidebar
  openSidebar: () => {
    set({ isSidebarOpen: true });
  },

  closeSidebar: () => {
    set({ isSidebarOpen: false });
  },

  toggleSidebar: () => {
    set((state) => ({
      isSidebarOpen: !state.isSidebarOpen,
    }));
  },

  // Notifications
  addNotification: (notification) => {
    const id = `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newNotification: Notification = {
      ...notification,
      id,
    };

    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }));

    // Auto-remove after duration (default 5s)
    if (notification.duration !== Infinity) {
      const duration = notification.duration ?? 5000;
      setTimeout(() => {
        get().removeNotification(id);
      }, duration);
    }
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  clearNotifications: () => {
    set({
      notifications: [],
    });
  },

  // Theme
  setThemeMode: (mode) => {
    set({ themeMode: mode });
    // Persist to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme-mode', mode);
    }
  },

  toggleDarkMode: () => {
    set((state) => ({
      isDarkMode: !state.isDarkMode,
    }));
    if (typeof window !== 'undefined') {
      localStorage.setItem('dark-mode', String(!get().isDarkMode));
    }
  },

  setDarkMode: (isDark) => {
    set({ isDarkMode: isDark });
    if (typeof window !== 'undefined') {
      localStorage.setItem('dark-mode', String(isDark));
    }
  },

  // Reset all UI state
  reset: () => {
    set({
      isNewProofModalOpen: false,
      isSettingsModalOpen: false,
      isDetailsModalOpen: false,
      isDetailsPanelOpen: false,
      isSidebarOpen: true,
      notifications: [],
      isDarkMode: false,
      themeMode: 'auto',
    });
  },
}));

// Initialize theme from localStorage
export const initializeTheme = () => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('theme-mode') as 'auto' | 'light' | 'dark' | null;
    const savedDarkMode = localStorage.getItem('dark-mode') === 'true';

    if (savedTheme) {
      useUIStore.setState({ themeMode: savedTheme });
    }

    useUIStore.setState({ isDarkMode: savedDarkMode });
  }
};
