import React from 'react';
import './Dashboard.css';
import voisLogo from '../assets/vois.png';

function Dashboard({ summary, onFilterChange }) {
  // Example data for demonstration
  const exampleWorkflows = [
    'CI Pipeline',
    'Deploy to Production',
    'Lint & Test',
    'Build Docs',
  ];

  return (
    <div className="dashboard">
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <img src={voisLogo} alt="VOIS Logo" style={{ height: 48, borderRadius: 8, background: '#fff', padding: 4 }} />
        <h2 style={{ margin: 0 }}>Pipeline Pulse Dashboard</h2>
      </div>
      <div className="summary-cards">
        <div className="card">
          <h3>Total Failures</h3>
          <p>{summary.totalFailures || 7}</p>
        </div>
        <div className="card">
          <h3>Unique Issues</h3>
          <p>{summary.uniqueIssues || 3}</p>
        </div>
        <div className="card">
          <h3>Most Common Error</h3>
          <p>{summary.mostCommonError || 'npm ERR! Command failed with exit code 1.'}</p>
        </div>
      </div>
      <div className="filters">
        <label>
          Workflow:
          <select onChange={e => onFilterChange('workflow', e.target.value)}>
            <option value="">All</option>
            {exampleWorkflows.map((wf, idx) => (
              <option key={idx} value={wf}>{wf}</option>
            ))}
          </select>
        </label>
        <label>
          Date:
          <input type="date" onChange={e => onFilterChange('date', e.target.value)} />
        </label>
      </div>
      {/* Example summary section */}
      <div style={{marginTop: 24}}>
        <h4>Example Issue Summary</h4>
        <ul>
          <li>3 failures in <b>CI Pipeline</b> (last: 2025-07-09)</li>
          <li>2 failures in <b>Deploy to Production</b> (last: 2025-07-08)</li>
          <li>1 failure in <b>Lint & Test</b> (last: 2025-07-07)</li>
          <li>1 failure in <b>Build Docs</b> (last: 2025-07-06)</li>
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
