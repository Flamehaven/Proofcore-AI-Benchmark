/**
 * Hybrid Reasoning Dashboard (Material Design 3) - REFACTORED WITH ZUSTAND
 *
 * Migration Status: Template/Reference Implementation
 * This file shows the refactored version using Zustand stores.
 * Copy patterns from here to update the actual HybridDashboardM3.tsx
 *
 * Key Changes:
 * 1. Removed all useState calls
 * 2. Added Zustand store imports
 * 3. Replaced props drilling with direct store access
 * 4. Updated event handlers to use store actions
 * 5. Simplified component logic
 */

import { useMemo } from 'react';
import styled from '@emotion/styled';

// NEW: Import Zustand stores
import { useProofStore } from '../stores/proof_store';
import { useUIStore } from '../stores/ui_store';
import { useNotifications, useEvaluationWorkflow } from '../stores/hooks';

import type { HybridStepResult } from '../core/hybrid_engine';
import { JustificationAnalyzer } from '../core/justification_analyzer';
import { FeedbackGenerator } from '../core/feedback_generator';
import { M3ThemeProvider, useM3Theme } from '../design-system/themes/M3ThemeProvider';
import { MetricCard, Table, StatusBadge, Timeline, Alert, AlertStack, JustificationGraphD3 } from '../design-system/components/m3';
import type { TimelineItem } from '../design-system/components/m3';

const analyzer = new JustificationAnalyzer();
const feedbackGenerator = new FeedbackGenerator();

// Mock data (unchanged)
const mockResults: HybridStepResult[] = [
  {
    stepId: 'Step 1',
    symbolic: { valid: true, diagnostics: 'Initial Hypothesis' },
    consensus: {
      results: [
        { model: 'GPT-4o', score: 84, rationale: 'Consistent reasoning' },
        { model: 'Claude-3.5', score: 80, rationale: 'Aligns with theorem usage' },
      ],
      mean: 82,
      variance: 20,
      coherence: 90,
    },
    lii: 86,
    lci: [78, 92],
    pass: true,
  },
  // ... other mock results (keep existing)
];

// STYLED COMPONENTS (Keep all existing styles)
const PageContainer = styled.div(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: theme.colors?.background || '#ffffff',
  display: 'flex',
  flexDirection: 'column',
  animation: 'fadeIn 0.3s ease-in-out',

  '@keyframes fadeIn': {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
}));

const Header = styled.header(({ theme }) => ({
  backgroundColor: theme.colors?.surface || '#f5f5f5',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `0 ${theme.spacing?.(3) || '24px'}`,
  height: '64px',
  borderBottom: `1px solid ${theme.colors?.outlineVariant || '#e0e0e0'}`,
}));

const LogoSection = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing?.(2) || '16px',
}));

const Logo = styled.div(({ theme }) => ({
  width: '32px',
  height: '32px',
  backgroundColor: theme.colors?.primary || '#6200ea',
  borderRadius: theme.borderRadius?.sm || '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.colors?.onPrimary || '#ffffff',
  fontWeight: 700,
  fontSize: '16px',
}));

const AppTitle = styled.h1(({ theme }) => ({
  fontSize: '20px',
  fontWeight: 600,
  color: theme.colors?.onSurface || '#000000',
  margin: 0,
}));

const ContentArea = styled.main(({ theme }) => ({
  flex: 1,
  display: 'grid',
  gridTemplateColumns: '1fr 300px',
  gap: theme.spacing?.(3) || '24px',
  padding: theme.spacing?.(3) || '24px',
  overflow: 'auto',

  '@media (max-width: 1200px)': {
    gridTemplateColumns: '1fr',
  },
}));

const MetricsGrid = styled.div(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: theme.spacing?.(2) || '16px',
  marginBottom: theme.spacing?.(3) || '24px',
}));

const StepTimeline = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing?.(2) || '16px',
}));

const DetailsPanel = styled.aside(({ theme }) => ({
  backgroundColor: theme.colors?.surface || '#f5f5f5',
  borderLeft: `1px solid ${theme.colors?.outlineVariant || '#e0e0e0'}`,
  padding: theme.spacing?.(2) || '16px',
  overflow: 'auto',
  maxHeight: 'calc(100vh - 64px)',
}));

const LoadingOverlay = styled.div(({ theme }) => ({
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,

  '&::after': {
    content: '""',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: `4px solid ${theme.colors?.primary || '#6200ea'}`,
    borderTopColor: 'transparent',
    animation: 'spin 0.8s linear infinite',
  },

  '@keyframes spin': {
    to: { transform: 'rotate(360deg)' },
  },
}));

/**
 * REFACTORED MAIN COMPONENT
 *
 * OLD: useState calls removed
 * NEW: Zustand store hooks used throughout
 */
