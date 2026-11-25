import { useEffect, useState } from 'react';
import { ArchitectureDiagram } from './components/ArchitectureDiagram.jsx';
import { FlowTimeline } from './components/FlowTimeline.jsx';
import { NodeInspector } from './components/NodeInspector.jsx';
import { ARCHITECTURE_NODES, FLOW_STEPS, QUALITY_PILLARS } from './data/architectureData.js';

export default function App() {
  const [selectedNodeId, setSelectedNodeId] = useState('jenkins');
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const activeFlowStep = FLOW_STEPS[activeStepIndex] || FLOW_STEPS[0];
  const selectedNode =
    ARCHITECTURE_NODES.find((node) => node.id === selectedNodeId) || ARCHITECTURE_NODES[0];

  useEffect(() => {
    if (!isPlaying) return undefined;
    const timer = window.setInterval(() => {
      setActiveStepIndex((prev) => (prev + 1) % FLOW_STEPS.length);
    }, 2600);
    return () => window.clearInterval(timer);
  }, [isPlaying]);

  function handleStepFlow(delta) {
    setIsPlaying(false);
    setActiveStepIndex((prev) => (prev + delta + FLOW_STEPS.length) % FLOW_STEPS.length);
  }

  function handleSelectStep(idx) {
    setIsPlaying(false);
    setActiveStepIndex(idx);
  }

  return (
    <div className="app-shell">
      <header className="hero">
        <div className="hero-content">
          <span className="hero-kicker">System Architecture Overview</span>
          <h1>Jenkins CI/CD Architecture on AWS EC2</h1>
          <p className="hero-subtitle">
            Visualizing how GitHub version control, Jenkins automation, SonarQube code quality
            analysis, and Docker containerization collaborate on an AWS EC2 instance to deliver
            software reliably from commit to production.
          </p>
        </div>

        <div className="pillars-grid" aria-label="Architecture pillars">
          {QUALITY_PILLARS.map((pillar) => (
            <div key={pillar.title} className="pillar-card">
              <span className="pillar-metric">{pillar.metric}</span>
              <h3>{pillar.title}</h3>
              <p>{pillar.detail}</p>
            </div>
          ))}
        </div>
      </header>

      <main className="main-stack">
        <ArchitectureDiagram
          selectedNodeId={selectedNode.id}
          activeFlowStep={activeFlowStep}
          isPlaying={isPlaying}
          onSelectNode={setSelectedNodeId}
          onTogglePlay={() => setIsPlaying((prev) => !prev)}
          onStepFlow={handleStepFlow}
        />

        <div className="details-grid">
          <NodeInspector
            nodes={ARCHITECTURE_NODES}
            selectedNode={selectedNode}
            onSelectNode={setSelectedNodeId}
          />
          <FlowTimeline
            steps={FLOW_STEPS}
            activeStepIndex={activeStepIndex}
            onSelectStep={handleSelectStep}
          />
        </div>
      </main>
    </div>
  );
}
