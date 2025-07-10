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

  // Example logs for the logs sheet
  const [logs] = useState([
    { workflow: 'CI Pipeline', issue: 'Test failed', summary: 'Unit test error in step 3', date: '2025-07-09', assignee: 'Alice' },
    { workflow: 'Deploy to Production', issue: 'Deployment error', summary: 'Timeout during deployment', date: '2025-07-08', assignee: 'Bob' },
    { workflow: 'Lint & Test', issue: 'Lint error', summary: 'ESLint rule violation', date: '2025-07-07', assignee: 'Charlie' },
    { workflow: 'Build Docs', issue: 'Build failed', summary: 'Docs build script error', date: '2025-07-06', assignee: 'Dana' },
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

  // CSV download handler for multi-sheet (Excel)
  const handleDownloadCSV = async () => {
    // Sheet 1: Summary
    const summaryHeader = ['Workflow', 'Failures', 'Last Failure Date'];
    const summaryRows = failures.map(row => [row.workflow, row.failures, row.last]);
    // Sheet 2: Logs
    const logsHeader = ['Workflow', 'Issue', 'Summary', 'Date', 'Assignee'];
    const logsRows = logs.map(row => [row.workflow, row.issue, row.summary, row.date, row.assignee]);

    // Use SheetJS to create an Excel file with two sheets
    const XLSX = await import('xlsx');
    const wb = XLSX.utils.book_new();
    const wsSummary = XLSX.utils.aoa_to_sheet([summaryHeader, ...summaryRows]);
    const wsLogs = XLSX.utils.aoa_to_sheet([logsHeader, ...logsRows]);
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');
    XLSX.utils.book_append_sheet(wb, wsLogs, 'Logs');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pipeline_pulse_data.xlsx';
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
        <button onClick={handleDownloadCSV} style={{marginLeft: 'auto', background:'#23272f', color:'#fff', border:'none', borderRadius:6, padding:'8px 18px', cursor:'pointer'}}>Download Excel</button>
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
