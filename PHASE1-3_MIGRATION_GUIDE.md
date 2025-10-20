# Phase 1-3: Component Migration Guide

**Status**: Guide + Template Provided
**Target Components**: HybridDashboardM3.tsx, Settings.tsx
**Estimated Time**: 2-3 hours implementation
**Complexity**: Medium

---

## Overview

This guide provides step-by-step instructions for migrating existing React components from `useState`/`useContext` to Zustand stores and OpenAPI type-safe API calls.

---

## Migration Pattern: Before vs After

### Before: useState + useContext (Props Drilling)

```typescript
// HybridDashboardM3.tsx (OLD)
import { useState } from 'react';

export function HybridDashboardM3() {
  const [results, setResults] = useState<HybridStepResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStep, setSelectedStep] = useState<number | null>(null);
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);

  const handleEvaluate = async (proof: ProofInput) => {
    setLoading(true);
    try {
      const result = await api.evaluateProof(proof);
      setResults(result.steps);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <Header>
        <DetailsPanel
          results={results}
          loading={loading}
          selectedStep={selectedStep}
          onSelectStep={setSelectedStep}
          onClose={() => setShowDetailsPanel(false)}
        />
      </Header>
    </PageContainer>
  );
}
```

**Problems**:
- Props drilling through multiple levels
- Hard to track state changes
- No IDE auto-completion for complex state
- Difficult to debug

### After: Zustand + OpenAPI (Direct Store Access)

```typescript
// HybridDashboardM3.tsx (NEW)
import { useProofStore } from '../stores/proof_store';
import { useUIStore } from '../stores/ui_store';
import { useEvaluationWorkflow } from '../stores/hooks';

export function HybridDashboardM3() {
  // Direct store access - no props needed
  const { evaluationResults, isEvaluating, selectStep, selectedStepId } = useProofStore();
  const { isDetailsPanelOpen, closeDetailsPanel } = useUIStore();
  const { evaluate } = useEvaluationWorkflow();

  const handleEvaluate = async (proof: ProofInput) => {
    // Workflow hook handles: loading, error, notifications, panel opening
    await evaluate(proof, 'proof-123');
  };

  return (
    <PageContainer>
      <Header>
        {/* Components access stores directly - no props needed */}
        <DetailsPanel />
      </Header>
    </PageContainer>
  );
}
```

**Benefits**:
- Zero props drilling
- Automatic optimization (selective re-renders)
- Full type safety with IDE support
- Easy debugging with store inspection

---

## Step-by-Step Migration

### Step 1: Identify State in Component

**For HybridDashboardM3.tsx**, identify all `useState` calls:

```typescript
// Find these patterns:
const [results, setResults] = useState([]);           // → useProofStore
const [loading, setLoading] = useState(false);        // → useProofStore
const [error, setError] = useState(null);             // → useProofStore
const [selectedStep, setSelectedStep] = useState(null);  // → useProofStore
const [showDetailsPanel, setShowDetailsPanel] = useState(false);  // → useUIStore
```

### Step 2: Replace useState with Store Hooks

**Replace**:
```typescript
import { useState } from 'react';

const [results, setResults] = useState([]);
const [loading, setLoading] = useState(false);
```

**With**:
```typescript
import { useProofStore } from '../stores/proof_store';

const {
  evaluationResults: results,
  isEvaluating: loading,
  evaluationError: error,
  selectStep,
  selectedStepId,
  setEvaluationResult,
  setEvaluationError,
} = useProofStore();
```

### Step 3: Update Event Handlers

**Before**:
```typescript
const handleEvaluate = async (proof: ProofInput) => {
  setLoading(true);
  try {
    const result = await api.evaluateProof(proof);
    setResults(result.steps);
    setError(null);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

**After**:
```typescript
const { evaluate } = useEvaluationWorkflow();

const handleEvaluate = async (proof: ProofInput) => {
  try {
    await evaluate(proof, 'proof-123');
    // Automatically handles: loading state, error state, notifications, panel opening
  } catch (err) {
    // Error already handled by workflow hook
  }
};
```

### Step 4: Remove Props from Child Components

**Before**:
```typescript
<DetailsPanel
  results={results}
  loading={loading}
  selectedStep={selectedStep}
  onSelectStep={setSelectedStep}
  onClose={() => setShowDetailsPanel(false)}
