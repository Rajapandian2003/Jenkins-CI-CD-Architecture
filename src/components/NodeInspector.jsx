export function NodeInspector({ nodes, selectedNode, onSelectNode }) {
  return (
    <section className="panel" aria-label="Architecture component details">
      <div className="panel-header">
        <div>
          <span className="inspector-layer" style={{ color: selectedNode.accent }}>
            {selectedNode.layer}
          </span>
          <h2>{selectedNode.name}</h2>
          <p className="panel-subtitle">{selectedNode.role}</p>
        </div>
        <span className="port-badge">{selectedNode.port}</span>
      </div>

      <div className="node-tabs" role="tablist" aria-label="Architecture components">
        {nodes.map((node) => (
          <button
            key={node.id}
            type="button"
            role="tab"
            aria-selected={node.id === selectedNode.id}
            className={`node-tab ${node.id === selectedNode.id ? 'active' : ''}`}
            onClick={() => onSelectNode(node.id)}
          >
            {node.name}
          </button>
        ))}
      </div>

      <div className="inspector-body" role="tabpanel">
        <p className="inspector-summary">{selectedNode.summary}</p>

        <div className="inspector-block">
          <h3>Architectural Responsibilities</h3>
          <ul className="resp-list">
            {selectedNode.responsibilities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="io-grid">
          <div className="io-card">
            <span className="io-label">Receives (Inputs)</span>
            <ul>
              {selectedNode.inputs.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="io-card">
            <span className="io-label">Produces (Outputs)</span>
            <ul>
              {selectedNode.outputs.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

