import React, { useState } from 'react';
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

  // State to hold all failures (simulate receiving new failures)
  const [failures, setFailures] = useState([
    { workflow: 'CI Pipeline', failures: 3, last: '2025-07-09' },
    { workflow: 'Deploy to Production', failures: 2, last: '2025-07-08' },
    { workflow: 'Lint & Test', failures: 1, last: '2025-07-07' },
    { workflow: 'Build Docs', failures: 1, last: '2025-07-06' },
  ]);

  // Function to simulate receiving a new failure
  const addFailure = (workflow, date) => {
    setFailures(prev => {
      const idx = prev.findIndex(f => f.workflow === workflow);
      if (idx !== -1) {
        // Update existing
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          failures: updated[idx].failures + 1,
          last: date,
        };
        return updated;
      } else {
        // Add new
        return [...prev, { workflow, failures: 1, last: date }];
      }
    });
  };

  // Emoji status logic
  const failureCount = summary.totalFailures || failures.reduce((sum, f) => sum + f.failures, 0);
  let statusEmoji = '😃';
  let statusText = 'Healthy';
  if (failureCount >= 10) {
    statusEmoji = '😱';
    statusText = 'Critical';
  } else if (failureCount >= 5) {
    statusEmoji = '😟';
    statusText = 'Warning';
  }

  // CSV download handler
  const handleDownloadCSV = () => {
    const header = 'Workflow,Failures,Last Failure Date\n';
    const rows = failures.map(row => `${row.workflow},${row.failures},${row.last}`).join('\n');
    const csvContent = header + rows;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pipeline_pulse_summary.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // For demo: button to add a new failure
  const handleAddFailure = () => {
    // Randomly pick a workflow or add a new one
    const workflows = [...exampleWorkflows, 'New Workflow'];
    const workflow = workflows[Math.floor(Math.random() * workflows.length)];
    const date = new Date().toISOString().slice(0, 10);
    addFailure(workflow, date);
  };

  return (
    <div className="dashboard">
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <img src={voisLogo} alt="VOIS Logo" style={{ height: 48, borderRadius: 8, background: '#fff', padding: 4 }} />
        <h2 style={{ margin: 0 }}>Pipeline Pulse Dashboard</h2>
        <button onClick={handleDownloadCSV} style={{marginLeft: 'auto', background:'#23272f', color:'#fff', border:'none', borderRadius:6, padding:'8px 18px', cursor:'pointer'}}>Download CSV</button>
        <button onClick={handleAddFailure} style={{marginLeft: 12, background:'#4f8cff', color:'#fff', border:'none', borderRadius:6, padding:'8px 18px', cursor:'pointer'}}>Simulate New Failure</button>
      </div>
      <div className="summary-cards">
        <div className="card">
          <h3>Total Failures</h3>
          <p>{failureCount} <span title={statusText} style={{fontSize: 24, marginLeft: 8}}>{statusEmoji}</span></p>
        </div>
        <div className="card">
          <h3>Unique Issues</h3>
          <p>{summary.uniqueIssues || failures.length}</p>
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
          {failures.map((f, idx) => (
            <li key={idx}>{f.failures} failure{f.failures > 1 ? 's' : ''} in <b>{f.workflow}</b> (last: {f.last})</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
