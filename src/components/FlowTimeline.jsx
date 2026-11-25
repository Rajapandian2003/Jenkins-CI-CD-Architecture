export function FlowTimeline({ steps, activeStepIndex, onSelectStep }) {
  return (
    <section className="panel" aria-label="End-to-end CI/CD execution flow">
      <div className="panel-header">
        <div>
          <h2>End-to-End Pipeline Data Flow</h2>
          <p className="panel-subtitle">
            Select any stage to highlight the active infrastructure path in the diagram above.
          </p>
        </div>
      </div>

      <div className="timeline-list">
        {steps.map((item, idx) => {
          const isActive = idx === activeStepIndex;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectStep(idx)}
              className={`timeline-item ${isActive ? 'active' : ''}`}
              aria-pressed={isActive}
            >
              <div className="timeline-num">{item.step}</div>
              <div className="timeline-content">
                <div className="timeline-top">
                  <h3>{item.title}</h3>
                  <span className="timeline-route">
                    {item.from} → {item.to}
                  </span>
                </div>
                <p>{item.description}</p>
                <span className="timeline-outcome">Outcome: {item.outcome}</span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

