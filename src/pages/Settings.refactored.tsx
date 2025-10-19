/**
 * Settings Page - REFACTORED WITH ZUSTAND
 *
 * Migration Status: Template/Reference Implementation
 * This file shows the refactored version using Zustand stores.
 *
 * Key Changes:
 * 1. Removed useState for theme/preferences
 * 2. Integrated useTheme() hook from Zustand
 * 3. Added notifications for user feedback
 * 4. localStorage persistence automatic
 */

import styled from "@emotion/styled";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardSection,
  FormField,
  FormFieldInput,
  FormFieldSelect,
} from "../design-system";

// NEW: Import Zustand hooks
import { useTheme } from "../stores/hooks";
import { useNotifications } from "../stores/hooks";

const PageWrapper = styled("div")(({ theme }) => ({
  display: "grid",
  gap: theme.tokens.token.spacing.lg,
}));

const LayoutGrid = styled("div")(({ theme }) => ({
  display: "grid",
  gap: theme.tokens.token.spacing.lg,
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  "@media (max-width: 1023px)": {
    gridTemplateColumns: "1fr",
  },
}));

const CardStack = styled("div")(({ theme }) => ({
  display: "grid",
  gap: theme.tokens.token.spacing.lg,
}));

const PreviewPanel = styled(Card)(({ theme }) => ({
  minHeight: "320px",
  display: "grid",
  gap: theme.tokens.token.spacing.md,
  alignContent: "start",
}));

const FooterBar = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  gap: theme.tokens.token.spacing.md,
}));

const PreviewBox = styled("div")(({ theme, isDark }) => ({
  padding: theme.tokens.token.spacing.md,
  borderRadius: theme.tokens.token.borderRadius.md,
  backgroundColor: isDark ? "#1e1e1e" : "#f5f5f5",
  color: isDark ? "#ffffff" : "#000000",
  textAlign: "center",
  transition: "all 0.3s ease",
}));

/**
 * REFACTORED SETTINGS COMPONENT
 *
 * OLD: Multiple useState calls for theme, preferences, etc.
 * NEW: Zustand hooks for persistent state management
 */
