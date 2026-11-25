export const ARCHITECTURE_NODES = [
  {
    id: 'github',
    name: 'GitHub Repository',
    role: 'Version Control & Event Source',
    layer: 'External SCM',
    accent: '#818cf8',
    summary:
      'Stores application source code, manages branches and pull requests, and emits webhook events to Jenkins whenever new commits are pushed.',
    responsibilities: [
      'Central source of truth for application code and pipeline definitions',
      'Collaboration via pull requests, code reviews, and branch protection',
      'Instant push/merge webhook notifications to trigger automated CI runs',
    ],
    inputs: ['Developer commits & pull requests'],
    outputs: ['Webhook payload (HTTP POST)', 'Source code snapshot via Git clone'],
    port: 'HTTPS (443)',
  },
  {
    id: 'ec2',
    name: 'AWS EC2 Instance',
    role: 'Cloud Compute & Network Host',
    layer: 'Infrastructure Layer',
    accent: '#f59e0b',
    summary:
      'Provides the virtualized Linux compute environment on AWS where Jenkins, SonarQube, Docker Engine, and the deployed application container operate.',
    responsibilities: [
      'Hosts automation, code analysis, and container runtime services',
      'Enforces network boundaries via AWS Security Group inbound/outbound rules',
      'Exposes the containerized application to end users via a public IP/DNS',
    ],
    inputs: ['Inbound traffic on ports 80, 8080, 9000, and SSH (22)'],
    outputs: ['Public HTTP access to deployed app container'],
    port: 'Ports 22, 80, 8080, 9000',
  },
  {
    id: 'jenkins',
    name: 'Jenkins Automation Server',
    role: 'CI/CD Pipeline Orchestrator',
    layer: 'Automation Engine (EC2)',
    accent: '#38bdf8',
    summary:
      'Coordinates the end-to-end delivery lifecycle: pulling code from GitHub, running builds and tests, invoking SonarQube scans, and triggering Docker deployment.',
    responsibilities: [
      'Listens for GitHub webhooks to start automated pipeline executions',
      'Executes build, unit test, and static bundling stages deterministically',
      'Halts or proceeds based on SonarQube Quality Gate feedback',
      'Builds versioned Docker images and replaces running containers cleanly',
    ],
    inputs: ['GitHub webhook trigger', 'Source repository checkout'],
    outputs: ['Compiled artifacts', 'SonarQube scan request', 'Docker build & run commands'],
    port: 'HTTP (8080)',
  },
  {
    id: 'sonarqube',
    name: 'SonarQube Server',
    role: 'Continuous Code Quality & Security',
    layer: 'Quality Gate (EC2)',
    accent: '#34d399',
    summary:
      'Performs static code analysis on the repository to detect bugs, security vulnerabilities, code smells, and test coverage gaps before release.',
    responsibilities: [
      'Analyzes source files for maintainability, reliability, and security issues',
      'Tracks technical debt, duplicated blocks, and code coverage metrics',
      'Evaluates Quality Gate thresholds and reports pass/fail status to Jenkins',
    ],
    inputs: ['Source code & test metrics from Jenkins scanner'],
    outputs: ['Quality Gate status (PASS / FAIL)', 'Code health dashboard'],
    port: 'HTTP (9000)',
  },
  {
    id: 'docker',
    name: 'Docker Engine & Container',
    role: 'Container Packaging & Runtime',
    layer: 'Deployment Layer (EC2)',
    accent: '#06b6d4',
    summary:
      'Packages the built application and web server into a portable, immutable Docker image and runs it as an isolated container serving live traffic.',
    responsibilities: [
      'Builds reproducible images with all runtime dependencies encapsulated',
      'Separates build-time tooling from lightweight production runtime',
      'Runs the deployed application container with automatic restart policies',
    ],
    inputs: ['Verified application build from Jenkins'],
    outputs: ['Versioned Docker image', 'Live web application on Port 80'],
    port: 'HTTP (80)',
  },
];

export const FLOW_STEPS = [
  {
    step: 1,
    id: 'flow-commit',
    title: 'Code Commit & Webhook',
    from: 'Developer / GitHub',
    to: 'Jenkins (EC2)',
    activeNodes: ['github', 'ec2', 'jenkins'],
    edgeId: 'edge-github-jenkins',
    description:
      'A developer pushes code changes to GitHub. GitHub immediately dispatches a webhook event to the Jenkins server running on AWS EC2.',
    outcome: 'Pipeline run is triggered automatically without manual intervention.',
  },
  {
    step: 2,
    id: 'flow-build',
    title: 'Checkout & Build',
    from: 'Jenkins (EC2)',
    to: 'Jenkins Workspace',
    activeNodes: ['ec2', 'jenkins', 'github'],
    edgeId: 'edge-github-jenkins',
    description:
      'Jenkins pulls the latest commit from GitHub, installs project dependencies, runs automated tests, and compiles the application bundle.',
    outcome: 'Verified application artifact is ready for quality inspection.',
  },
  {
    step: 3,
    id: 'flow-sonar',
    title: 'SonarQube Static Analysis',
    from: 'Jenkins',
    to: 'SonarQube',
    activeNodes: ['ec2', 'jenkins', 'sonarqube'],
    edgeId: 'edge-jenkins-sonar',
    description:
      'Jenkins submits the codebase to SonarQube for deep static analysis, checking for bugs, security vulnerabilities, and code smells.',
    outcome: 'SonarQube evaluates the Quality Gate and notifies Jenkins.',
  },
  {
    step: 4,
    id: 'flow-docker',
    title: 'Docker Image Build',
    from: 'Jenkins',
    to: 'Docker Engine',
    activeNodes: ['ec2', 'jenkins', 'docker'],
    edgeId: 'edge-jenkins-docker',
    description:
      'Once the Quality Gate passes, Jenkins instructs Docker Engine on EC2 to build and tag a self-contained production image.',
    outcome: 'Immutable, versioned container image is created on EC2.',
  },
  {
    step: 5,
    id: 'flow-deploy',
    title: 'Container Deployment & Live Traffic',
    from: 'Docker Engine',
    to: 'AWS EC2 Port 80',
    activeNodes: ['ec2', 'docker'],
    edgeId: 'edge-docker-users',
    description:
      'Jenkins replaces any previous container with the newly built image and exposes it via AWS EC2 port 80 for end users.',
    outcome: 'Updated application is live, isolated, and ready for traffic.',
  },
];

export const QUALITY_PILLARS = [
  {
    title: 'Automated Delivery',
    metric: 'Zero Manual Deploy',
    detail: 'Every GitHub push flows automatically from commit to running container.',
  },
  {
    title: 'Quality Gate Enforcement',
    metric: 'Fail-Fast Checks',
    detail: 'SonarQube blocks buggy or vulnerable builds before Docker packaging.',
  },
  {
    title: 'Consistent Runtime',
    metric: 'Immutable Images',
    detail: 'Docker guarantees the tested build behaves identically in production.',
  },
  {
    title: 'Cloud Isolation',
    metric: 'AWS EC2 Security',
    detail: 'Security groups control access across SSH, Jenkins, SonarQube, and HTTP.',
  },
];

