import type { Message } from '@extension/storage';
import { ACTOR_PROFILES } from '../types/message';
import { memo, useState, type ReactNode } from 'react';

interface MessageListProps {
  messages: Message[];
  isDarkMode?: boolean;
}

export default memo(function MessageList({ messages, isDarkMode = false }: MessageListProps) {
  return (
    <div className="max-w-full space-y-4">
      {messages.map((message, index) => (
        <MessageBlock
          key={`${message.actor}-${message.timestamp}-${index}`}
          message={message}
          isSameActor={index > 0 ? messages[index - 1].actor === message.actor : false}
          isDarkMode={isDarkMode}
        />
      ))}
    </div>
  );
});

interface MessageBlockProps {
  message: Message;
  isSameActor: boolean;
  isDarkMode?: boolean;
}

function MessageBlock({ message, isSameActor, isDarkMode = false }: MessageBlockProps) {
  if (!message.actor) {
    console.error('No actor found');
    return <div />;
  }
  const actor = ACTOR_PROFILES[message.actor as keyof typeof ACTOR_PROFILES];
  const isProgress = message.content === 'Showing progress...';

  return (
    <div
      className={`flex max-w-full gap-3 ${
        !isSameActor
          ? `mt-4 border-t ${isDarkMode ? 'border-crimson-700/50' : 'border-crimson-400/50'} pt-4 first:mt-0 first:border-t-0 first:pt-0`
          : ''
      }`}>
      {!isSameActor && (
        <div
          className="flex size-8 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: actor.iconBackground }}>
          <img src={actor.icon} alt={actor.name} className="size-6" />
        </div>
      )}
      {isSameActor && <div className="w-8" />}

      <div className="min-w-0 flex-1">
        {!isSameActor && (
          <div className={`mb-1 text-sm font-semibold ${isDarkMode ? 'text-bone' : 'text-bone-900'}`}>
            {actor.name}
          </div>
        )}

        <div className="space-y-0.5">
          <div className={`text-sm ${isDarkMode ? 'text-bone-300' : 'text-bone-700'}`}>
            {isProgress ? (
              <div className={`h-1 overflow-hidden rounded ${isDarkMode ? 'bg-onyx-700' : 'bg-gray-200'}`}>
                <div className="h-full animate-progress bg-crimson" />
              </div>
            ) : (
              renderContent(message.content, isDarkMode)
            )}
          </div>
          {!isProgress && (
            <div className={`text-right text-xs ${isDarkMode ? 'text-bone-500' : 'text-gray-300'}`}>
              {formatTimestamp(message.timestamp)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ponytail: split message content into text + ```code``` blocks, render code with preview
function renderContent(content: string, isDarkMode: boolean): ReactNode[] {
  const parts = content.split(/```([\w+-]*)\n?([\s\S]*?)```/g);
  const nodes: ReactNode[] = [];

  for (let i = 0; i < parts.length; i++) {
    if (i % 3 === 0) {
      if (parts[i]) {
        nodes.push(
          <span key={i} className="whitespace-pre-wrap break-words">
            {parts[i]}
          </span>,
        );
      }
    } else if (i % 3 === 1) {
      nodes.push(<CodeBlock key={i} language={parts[i]} code={parts[i + 1] || ''} isDarkMode={isDarkMode} />);
      i++; // skip the code part (already consumed)
    }
  }

  return nodes;
}

function CodeBlock({
  language,
  code,
  isDarkMode,
}: {
  language: string;
  code: string;
  isDarkMode: boolean;
}) {
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);

  const isHtml = /html|tailwind|jsx|tsx/.test(language.toLowerCase());

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable — ignore
    }
  };

  return (
    <div
      className={`my-2 overflow-hidden rounded-lg border ${
        isDarkMode ? 'border-onyx-600 bg-onyx-700' : 'border-gray-300 bg-gray-100'
      }`}>
      <div
        className={`flex items-center justify-between border-b px-3 py-1.5 text-xs ${
          isDarkMode ? 'border-onyx-600 text-bone-500' : 'border-gray-300 text-gray-500'
        }`}>
        <span>{language || 'code'}</span>
        <div className="flex gap-2">
          {isHtml && (
            <button
              type="button"
              onClick={() => setShowPreview(p => !p)}
              className={`cursor-pointer font-medium ${
                isDarkMode ? 'text-crimson-400 hover:text-crimson-300' : 'text-crimson-600 hover:text-crimson-700'
              }`}>
              {showPreview ? 'Codigo' : 'Preview'}
            </button>
          )}
          <button
            type="button"
            onClick={handleCopy}
            className={`cursor-pointer font-medium ${
              isDarkMode ? 'text-crimson-400 hover:text-crimson-300' : 'text-crimson-600 hover:text-crimson-700'
            }`}>
            {copied ? 'Copiado' : 'Copiar'}
          </button>
        </div>
      </div>
      {showPreview && isHtml ? (
        <iframe title="preview" sandbox="allow-scripts" srcDoc={code} className="h-72 w-full bg-white" />
      ) : (
        <pre className={`max-h-64 overflow-auto p-3 text-xs ${isDarkMode ? 'text-bone-200' : 'text-gray-800'}`}>
          <code>{code}</code>
        </pre>
      )}
    </div>
  );
}

/**
 * Formats a timestamp (in milliseconds) to a readable time string
 * @param timestamp Unix timestamp in milliseconds
 * @returns Formatted time string
 */
function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();

  // Check if the message is from today
  const isToday = date.toDateString() === now.toDateString();

  // Check if the message is from yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  // Check if the message is from this year
  const isThisYear = date.getFullYear() === now.getFullYear();

  // Format the time (HH:MM)
  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (isToday) {
    return timeStr; // Just show the time for today's messages
  }

  if (isYesterday) {
    return `Yesterday, ${timeStr}`;
  }

  if (isThisYear) {
    // Show month and day for this year
    return `${date.toLocaleDateString([], { month: 'short', day: 'numeric' })}, ${timeStr}`;
  }

  // Show full date for older messages
  return `${date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' })}, ${timeStr}`;
}
