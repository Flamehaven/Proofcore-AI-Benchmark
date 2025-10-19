/**
 * UI Store Tests
 * Validates Zustand UI state management
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useUIStore } from '../../stores/ui_store';

describe('UI Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    useUIStore.getState().reset();
  });

  describe('Modal Management', () => {
    it('should open/close new proof modal', () => {
      expect(useUIStore.getState().isNewProofModalOpen).toBe(false);

      useUIStore.getState().openNewProofModal();
      expect(useUIStore.getState().isNewProofModalOpen).toBe(true);

      useUIStore.getState().closeNewProofModal();
      expect(useUIStore.getState().isNewProofModalOpen).toBe(false);
    });

    it('should toggle new proof modal', () => {
      useUIStore.getState().toggleNewProofModal();
      expect(useUIStore.getState().isNewProofModalOpen).toBe(true);

      useUIStore.getState().toggleNewProofModal();
      expect(useUIStore.getState().isNewProofModalOpen).toBe(false);
    });

    it('should open/close settings modal', () => {
      expect(useUIStore.getState().isSettingsModalOpen).toBe(false);

      useUIStore.getState().openSettingsModal();
      expect(useUIStore.getState().isSettingsModalOpen).toBe(true);

      useUIStore.getState().closeSettingsModal();
      expect(useUIStore.getState().isSettingsModalOpen).toBe(false);
    });

    it('should open/close details modal', () => {
      expect(useUIStore.getState().isDetailsModalOpen).toBe(false);

      useUIStore.getState().openDetailsModal();
      expect(useUIStore.getState().isDetailsModalOpen).toBe(true);

      useUIStore.getState().closeDetailsModal();
      expect(useUIStore.getState().isDetailsModalOpen).toBe(false);
    });
  });

  describe('Panel Management', () => {
    it('should open/close details panel', () => {
      expect(useUIStore.getState().isDetailsPanelOpen).toBe(false);

      useUIStore.getState().openDetailsPanel();
      expect(useUIStore.getState().isDetailsPanelOpen).toBe(true);

      useUIStore.getState().closeDetailsPanel();
      expect(useUIStore.getState().isDetailsPanelOpen).toBe(false);
    });

    it('should toggle details panel', () => {
      useUIStore.getState().toggleDetailsPanel();
      expect(useUIStore.getState().isDetailsPanelOpen).toBe(true);

      useUIStore.getState().toggleDetailsPanel();
      expect(useUIStore.getState().isDetailsPanelOpen).toBe(false);
    });

    it('should open/close sidebar', () => {
      expect(useUIStore.getState().isSidebarOpen).toBe(true);

      useUIStore.getState().closeSidebar();
      expect(useUIStore.getState().isSidebarOpen).toBe(false);

      useUIStore.getState().openSidebar();
      expect(useUIStore.getState().isSidebarOpen).toBe(true);
    });

    it('should toggle sidebar', () => {
      useUIStore.getState().toggleSidebar();
      expect(useUIStore.getState().isSidebarOpen).toBe(false);

      useUIStore.getState().toggleSidebar();
      expect(useUIStore.getState().isSidebarOpen).toBe(true);
    });
  });

  describe('Notification Management', () => {
    it('should add notification', () => {
      useUIStore.getState().addNotification({
        type: 'success',
        message: 'Test notification',
      });

      const notifications = useUIStore.getState().notifications;
      expect(notifications).toHaveLength(1);
      expect(notifications[0].type).toBe('success');
      expect(notifications[0].message).toBe('Test notification');
      expect(notifications[0].id).toBeDefined();
    });

    it('should add multiple notifications', () => {
      useUIStore.getState().addNotification({ type: 'success', message: 'Success' });
      useUIStore.getState().addNotification({ type: 'error', message: 'Error' });
      useUIStore.getState().addNotification({ type: 'warning', message: 'Warning' });

      expect(useUIStore.getState().notifications).toHaveLength(3);
    });

    it('should remove notification by id', () => {
      useUIStore.getState().addNotification({ type: 'success', message: 'First' });
      const firstId = useUIStore.getState().notifications[0].id;

      useUIStore.getState().addNotification({ type: 'error', message: 'Second' });

      useUIStore.getState().removeNotification(firstId);

      const notifications = useUIStore.getState().notifications;
      expect(notifications).toHaveLength(1);
      expect(notifications[0].message).toBe('Second');
    });

    it('should clear all notifications', () => {
      useUIStore.getState().addNotification({ type: 'success', message: 'First' });
      useUIStore.getState().addNotification({ type: 'error', message: 'Second' });

      expect(useUIStore.getState().notifications).toHaveLength(2);

      useUIStore.getState().clearNotifications();

      expect(useUIStore.getState().notifications).toHaveLength(0);
    });

    it('should auto-remove notification after duration', async () => {
      vi.useFakeTimers();

      useUIStore.getState().addNotification({
        type: 'success',
        message: 'Auto-remove test',
        duration: 1000,
      });

      expect(useUIStore.getState().notifications).toHaveLength(1);

      vi.advanceTimersByTime(1100);

      expect(useUIStore.getState().notifications).toHaveLength(0);

      vi.useRealTimers();
    });

    it('should not auto-remove notification with infinite duration', async () => {
      vi.useFakeTimers();

      useUIStore.getState().addNotification({
        type: 'success',
        message: 'Persistent notification',
        duration: Infinity,
      });

      vi.advanceTimersByTime(10000);

      expect(useUIStore.getState().notifications).toHaveLength(1);

      vi.useRealTimers();
    });

    it('should use default duration of 5s', async () => {
      vi.useFakeTimers();

      useUIStore.getState().addNotification({
        type: 'info',
        message: 'Default duration',
      });

      expect(useUIStore.getState().notifications).toHaveLength(1);

      vi.advanceTimersByTime(5100);

      expect(useUIStore.getState().notifications).toHaveLength(0);

      vi.useRealTimers();
    });
  });

  describe('Theme Management', () => {
    it('should set theme mode', () => {
      useUIStore.getState().setThemeMode('dark');
      expect(useUIStore.getState().themeMode).toBe('dark');

      useUIStore.getState().setThemeMode('light');
      expect(useUIStore.getState().themeMode).toBe('light');

      useUIStore.getState().setThemeMode('auto');
      expect(useUIStore.getState().themeMode).toBe('auto');
    });

    it('should toggle dark mode', () => {
      expect(useUIStore.getState().isDarkMode).toBe(false);

      useUIStore.getState().toggleDarkMode();
      expect(useUIStore.getState().isDarkMode).toBe(true);

      useUIStore.getState().toggleDarkMode();
      expect(useUIStore.getState().isDarkMode).toBe(false);
    });

    it('should set dark mode explicitly', () => {
      useUIStore.getState().setDarkMode(true);
      expect(useUIStore.getState().isDarkMode).toBe(true);

      useUIStore.getState().setDarkMode(false);
      expect(useUIStore.getState().isDarkMode).toBe(false);
    });

    it('should persist theme to localStorage', () => {
      const localStorageMock = {
        data: {} as Record<string, string>,
        getItem(key: string) {
          return this.data[key] ?? null;
        },
        setItem(key: string, value: string) {
          this.data[key] = value;
        },
        removeItem(key: string) {
          delete this.data[key];
        },
      };

      vi.stubGlobal('localStorage', localStorageMock);

      useUIStore.getState().setThemeMode('dark');
      expect(localStorageMock.data['theme-mode']).toBe('dark');

      useUIStore.getState().setDarkMode(true);
      expect(localStorageMock.data['dark-mode']).toBe('true');

      vi.unstubAllGlobals();
    });
  });

  describe('State Reset', () => {
    it('should reset all UI state', () => {
      // Set various states
      useUIStore.getState().openNewProofModal();
      useUIStore.getState().openSettingsModal();
      useUIStore.getState().toggleDetailsPanel();
      useUIStore.getState().closeSidebar();
      useUIStore.getState().addNotification({ type: 'success', message: 'Test' });
      useUIStore.getState().setDarkMode(true);

      // Verify states are set
      const stateBefore = useUIStore.getState();
      expect(stateBefore.isNewProofModalOpen).toBe(true);
      expect(stateBefore.isSettingsModalOpen).toBe(true);
      expect(stateBefore.isDetailsPanelOpen).toBe(true);
      expect(stateBefore.isSidebarOpen).toBe(false);
      expect(stateBefore.notifications).toHaveLength(1);
      expect(stateBefore.isDarkMode).toBe(true);

      // Reset
      useUIStore.getState().reset();

      // Verify all reset to defaults
      const stateAfter = useUIStore.getState();
      expect(stateAfter.isNewProofModalOpen).toBe(false);
      expect(stateAfter.isSettingsModalOpen).toBe(false);
      expect(stateAfter.isDetailsModalOpen).toBe(false);
      expect(stateAfter.isDetailsPanelOpen).toBe(false);
      expect(stateAfter.isSidebarOpen).toBe(true);
      expect(stateAfter.notifications).toHaveLength(0);
      expect(stateAfter.isDarkMode).toBe(false);
      expect(stateAfter.themeMode).toBe('auto');
    });
  });

  describe('Real-world Workflows', () => {
    it('should handle complete UI workflow', () => {
      // User opens new proof modal
      useUIStore.getState().openNewProofModal();
      expect(useUIStore.getState().isNewProofModalOpen).toBe(true);

      // Modal closes after form submission
      useUIStore.getState().closeNewProofModal();
      expect(useUIStore.getState().isNewProofModalOpen).toBe(false);

      // Show success notification
      useUIStore.getState().addNotification({
        type: 'success',
        message: 'Proof created',
      });

      // Open details panel to show results
      useUIStore.getState().openDetailsPanel();
      expect(useUIStore.getState().isDetailsPanelOpen).toBe(true);

      // Verify final state
      const state = useUIStore.getState();
      expect(state.notifications).toHaveLength(1);
      expect(state.isDetailsPanelOpen).toBe(true);
    });

    it('should handle error notification workflow', () => {
      // Start operation (show info)
      useUIStore.getState().addNotification({
        type: 'info',
        message: 'Loading...',
        duration: Infinity,
      });

      // Operation fails (clear and add error)
      useUIStore.getState().clearNotifications();
      useUIStore.getState().addNotification({
        type: 'error',
        message: 'Operation failed',
        duration: 7000,
      });

      const notifications = useUIStore.getState().notifications;
      expect(notifications).toHaveLength(1);
      expect(notifications[0].type).toBe('error');
    });

    it('should handle theme switching workflow', () => {
      // Auto mode initially
      expect(useUIStore.getState().themeMode).toBe('auto');

      // User switches to dark
      useUIStore.getState().setThemeMode('dark');
      useUIStore.getState().setDarkMode(true);

      expect(useUIStore.getState().themeMode).toBe('dark');
      expect(useUIStore.getState().isDarkMode).toBe(true);

      // User toggles back to light
      useUIStore.getState().setThemeMode('light');
      useUIStore.getState().setDarkMode(false);

      expect(useUIStore.getState().themeMode).toBe('light');
      expect(useUIStore.getState().isDarkMode).toBe(false);
    });
  });
});