/>
```

**After**:
```typescript
<DetailsPanel />
```

**In DetailsPanel child**:
```typescript
// DetailsPanel.tsx
import { useProofStore } from '../stores/proof_store';

export function DetailsPanel() {
  // Access stores directly - no props needed
  const { evaluationResults, selectedStepId, selectStep } = useProofStore();

  return (
    <div>
      {evaluationResults.map((result) => (
        <StepItem
          key={result.stepId}
          result={result}
          isSelected={selectedStepId === result.id}
          onSelect={() => selectStep(result.id)}
        />
      ))}
    </div>
  );
}
```

---

## Complete Migration Template for HybridDashboardM3.tsx

### Template: Minimal Refactor (Preserves UI)

```typescript
/**
 * Hybrid Reasoning Dashboard (Material Design 3) - Zustand Refactored
 * Updated to use centralized state management
 */

import { useMemo } from 'react';
import styled from '@emotion/styled';

// Import Zustand stores
import { useProofStore } from '../stores/proof_store';
import { useUIStore } from '../stores/ui_store';
import { useEvaluationWorkflow, useNotifications } from '../stores/hooks';

import type { HybridStepResult } from '../core/hybrid_engine';
import { JustificationAnalyzer } from '../core/justification_analyzer';
import { FeedbackGenerator } from '../core/feedback_generator';
import { M3ThemeProvider, useM3Theme } from '../design-system/themes/M3ThemeProvider';
import { MetricCard, Table, StatusBadge, Timeline, Alert, AlertStack, JustificationGraphD3 } from '../design-system/components/m3';
import type { TimelineItem } from '../design-system/components/m3';

const analyzer = new JustificationAnalyzer();
const feedbackGenerator = new FeedbackGenerator();

// Mock data for demo - can be removed after real API integration
const mockResults: HybridStepResult[] = [
  // ... existing mock data
];

// Styled components (keep existing)
const PageContainer = styled.div(/* ... existing styles ... */);
const Header = styled.header(/* ... existing styles ... */);
// ... rest of styled components

export function HybridDashboardM3() {
  // OLD: Multiple useState calls (removed)
  // NEW: Zustand stores
  const {
    currentProof,
    evaluationResults,
    isEvaluating,
    evaluationError,
    selectStep,
    selectedStepId,
    setEvaluationResult,
  } = useProofStore();

  const {
    isDetailsPanelOpen,
    openDetailsPanel,
    closeDetailsPanel,
    addNotification,
  } = useUIStore();

  const { evaluate } = useEvaluationWorkflow();
  const { notifications, removeNotification } = useNotifications();

  // OLD: setResults(mockResults) style initialization
  // NEW: Initialize store if needed on mount
  useMemo(() => {
    if (evaluationResults.length === 0) {
      // Use mock data or load from API
      const mockResult = {
        valid: true,
        lii: 85,
        coherence: 90,
        depth: 2,
        cycles: 0,
        steps: mockResults,
        feedback: [],
      };
      setEvaluationResult('demo-proof', mockResult);
    }
  }, []);

  // OLD: handleEvaluate with setLoading, setError, etc.
  // NEW: useEvaluationWorkflow handles all state
  const handleEvaluate = async (proof: any) => {
    try {
      const id = `proof_${Date.now()}`;
      await evaluate(proof, id);
    } catch (error) {
      // Error notification already shown by workflow
    }
  };

  const handleStepSelect = (stepId: number) => {
    selectStep(stepId);
    openDetailsPanel();
  };

  const handleCloseDetailsPanel = () => {
    closeDetailsPanel();
  };

  // Get current results to display (either from store or mock)
  const displayResults = evaluationResults.length > 0
    ? evaluationResults
    : mockResults;

  return (
    <PageContainer>
      <Header>
        <LogoSection>
          <Logo>PC</Logo>
          <AppTitle>ProofCore AI Benchmark</AppTitle>
        </LogoSection>
        <HeaderActions>
          {/* Add buttons here */}
        </HeaderActions>
      </Header>

      {/* Notifications Container - No longer need alerts in state */}
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

      {/* Main Content - Components now access stores directly */}
      <ContentArea>
        {/* DetailsPanel now has direct store access */}
        {isDetailsPanelOpen && (
          <DetailsPanel
            results={displayResults}
            selectedStepId={selectedStepId}
            onSelectStep={handleStepSelect}
            onClose={handleCloseDetailsPanel}
          />
        )}

        {/* Step Results Timeline */}
        <StepTimeline>
          {displayResults.map((result) => (
            <TimelineItem
              key={result.stepId}
              title={result.stepId}
              status={result.pass ? 'success' : 'error'}
              onClick={() => handleStepSelect(result.stepId)}
              isSelected={selectedStepId === result.id}
              isLoading={isEvaluating}
            >
              {/* Content */}
            </TimelineItem>
          ))}
        </StepTimeline>

        {/* Metrics Cards - Update to use current store values */}
        <MetricsGrid>
          <MetricCard
            label="Overall LII Score"
            value={evaluationResults[0]?.lii || '-'}
            unit="%"
            status={isEvaluating ? 'loading' : 'default'}
          />
          <MetricCard
            label="Coherence"
            value={evaluationResults[0]?.coherence || '-'}
            unit="%"
            status={isEvaluating ? 'loading' : 'default'}
          />
          <MetricCard
            label="Steps Verified"
            value={displayResults.length}
            status="default"
          />
          <MetricCard
            label="Circular Reasoning"
            value={evaluationResults[0]?.cycles || 0}
            status={evaluationResults[0]?.cycles > 0 ? 'error' : 'success'}
          />
        </MetricsGrid>
      </ContentArea>

      {/* Loading Indicator - Replace old loading state */}
      {isEvaluating && <LoadingOverlay />}

      {/* Error Display - Replace old error state */}
      {evaluationError && (
        <ErrorBanner
          message={evaluationError}
          onDismiss={() => setEvaluationError(null)}
        />
      )}
    </PageContainer>
  );
}

