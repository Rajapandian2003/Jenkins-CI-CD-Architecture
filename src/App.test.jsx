import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App.jsx';

describe('App', () => {
  it('renders the system architecture overview and diagram nodes', () => {
    render(<App />);

    expect(screen.getByText('Jenkins CI/CD Architecture on AWS EC2')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'GitHub Repository' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'AWS EC2 Instance Boundary' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Jenkins Automation Server' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'SonarQube Server' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Docker Engine and Container' })).toBeInTheDocument();
  });

  it('updates the component inspector when clicking an architecture node', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: 'SonarQube Server' }));

    expect(screen.getByRole('heading', { name: 'SonarQube Server' })).toBeInTheDocument();
    expect(screen.getByText('Continuous Code Quality & Security')).toBeInTheDocument();
  });

  it('steps through the end-to-end pipeline flow', () => {
    render(<App />);

    expect(screen.getByText(/Step 1 • Developer \/ GitHub → Jenkins \(EC2\)/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Next flow step' }));

    expect(screen.getByText(/Step 2 • Jenkins \(EC2\) → Jenkins Workspace/i)).toBeInTheDocument();
  });

  it('highlights a pipeline stage when clicked in the timeline', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /SonarQube Static Analysis/i }));

    expect(screen.getByText(/Step 3 • Jenkins → SonarQube/i)).toBeInTheDocument();
  });
});
