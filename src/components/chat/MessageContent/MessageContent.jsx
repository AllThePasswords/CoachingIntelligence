// MessageContent - Renders message text with inline citations and markdown
// Parses [-> CALL-XXXX] patterns and renders Citation components
// Uses react-markdown for rich text formatting
import { Fragment } from 'react';
import Markdown from 'react-markdown';
import { Citation } from '@/components/display';

/**
 * Render message content with markdown and inline citations
 * @param {Object} props
 * @param {string} props.content - Message text content
 */
export function MessageContent({ content }) {
  // Guard against empty/undefined content
  if (!content) {
    return null;
  }

  // Pattern matches [-> CALL-XXXX], [→ CALL-XXXX], or standalone CALL-XXXX
  const citationPattern = /(\[(?:->|→)?\s*CALL-\d{4}\]|CALL-\d{4})/g;

  const parts = content.split(citationPattern);

  return (
    <div className="prose prose-sm max-w-none text-foreground prose-headings:text-foreground prose-strong:text-foreground prose-p:my-2 prose-ul:my-2 prose-li:my-0">
      {parts.map((part, index) => {
        // Check if this part contains a citation
        const citationMatch = part.match(/CALL-\d{4}/);
        if (citationMatch) {
          const callId = citationMatch[0];
          return (
            <Citation key={index} id={callId} />
          );
        }

        // Render markdown for non-citation parts
        return (
          <Markdown key={index} components={{
            // Override default elements for better inline rendering
            p: ({ children }) => <span className="block my-2">{children}</span>,
          }}>
            {part}
          </Markdown>
        );
      })}
    </div>
  );
}
