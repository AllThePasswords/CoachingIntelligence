// Error fallback components for error boundaries

/**
 * Generic error fallback with retry capability
 */
export function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <div className="text-red-600 mb-2">
        <svg className="w-10 h-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">Something went wrong</h3>
      <p className="text-sm text-gray-600 mb-4">
        {error?.message || 'An unexpected error occurred'}
      </p>
      {resetErrorBoundary && (
        <button
          onClick={resetErrorBoundary}
          className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors focus-ring"
        >
          Try again
        </button>
      )}
    </div>
  );
}

/**
 * Chat-specific error fallback with context-aware messaging
 */
export function ChatErrorFallback({ error, resetErrorBoundary }) {
  const isApiError = error?.message?.includes('API') || error?.message?.includes('401') || error?.message?.includes('403');

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <svg className="w-5 h-5 text-red-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div className="flex-1">
          <p className="text-sm font-medium text-red-800">
            {isApiError ? 'Unable to connect to Claude' : 'Chat error'}
          </p>
          <p className="text-sm text-red-600 mt-1">
            {isApiError
              ? 'Please check your API key and try again.'
              : (error?.message || 'Something went wrong with the chat.')}
          </p>
          {resetErrorBoundary && (
            <button
              onClick={resetErrorBoundary}
              className="mt-3 text-sm text-red-700 underline hover:text-red-800"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
