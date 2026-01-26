// ApiKeyInput - Component for entering and managing Anthropic API key
// Stores key in localStorage via settingsStore
import { useState } from 'react';
import { useSettingsStore } from '@/stores';

/**
 * API key entry component with masked display
 */
export function ApiKeyInput() {
  const apiKey = useSettingsStore((s) => s.apiKey);
  const setApiKey = useSettingsStore((s) => s.setApiKey);
  const clearApiKey = useSettingsStore((s) => s.clearApiKey);

  const [inputValue, setInputValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    if (inputValue.trim()) {
      setApiKey(inputValue.trim());
    }
    setInputValue('');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setInputValue('');
    setIsEditing(false);
  };

  const handleClear = () => {
    clearApiKey();
    setIsEditing(false);
  };

  // Mask API key for display
  const getMaskedKey = (key) => {
    if (!key || key.length < 8) return key;
    return `sk-...${key.slice(-4)}`;
  };

  // Show saved key state
  if (apiKey && !isEditing) {
    return (
      <div className="flex items-center gap-3 text-sm">
        <span className="text-muted-foreground">API Key:</span>
        <span className="font-mono bg-gray-100 px-2 py-1 rounded">
          {getMaskedKey(apiKey)}
        </span>
        <button
          onClick={() => setIsEditing(true)}
          className="text-accent hover:underline"
        >
          Change
        </button>
      </div>
    );
  }

  // Show input form
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <input
          type="password"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="sk-ant-..."
          className="flex-1 px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave();
            if (e.key === 'Escape') handleCancel();
          }}
        />
        <button
          onClick={handleSave}
          disabled={!inputValue.trim()}
          className="px-4 py-2 text-sm font-medium bg-foreground text-white rounded-lg hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save
        </button>
        {apiKey && (
          <>
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-2 text-sm font-medium text-error hover:text-error/80 transition-colors"
            >
              Clear
            </button>
          </>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        Your API key is stored locally in your browser and never sent to our servers.
        Get your key from{' '}
        <a
          href="https://console.anthropic.com/settings/keys"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline"
        >
          console.anthropic.com
        </a>
      </p>
    </div>
  );
}