// Child components now access stores directly
function DetailsPanel({
  results,
  selectedStepId,
  onSelectStep,
  onClose,
}: {
  results: HybridStepResult[];
  selectedStepId: number | null;
  onSelectStep: (id: number) => void;
  onClose: () => void;
}) {
  return (
    <DetailsPanelContainer>
      <PanelHeader>
        <h2>Details</h2>
        <CloseButton onClick={onClose}>×</CloseButton>
      </PanelHeader>
      <PanelContent>
        {results.map((result) => (
          <StepDetail
            key={result.stepId}
            result={result}
            isSelected={selectedStepId === result.id}
            onClick={() => onSelectStep(result.id)}
          />
        ))}
      </PanelContent>
    </DetailsPanelContainer>
  );
}
```

---

## Settings.tsx Migration

### Pattern: Theme Store Integration

```typescript
// Settings.tsx (BEFORE)
import { useState } from 'react';

export function Settings() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('auto');
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <div>
      <ThemeSwitcher value={theme} onChange={handleThemeChange} />
      <NotificationToggle value={notifications} onChange={setNotifications} />
      <AutoSaveToggle value={autoSave} onChange={setAutoSave} />
    </div>
  );
}
```

```typescript
// Settings.tsx (AFTER)
import { useTheme } from '../stores/hooks';
import { useUIStore } from '../stores/ui_store';

