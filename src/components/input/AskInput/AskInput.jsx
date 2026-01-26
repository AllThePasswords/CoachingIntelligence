// AskInput - Text input for asking questions about the team
// Used on Dashboard and Manager Detail pages
import { useState } from 'react';

export function AskInput({
  onSubmit,
  placeholder = 'Ask anything about your team...',
  disabled = false,
}) {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim() && onSubmit) {
      onSubmit(value.trim());
      setValue(''); // Clear after submit
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-0 p-2">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 h-10 px-4 bg-background-100 text-foreground placeholder:text-gray-400 focus:outline-none focus-ring transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded-l-full border-0 text-sm"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="h-10 px-5 bg-foreground text-background-100 rounded-full text-sm font-medium transition-all hover:bg-gray-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed border-0 focus-ring"
      >
        Ask
      </button>
    </form>
  );
}
