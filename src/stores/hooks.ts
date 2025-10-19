/**
 * Custom Store Hooks
 * Combines proof and UI stores for common operations
 */

import { useProofStore } from './proof_store';
import { useUIStore } from './ui_store';
import { useCreateRun } from '../api/hooks';
import type { ProofInput } from '../core/proof_engine';

/**
 * Hook for evaluation workflow
 * Combines proof evaluation and UI notifications
 */
export function useEvaluationWorkflow() {
  const {
    setCurrentProof,
    setEvaluating,
    setEvaluationResult,
    setEvaluationError,
    getCurrentProofResult,
  } = useProofStore();

  const { addNotification, openDetailsPanel } = useUIStore();
  const createRunMutation = useCreateRun();

  const evaluate = async (proof: ProofInput, proofId: string) => {
    setEvaluating(true);
    setCurrentProof(proof, proofId);

    try {
      addNotification({
        type: 'info',
        message: 'Starting proof evaluation...',
        duration: 3000,
      });

      // Call API via React Query
      const result = await createRunMutation.mutateAsync({
        domain: proof.domain,
        steps: proof.steps,
      });

      // Store result
      setEvaluationResult(proofId, result as any);

      // Show success notification
      addNotification({
        type: 'success',
        message: 'Proof evaluated successfully!',
        duration: 5000,
      });

      // Open details panel to show results
      openDetailsPanel();

      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      setEvaluationError(errorMessage);

      addNotification({
        type: 'error',
        message: `Evaluation failed: ${errorMessage}`,
        duration: 7000,
      });

      throw error;
    }
  };

  return {
    evaluate,
    isEvaluating: useProofStore((s) => s.isEvaluating),
    error: useProofStore((s) => s.evaluationError),
    result: getCurrentProofResult(),
  };
}

/**
 * Hook for proof input management
 */
export function useProofInput() {
  const {
    currentProof,
    currentProofId,
    setCurrentProof,
    clearCurrentProof,
    addProof,
  } = useProofStore();

  const { addNotification } = useUIStore();

  const createNewProof = (proof: ProofInput) => {
    try {
      const id = addProof(proof);
      setCurrentProof(proof, id);

      addNotification({
        type: 'success',
        message: 'New proof created',
        duration: 3000,
      });

      return id;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to create proof';
      addNotification({
        type: 'error',
        message: errorMessage,
      });
      throw error;
    }
  };

  const updateCurrentProof = (updates: Partial<ProofInput>) => {
    if (!currentProof || !currentProofId) {
      addNotification({
        type: 'warning',
        message: 'No proof selected',
      });
      return;
    }

    const updated = { ...currentProof, ...updates };
    setCurrentProof(updated, currentProofId);
  };

  return {
    currentProof,
    currentProofId,
    createNewProof,
    updateCurrentProof,
    clearCurrentProof,
  };
}

/**
 * Hook for UI state management (simplified)
 */
export function useDashboardUI() {
  const {
    isNewProofModalOpen,
    isSettingsModalOpen,
    isDetailsModalOpen,
    isDetailsPanelOpen,
    isSidebarOpen,
    openNewProofModal,
    closeNewProofModal,
    openSettingsModal,
    closeSettingsModal,
    openDetailsPanel,
    closeDetailsPanel,
    toggleSidebar,
  } = useUIStore();

  return {
    // States
    isNewProofModalOpen,
    isSettingsModalOpen,
    isDetailsModalOpen,
    isDetailsPanelOpen,
    isSidebarOpen,
    // Actions
    openNewProofModal,
    closeNewProofModal,
    openSettingsModal,
    closeSettingsModal,
    openDetailsPanel,
    closeDetailsPanel,
    toggleSidebar,
  };
}

/**
 * Hook for notifications
 */
export function useNotifications() {
  const { notifications, addNotification, removeNotification, clearNotifications } =
    useUIStore();

  return {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
  };
}

/**
 * Hook for theme management
 */
export function useTheme() {
  const { isDarkMode, themeMode, setDarkMode, setThemeMode } = useUIStore();

  return {
    isDarkMode,
    themeMode,
    setDarkMode,
    setThemeMode,
    toggleDarkMode: () => setDarkMode(!isDarkMode),
  };
}