export function Settings() {
  // Theme management from store (with localStorage persistence)
  const { themeMode, setThemeMode, isDarkMode, setDarkMode } = useTheme();
  const { addNotification } = useUIStore();

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'auto') => {
    setThemeMode(newTheme);
    addNotification({
      type: 'success',
      message: `Theme changed to ${newTheme}`,
      duration: 3000,
    });
  };

  const handleDarkModeToggle = (isDark: boolean) => {
    setDarkMode(isDark);
    addNotification({
      type: 'info',
      message: isDark ? 'Dark mode enabled' : 'Light mode enabled',
      duration: 3000,
    });
  };

  return (
    <SettingsContainer>
      <Section>
        <h3>Theme Settings</h3>
        <ThemeSwitcher
          value={themeMode}
          onChange={handleThemeChange}
        />
        <DarkModeToggle
          checked={isDarkMode}
          onChange={handleDarkModeToggle}
        />
      </Section>
    </SettingsContainer>
  );
}
```

---

## Implementation Checklist

### For HybridDashboardM3.tsx

- [ ] Import Zustand store hooks
- [ ] Remove all `useState` calls
- [ ] Replace with `useProofStore()` and `useUIStore()`
- [ ] Update event handlers to use store actions
- [ ] Remove props from child components
- [ ] Update child components to access stores directly
- [ ] Test all functionality
- [ ] Run tests: `npm test`
- [ ] Verify performance improvements
- [ ] Commit changes

### For Settings.tsx

- [ ] Import theme and UI store hooks
- [ ] Replace theme state with `useTheme()`
- [ ] Update handlers to call store actions
- [ ] Add notifications for user feedback
- [ ] Test localStorage persistence
- [ ] Run tests: `npm test`
- [ ] Commit changes

---

## Testing After Migration

### Unit Tests

```typescript
// tests/HybridDashboardM3.test.ts
import { render, screen } from '@testing-library/react';
import { HybridDashboardM3 } from '../src/pages/HybridDashboardM3';

describe('HybridDashboardM3 (Zustand Refactored)', () => {
  it('should access proof store directly', () => {
    render(<HybridDashboardM3 />);
    // Component should display results from store
    expect(screen.getByText(/ProofCore/)).toBeInTheDocument();
  });

  it('should handle step selection through store', () => {
    render(<HybridDashboardM3 />);
    // Click step → selectStep called → store updated
    const stepButton = screen.getByRole('button', { name: /Step 1/ });
    stepButton.click();
    // Verify store state updated
  });

  it('should show notifications from UI store', () => {
    render(<HybridDashboardM3 />);
    // Notifications from addNotification should appear
  });
});
```

### Integration Tests

```bash
# Run full test suite
npm test

# Run specific component tests
npm test -- HybridDashboardM3
npm test -- Settings
```

### Manual Testing

1. **Theme Switching**: Verify theme persists in localStorage
2. **State Synchronization**: Open DevTools → Check store state
3. **Performance**: Use Chrome DevTools Performance tab → Measure re-renders
4. **Error Handling**: Trigger errors → Verify notifications

---

## Performance Verification

### Before (useState)
```
Re-renders when: ANY state changes
Child re-renders: ALL children with props
Bundle size: Baseline
```

### After (Zustand)
```
Re-renders when: ONLY subscribed store values change
Child re-renders: ONLY affected children
Bundle size: +10.8KB (acceptable trade-off)
```

**Measure with Chrome DevTools**:
1. Open DevTools → Performance tab
2. Record interaction
3. Compare re-render counts (should decrease)

---

## Common Issues & Solutions

### Issue: "useProofStore is not defined"
**Solution**: Import from correct path
```typescript
import { useProofStore } from '../stores/proof_store';
```

### Issue: "Store state not updating"
**Solution**: Ensure you're calling store actions, not just accessing
```typescript
// Wrong
evaluationResults; // Just reads value

// Right
setEvaluationResult(id, result); // Updates store
```

### Issue: "Child components not updating"
**Solution**: Ensure child components also import and use stores
```typescript
// Child must also use store
const { evaluationResults } = useProofStore();
```

---

## Timeline

**Phase 1-3 Recommended Schedule**:

- **Day 1**: HybridDashboardM3.tsx migration (2-3 hours)
  - Analyze current state
  - Replace useState with stores
  - Test thoroughly

- **Day 2**: Settings.tsx migration (1-2 hours)
  - Implement theme store integration
  - Add notifications
  - Test persistence

- **Final**: Comprehensive testing (1 hour)
  - Run full test suite
  - Manual testing
  - Performance verification
  - Git commit

---

## References

- **Zustand Guide**: `ZUSTAND_INTEGRATION.md`
- **OpenAPI Guide**: `OPENAPI_INTEGRATION.md`
- **Store Documentation**: JSDoc comments in `src/stores/`

---

## Next Steps After Phase 1-3

✅ Component migration complete
→ **Phase 1-4**: Add Zustand DevTools (optional, 1 hour)
→ **Stage 4**: Marketing & outreach
→ **v1.1**: Backend async optimization

---

**Phase 1-3 is ready to implement!** Follow this guide step-by-step for smooth migration. 🚀