export function SettingsPage(): JSX.Element {
  // ===== ZUSTAND HOOKS =====
  // NEW: Theme management with automatic localStorage persistence
  const { themeMode, setThemeMode, isDarkMode, setDarkMode, toggleDarkMode } = useTheme();

  // NEW: Notifications for user feedback
  const { addNotification } = useNotifications();

  // OLD: const [engine, setEngine] = useState("atlas-1");
  // For now, keep local state for non-persistent preferences
  // (Can be moved to Zustand store later if needed)
  // Placeholder for future: const { engine, setEngine } = useProofStore();

  // ===== EVENT HANDLERS =====
  // NEW: Theme change with notification
  const handleThemeChange = (mode: "light" | "dark" | "auto") => {
    setThemeMode(mode);
    addNotification({
      type: "success",
      message: `Theme changed to ${mode}`,
      duration: 3000,
    });
  };

  // NEW: Dark mode toggle with notification
  const handleDarkModeToggle = (isDark: boolean) => {
    setDarkMode(isDark);
    addNotification({
      type: "info",
      message: isDark ? "Dark mode enabled" : "Light mode enabled",
      duration: 2000,
    });
  };

  // Handler for saving settings
  const handleSaveSettings = () => {
    addNotification({
      type: "success",
      message: "Settings saved successfully!",
      duration: 3000,
    });
    // Settings are automatically persisted through Zustand stores
  };

  // Handler for resetting to defaults
  const handleResetDefaults = () => {
    setThemeMode("auto");
    setDarkMode(false);
    addNotification({
      type: "info",
      message: "Settings reset to defaults",
      duration: 3000,
    });
  };

  // ===== RENDER =====
  return (
    <PageWrapper>
      <header>
        <h1>Settings</h1>
        <p>Adjust ProofEngine parameters, visualization preferences, and accessibility options.</p>
      </header>

      <LayoutGrid>
        {/* Left Column: Settings Controls */}
        <CardStack>
          {/* Appearance Settings */}
          <Card variant="default">
            <CardHeader>Appearance</CardHeader>
            <CardBody>
              {/* Theme Mode Selection */}
              <CardSection>
                <FormField
                  label="Theme Mode"
                  helpText="Choose how ProofCore displays colors and styling."
                >
                  <FormFieldSelect
                    value={themeMode}
                    onChange={(event) =>
                      handleThemeChange(event.target.value as "light" | "dark" | "auto")
                    }
                  >
                    <option value="auto">Auto (System Default)</option>
                    <option value="light">Light Mode</option>
                    <option value="dark">Dark Mode</option>
                  </FormFieldSelect>
                </FormField>
              </CardSection>

              {/* Dark Mode Toggle */}
              <CardSection>
                <FormField
                  label="Force Dark Mode"
                  helpText="Enable dark mode regardless of system settings."
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <input
                      type="checkbox"
                      checked={isDarkMode}
                      onChange={(e) => handleDarkModeToggle(e.target.checked)}
                      style={{ cursor: "pointer", width: "20px", height: "20px" }}
                    />
                    <span>{isDarkMode ? "Dark mode active" : "Dark mode inactive"}</span>
                  </div>
                </FormField>
              </CardSection>
            </CardBody>
          </Card>

          {/* Engine Configuration (Keep local state for now) */}
          <Card variant="default">
            <CardHeader>Engine Configuration</CardHeader>
            <CardBody>
              <CardSection>
                <FormField
                  label="Semantic Model"
                  helpText="Select the default LLM adapter for consensus evaluation."
                >
                  <FormFieldSelect defaultValue="atlas-1">
                    <option value="atlas-1">Atlas-1 (general reasoning)</option>
                    <option value="orion-2">Orion-2 (formal logic)</option>
                    <option value="helios-3">Helios-3 (symbolic heavy)</option>
                  </FormFieldSelect>
                </FormField>
              </CardSection>

              <CardSection>
                <FormField
                  label="Max Tokens per Proof"
                  helpText="Maximum number of tokens to use in semantic evaluation."
                >
                  <FormFieldInput
                    type="number"
                    defaultValue="4096"
                    min="1024"
                    max="32768"
                    step="512"
                  />
                </FormField>
              </CardSection>
            </CardBody>
          </Card>

          {/* Accessibility Settings */}
          <Card variant="default">
            <CardHeader>Accessibility</CardHeader>
            <CardBody>
              <CardSection>
                <FormField
                  label="Animations"
                  helpText="Enable or disable interface animations."
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <input
                      type="checkbox"
                      defaultChecked={true}
                      style={{ cursor: "pointer", width: "20px", height: "20px" }}
                    />
                    <span>Enable animations</span>
                  </div>
                </FormField>
              </CardSection>

              <CardSection>
                <FormField
                  label="High Contrast Mode"
                  helpText="Increase color contrast for better readability."
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <input
                      type="checkbox"
                      defaultChecked={false}
                      style={{ cursor: "pointer", width: "20px", height: "20px" }}
                    />
                    <span>Enable high contrast</span>
                  </div>
                </FormField>
              </CardSection>
            </CardBody>
          </Card>
        </CardStack>

        {/* Right Column: Preview */}
        <CardStack>
          <PreviewPanel variant="outline">
            <CardHeader>Preview</CardHeader>
            <CardBody>
              {/* Theme Preview */}
              <div>
                <h4 style={{ marginBottom: "8px" }}>Theme Preview</h4>
                <PreviewBox isDark={isDarkMode}>
                  <p style={{ margin: "0" }}>
                    {themeMode === "auto"
                      ? "System Default"
                      : `${themeMode.charAt(0).toUpperCase() + themeMode.slice(1)} Mode`}
                  </p>
                  {isDarkMode && <p style={{ fontSize: "12px", margin: "4px 0 0 0" }}>(Dark forced)</p>}
                </PreviewBox>
              </div>

              {/* Settings Summary */}
              <div style={{ marginTop: "16px" }}>
                <h4 style={{ marginBottom: "8px" }}>Current Settings</h4>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    fontSize: "14px",
                    lineHeight: "1.6",
                  }}
                >
                  <li>
                    <strong>Theme:</strong> {themeMode}
                  </li>
                  <li>
                    <strong>Dark Mode:</strong> {isDarkMode ? "On" : "Off"}
                  </li>
                  <li>
                    <strong>Storage:</strong> Auto-persisted
                  </li>
                </ul>
              </div>

              {/* Info Box */}
              <div
                style={{
                  marginTop: "16px",
                  padding: "12px",
                  borderRadius: "4px",
                  backgroundColor: isDarkMode ? "#2a2a2a" : "#efefef",
                  fontSize: "13px",
                  color: isDarkMode ? "#ccc" : "#666",
                }}
              >
                <strong>💡 Tip:</strong> Your preferences are automatically saved to your browser.
              </div>
            </CardBody>
          </PreviewPanel>
        </CardStack>
      </LayoutGrid>

      {/* Footer Actions */}
      <FooterBar>
        <Button
          variant="outlined"
          onClick={handleResetDefaults}
        >
          Reset to Defaults
        </Button>
        <Button
          variant="primary"
          onClick={handleSaveSettings}
        >
          Save Settings
        </Button>
      </FooterBar>
    </PageWrapper>
  );
}

export default SettingsPage;
