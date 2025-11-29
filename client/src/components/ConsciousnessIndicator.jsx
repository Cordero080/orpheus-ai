import './ConsciousnessIndicator.css';

// Custom SVG icons for each engine
const MemoryIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="3"/>
    <path d="M12 2v4m0 12v4M2 12h4m12 0h4"/>
    <path d="M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/>
  </svg>
);

const ArchetypeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 3l9 5v8l-9 5-9-5V8l9-5z"/>
    <path d="M12 8v8m-4-4h8"/>
  </svg>
);

const ReflectionIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2a10 10 0 100 20 10 10 0 000-20z"/>
    <path d="M12 6a6 6 0 100 12 6 6 0 000-12z"/>
    <circle cx="12" cy="12" r="2"/>
  </svg>
);

const SynthesisIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
  </svg>
);

const ENGINES = [
  { id: 'memory', label: 'MEM', icon: MemoryIcon, color: '#00f0ff' },
  { id: 'archetype', label: 'ARC', icon: ArchetypeIcon, color: '#c084fc' },
  { id: 'reflection', label: 'REF', icon: ReflectionIcon, color: '#ff44dd' },
  { id: 'synthesis', label: 'SYN', icon: SynthesisIcon, color: '#22ffaa' },
];

function ConsciousnessIndicator({ activeEngine = null, isProcessing = false }) {
  return (
    <div className={`consciousness-indicator ${isProcessing ? 'processing' : ''}`}>
      <div className="engines-row">
        {ENGINES.map((engine) => {
          const IconComponent = engine.icon;
          return (
            <div
              key={engine.id}
              className={`engine-node ${activeEngine === engine.id ? 'active' : ''}`}
              style={{ '--engine-color': engine.color }}
              title={engine.label}
            >
              <span className="engine-icon">
                <IconComponent />
              </span>
              <span className="engine-name">{engine.label}</span>
            </div>
          );
        })}
      </div>
      {isProcessing && (
        <div className="processing-bar">
          <div className="processing-fill"></div>
        </div>
      )}
    </div>
  );
}

export default ConsciousnessIndicator;
