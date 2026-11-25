export function ArchitectureDiagram({
  selectedNodeId,
  activeFlowStep,
  isPlaying,
  onSelectNode,
  onTogglePlay,
  onStepFlow,
}) {
  const activeNodes = new Set(activeFlowStep ? activeFlowStep.activeNodes : []);
  const activeEdge = activeFlowStep ? activeFlowStep.edgeId : null;

  function nodeClasses(id) {
    const isSelected = selectedNodeId === id;
    const isHighlighted = activeNodes.has(id);
    return `arch-node ${isSelected ? 'selected' : ''} ${isHighlighted ? 'highlighted' : ''}`;
  }

  function edgeClasses(edgeId) {
    return `arch-edge ${activeEdge === edgeId ? 'active' : ''}`;
  }

  return (
    <section className="diagram-panel" aria-label="Interactive system architecture diagram">
      <div className="diagram-header">
        <div>
          <h2>System Architecture Diagram</h2>
          <p className="panel-subtitle">
            Click any component to inspect its role, or step through the live CI/CD execution flow.
          </p>
        </div>

        <div className="flow-controls">
          <button
            type="button"
            className="ctrl-btn"
            onClick={() => onStepFlow(-1)}
            aria-label="Previous flow step"
          >
            ← Prev
          </button>
          <button
            type="button"
            className={`ctrl-btn primary ${isPlaying ? 'playing' : ''}`}
            onClick={onTogglePlay}
          >
            {isPlaying ? 'Pause Flow' : 'Animate Flow'}
          </button>
          <button
            type="button"
            className="ctrl-btn"
            onClick={() => onStepFlow(1)}
            aria-label="Next flow step"
          >
            Next →
          </button>
        </div>
      </div>

      <div className="diagram-canvas-wrap">
        <svg
          className="arch-svg"
          viewBox="0 0 980 420"
          role="img"
          aria-label="CI/CD Architecture on AWS EC2 with GitHub, Jenkins, SonarQube, and Docker"
        >
          <defs>
            <marker
              id="arrow-muted"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#475569" />
            </marker>
            <marker
              id="arrow-active"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8" />
            </marker>
          </defs>

          {/* AWS EC2 Cloud Host Boundary */}
          <g
            className={`ec2-boundary ${selectedNodeId === 'ec2' ? 'selected' : ''} ${
              activeNodes.has('ec2') ? 'highlighted' : ''
            }`}
            onClick={() => onSelectNode('ec2')}
            tabIndex={0}
            role="button"
            aria-label="AWS EC2 Instance Boundary"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectNode('ec2');
              }
            }}
          >
            <rect x="275" y="24" width="535" height="372" rx="18" className="ec2-box" />
            <rect x="295" y="12" width="236" height="26" rx="8" className="ec2-tag-bg" />
            <text x="310" y="29" className="ec2-tag-text">
              AWS EC2 INSTANCE (UBUNTU HOST)
            </text>
          </g>

          {/* Connection Arrows */}
          {/* GitHub -> Jenkins */}
          <g className={edgeClasses('edge-github-jenkins')}>
            <path
              d="M 218 135 L 318 135"
              markerEnd={
                activeEdge === 'edge-github-jenkins' ? 'url(#arrow-active)' : 'url(#arrow-muted)'
              }
            />
            <rect x="225" y="106" width="84" height="20" rx="5" className="edge-pill" />
            <text x="267" y="120" textAnchor="middle" className="edge-label">
              Webhook
            </text>
          </g>

          {/* Jenkins <-> SonarQube */}
          <g className={edgeClasses('edge-jenkins-sonar')}>
            <path
              d="M 420 186 L 420 258"
              markerEnd={
                activeEdge === 'edge-jenkins-sonar' ? 'url(#arrow-active)' : 'url(#arrow-muted)'
              }
            />
            <rect x="335" y="208" width="170" height="22" rx="5" className="edge-pill" />
            <text x="420" y="223" textAnchor="middle" className="edge-label">
              Scan &amp; Quality Gate
            </text>
          </g>

          {/* Jenkins -> Docker */}
          <g className={edgeClasses('edge-jenkins-docker')}>
            <path
              d="M 526 135 L 598 135"
              markerEnd={
                activeEdge === 'edge-jenkins-docker' ? 'url(#arrow-active)' : 'url(#arrow-muted)'
              }
            />
            <rect x="530" y="106" width="66" height="20" rx="5" className="edge-pill" />
            <text x="563" y="120" textAnchor="middle" className="edge-label">
              Build
            </text>
          </g>

          {/* Docker -> End Users */}
          <g className={edgeClasses('edge-docker-users')}>
            <path
              d="M 786 135 L 842 135"
              markerEnd={
                activeEdge === 'edge-docker-users' ? 'url(#arrow-active)' : 'url(#arrow-muted)'
              }
            />
            <rect x="786" y="106" width="56" height="20" rx="5" className="edge-pill" />
            <text x="814" y="120" textAnchor="middle" className="edge-label">
              :80
            </text>
          </g>

          {/* Quality Gate Decision Indicator */}
          <g className="gate-badge">
            <rect x="572" y="280" width="212" height="72" rx="12" className="gate-box" />
            <text x="590" y="305" className="gate-title">
              QUALITY GATE DECISION
            </text>
            <text x="590" y="326" className="gate-pass">
              PASS → Build &amp; Deploy Container
            </text>
            <text x="590" y="343" className="gate-fail">
              FAIL → Abort Pipeline Safely
            </text>
          </g>

          {/* Node 1: GitHub */}
          <g
            className={nodeClasses('github')}
            onClick={() => onSelectNode('github')}
            tabIndex={0}
            role="button"
            aria-label="GitHub Repository"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectNode('github');
              }
            }}
          >
            <rect x="26" y="82" width="192" height="106" rx="14" className="node-card" />
            <text x="44" y="110" className="node-kicker">
              EXTERNAL SCM
            </text>
            <text x="44" y="135" className="node-title">
              GitHub Repo
            </text>
            <text x="44" y="156" className="node-sub">
              Source &amp; Webhooks
            </text>
            <text x="44" y="175" className="node-port">
              HTTPS :443
            </text>
          </g>

          {/* Node 2: Jenkins */}
          <g
            className={nodeClasses('jenkins')}
            onClick={() => onSelectNode('jenkins')}
            tabIndex={0}
            role="button"
            aria-label="Jenkins Automation Server"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectNode('jenkins');
              }
            }}
          >
            <rect x="322" y="82" width="204" height="106" rx="14" className="node-card" />
            <text x="340" y="110" className="node-kicker">
              CI/CD ORCHESTRATOR
            </text>
            <text x="340" y="135" className="node-title">
              Jenkins Server
            </text>
            <text x="340" y="156" className="node-sub">
              Build, Test &amp; Trigger
            </text>
            <text x="340" y="175" className="node-port">
              HTTP :8080
            </text>
          </g>

          {/* Node 3: SonarQube */}
          <g
            className={nodeClasses('sonarqube')}
            onClick={() => onSelectNode('sonarqube')}
            tabIndex={0}
            role="button"
            aria-label="SonarQube Server"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectNode('sonarqube');
              }
            }}
          >
            <rect x="322" y="262" width="204" height="106" rx="14" className="node-card" />
            <text x="340" y="290" className="node-kicker">
              CODE QUALITY
            </text>
            <text x="340" y="315" className="node-title">
              SonarQube
            </text>
            <text x="340" y="336" className="node-sub">
              Bugs, Security &amp; Gate
            </text>
            <text x="340" y="355" className="node-port">
              HTTP :9000
            </text>
          </g>

          {/* Node 4: Docker */}
          <g
            className={nodeClasses('docker')}
            onClick={() => onSelectNode('docker')}
            tabIndex={0}
            role="button"
            aria-label="Docker Engine and Container"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectNode('docker');
              }
            }}
          >
            <rect x="602" y="82" width="184" height="106" rx="14" className="node-card" />
            <text x="620" y="110" className="node-kicker">
              CONTAINER RUNTIME
            </text>
            <text x="620" y="135" className="node-title">
              Docker &amp; App
            </text>
            <text x="620" y="156" className="node-sub">
              Image + Live Container
            </text>
            <text x="620" y="175" className="node-port">
              HTTP :80
            </text>
          </g>

          {/* End Users */}
          <g className="users-node">
            <rect x="846" y="94" width="112" height="82" rx="14" className="users-box" />
            <text x="902" y="128" textAnchor="middle" className="node-title">
              End Users
            </text>
            <text x="902" y="149" textAnchor="middle" className="node-sub">
              Browser HTTP
            </text>
          </g>
        </svg>
      </div>

      {activeFlowStep && (
        <div className="flow-banner" aria-live="polite">
          <div className="flow-banner-badge">
            Step {activeFlowStep.step} • {activeFlowStep.from} → {activeFlowStep.to}
          </div>
          <div className="flow-banner-text">
            <strong>{activeFlowStep.title}:</strong> {activeFlowStep.description}
          </div>
        </div>
      )}
    </section>
  );
}