export function HybridDashboardM3() {
  // ===== ZUSTAND STORES =====
  // OLD: const [results, setResults] = useState([]);
  // NEW: Access from proof store
  const {
    evaluationResults,
    isEvaluating,
    evaluationError,
    selectedStepId,
    selectStep,
    setEvaluationResult,
    setEvaluationError,
  } = useProofStore();

  // OLD: const [showDetailsPanel, setShowDetailsPanel] = useState(false);
  // NEW: Access from UI store
  const {
    isDetailsPanelOpen,
    openDetailsPanel,
    closeDetailsPanel,
  } = useUIStore();

  // NEW: Notifications from UI store
  const { notifications, removeNotification } = useNotifications();

  // NEW: High-level workflow hook
  const { evaluate } = useEvaluationWorkflow();

  // ===== INITIALIZATION =====
  // Initialize with mock data if needed
  useMemo(() => {
    if (evaluationResults.length === 0) {
      const mockEvaluation = {
        valid: true,
        lii: 85,
        coherence: 90,
        depth: 2,
        cycles: 0,
        steps: mockResults.map((r) => ({
          id: r.stepId,
          ...r,
        })),
        feedback: [
          'Proof structure is valid',
          'All steps properly justified',
          'No circular reasoning detected',
        ],
      };
      setEvaluationResult('demo-proof', mockEvaluation as any);
    }
  }, []);

  // ===== EVENT HANDLERS =====
  // OLD: Complex setState logic
  // NEW: Use workflow hooks
  const handleEvaluate = async (proof: any) => {
    try {
      const proofId = `proof_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await evaluate(proof, proofId);
    } catch (error) {
      // Error already handled by workflow hook
      console.error('Evaluation failed:', error);
    }
  };

  // OLD: setSelectedStep(stepId); setShowDetailsPanel(true);
  // NEW: Use store actions
  const handleSelectStep = (stepId: number | string) => {
    selectStep(typeof stepId === 'string' ? parseInt(stepId) : stepId);
    openDetailsPanel();
  };

  // OLD: setShowDetailsPanel(false);
  // NEW: Use store action
  const handleClosePanel = () => {
    closeDetailsPanel();
  };

  // ===== RENDER =====
  const displayResults = evaluationResults.length > 0 ? evaluationResults : (mockResults as any);

  return (
    <PageContainer>
      <Header>
        <LogoSection>
          <Logo>PC</Logo>
          <AppTitle>ProofCore AI Benchmark</AppTitle>
        </LogoSection>
      </Header>

      {/* NEW: Notifications from store */}
      <AlertStack>
        {notifications.map((notification) => (
          <Alert
            key={notification.id}
            type={notification.type}
            message={notification.message}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </AlertStack>

      <ContentArea>
        <div>
          {/* Metrics Cards - Display from store */}
          <MetricsGrid>
            <MetricCard
              label="Overall LII Score"
              value={displayResults[0]?.lii || '-'}
              unit="%"
              status={isEvaluating ? 'loading' : 'default'}
            />
            <MetricCard
              label="Coherence"
              value={displayResults[0]?.coherence || '-'}
              unit="%"
            />
            <MetricCard
              label="Steps Verified"
              value={displayResults.length}
            />
            <MetricCard
              label="Circular Reasoning"
              value={displayResults[0]?.cycles || 0}
              status={displayResults[0]?.cycles > 0 ? 'error' : 'success'}
            />
          </MetricsGrid>

          {/* Step Timeline - Direct store access */}
          <StepTimeline>
            {displayResults.map((result: any, idx: number) => (
              <TimelineItem
                key={result.stepId || idx}
                title={result.stepId}
                description={result.consensus?.results?.[0]?.rationale || result.symbolic?.diagnostics}
                status={result.pass ? 'success' : 'error'}
                onClick={() => handleSelectStep(result.stepId)}
                isSelected={selectedStepId === result.stepId}
                isActive={isEvaluating}
              />
            ))}
          </StepTimeline>
        </div>

        {/* Details Panel - NEW: No props needed */}
        {isDetailsPanelOpen && (
          <DetailsPanelComponent
            onClose={handleClosePanel}
          />
        )}
      </ContentArea>

      {/* Loading State - From store */}
      {isEvaluating && (
        <LoadingOverlay />
      )}

      {/* Error Banner - From store */}
      {evaluationError && (
        <Alert
          type="error"
          message={evaluationError}
          onClose={() => setEvaluationError(null)}
        />
      )}
    </PageContainer>
  );
}

/**
 * NEW: Details Panel as Separate Component
 * Accesses store directly - no props drilling
 */
function DetailsPanelComponent({ onClose }: { onClose: () => void }) {
  // NEW: Direct store access (no props)
  const { evaluationResults, selectedStepId, selectStep } = useProofStore();

  const selectedResult = evaluationResults.find(
    (r) => r.id === selectedStepId
  );

  return (
    <DetailsPanel>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>Step Details</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>
          ×
        </button>
      </div>

      {selectedResult ? (
        <div>
          <div style={{ marginBottom: '12px' }}>
            <strong>{selectedResult.stepId}</strong>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <p><strong>Status:</strong> {selectedResult.pass ? 'Valid' : 'Invalid'}</p>
            <p><strong>LII Score:</strong> {selectedResult.lii}%</p>
            <p><strong>Coherence:</strong> {selectedResult.coherence}%</p>
          </div>
          {selectedResult.consensus?.results && (
            <div>
              <strong>Consensus:</strong>
              <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                {selectedResult.consensus.results.map((result: any) => (
                  <li key={result.model}>
                    {result.model}: {result.score}% - {result.rationale}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <p>Select a step to view details</p>
      )}
    </DetailsPanel>
  );
}

// Re-export for use in routes
export default HybridDashboardM3;
