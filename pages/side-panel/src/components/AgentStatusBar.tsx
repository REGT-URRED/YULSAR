interface AgentStatusBarProps {
  isRunning: boolean;
  lastAction: string;
  isDarkMode?: boolean;
}

// ponytail: Comet-style light aura while the agent works — replaces per-action message spam
export default function AgentStatusBar({ isRunning, lastAction, isDarkMode = false }: AgentStatusBarProps) {
  if (!isRunning) return null;

  const label = lastAction ? lastAction : 'Trabajando...';

  return (
    <div className="relative shrink-0 overflow-hidden border-b border-crimson-700/60 bg-onyx-700/40">
      {/* animated light aura — crimson + orange (YULSAR identity) */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-10 animate-glow-drift"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(179,18,47,0.45) 25%, rgba(255,122,26,0.6) 50%, rgba(179,18,47,0.45) 75%, transparent 100%)',
          backgroundSize: '200% 100%',
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px animate-glow-breath bg-crimson" />
      <div className="relative flex items-center gap-2 px-3 py-2">
        <span
          className={`size-2 shrink-0 rounded-full animate-status-pulse ${isDarkMode ? 'bg-crimson' : 'bg-crimson-600'}`}
        />
        <span className="truncate text-xs font-medium text-bone-300">
          <span className="mr-1 opacity-70">Ejecutando:</span>
          {label}
        </span>
      </div>
    </div>
  );
}
