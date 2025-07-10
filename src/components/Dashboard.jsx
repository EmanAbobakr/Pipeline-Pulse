import React, { useEffect, useState, useRef } from 'react';
import './Dashboard.css';
import voisLogo from '../assets/vois.png';

function Dashboard({ summary = {}, onFilterChange }) {
  const [logs, setLogs] = useState([]);
  const [failures, setFailures] = useState([]);
  const [workflows, setWorkflows] = useState([]);
  const logsRef = useRef([]);

  // Random log generation in-memory every 10 seconds
  useEffect(() => {
    function getRandom(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    }
    function generateLog() {
      const workflowsArr = [
        'CI Pipeline',
        'Deploy to Production',
        'Lint & Test',
        'Build Docs',
        'Security Scan',
        'Integration Test',
        'Release',
      ];
      const issues = [
        'Test failed',
        'Deployment error',
        'Lint error',
        'Build failed',
        'Timeout',
        'Permission denied',
        'Dependency error',
      ];
      const assignees = ['Alice', 'Bob', 'Charlie', 'Dana', 'Eve', 'Frank', 'Grace'];
      const summaries = [
        'Unit test error in step 3',
        'Timeout during deployment',
        'ESLint rule violation',
        'Docs build script error',
        'Token expired',
        'Network unreachable',
        'Unknown error occurred',
      ];
      return {
        workflow: getRandom(workflowsArr),
        issue: getRandom(issues),
        summary: getRandom(summaries),
        date: new Date().toISOString().slice(0, 10),
        assignee: getRandom(assignees),
      };
    }

    // Initial batch of logs
    const initialLogs = Array.from({ length: 10 }, generateLog);
    logsRef.current = initialLogs;
    setLogs([...initialLogs]);

    const addLog = () => {
      logsRef.current = [...logsRef.current, generateLog()];
      setLogs([...logsRef.current]);
    };
    const interval = setInterval(addLog, 10000);
    return () => clearInterval(interval);
  }, []);

  // Summarize failures and workflows when logs change
  useEffect(() => {
    const summaryMap = {};
    logs.forEach(log => {
      if (!summaryMap[log.workflow]) summaryMap[log.workflow] = { workflow: log.workflow, failures: 0, last: log.date };
      summaryMap[log.workflow].failures += 1;
      if (log.date > summaryMap[log.workflow].last) summaryMap[log.workflow].last = log.date;
    });
    setFailures(Object.values(summaryMap));
    setWorkflows([...new Set(logs.map(l => l.workflow))]);
  }, [logs]);


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


  // Reset handler: clear logs file (optional, not implemented here)
  const handleReset = () => {
    // Not implemented: would require an API to clear the logs file
    alert('Reset is not available in live log mode. Please clear dummy_logs.json manually.');
  };

  // Colorful card backgrounds (remove animation)
  const cardColors = [
    'linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)',
    'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)',
    'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
  ];

  return (
    <div className="dashboard">
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <img src={voisLogo} alt="VOIS Logo" style={{ height: 48, borderRadius: 8, background: '#fff', padding: 4 }} />
        <h2 style={{ margin: 0 }}>Pipeline Pulse Dashboard</h2>
        <button onClick={handleDownloadCSV} style={{marginLeft: 'auto', background:'#23272f', color:'#fff', border:'none', borderRadius:6, padding:'8px 18px', cursor:'pointer'}}>Download Excel</button>
        <button onClick={handleReset} style={{marginLeft: 12, background:'#ff5c5c', color:'#fff', border:'none', borderRadius:6, padding:'8px 18px', cursor:'pointer'}}>Reset</button>
      </div>
      <div className="summary-cards">
        <div className="card" style={{ background: cardColors[0], color: '#fff', boxShadow: '0 4px 24px rgba(255,126,95,0.18)' }}>
          <h3>Total Failures</h3>
          <p style={{ fontSize: 32, fontWeight: 700 }}>
            {failureCount}
            <span title={statusText} style={{ fontSize: 32, marginLeft: 12 }}>{statusEmoji}</span>
          </p>
        </div>
        <div className="card" style={{ background: cardColors[1], color: '#fff', boxShadow: '0 4px 24px rgba(67,206,162,0.18)' }}>
          <h3>Unique Issues</h3>
          <p style={{ fontSize: 28, fontWeight: 600 }}>{summary.uniqueIssues || failures.length}</p>
        </div>
        <div className="card" style={{ background: cardColors[2], color: '#fff', boxShadow: '0 4px 24px rgba(247,151,30,0.18)' }}>
          <h3>Most Common Error</h3>
          <p style={{ fontSize: 18, fontWeight: 500 }}>{summary.mostCommonError || 'npm ERR! Command failed with exit code 1.'}</p>
        </div>
      </div>
      <div className="filters">
        <label>
          Workflow:
          <select onChange={e => onFilterChange('workflow', e.target.value)}>
            <option value="">All</option>
            {workflows.map((wf, idx) => (
              <option key={idx} value={wf}>{wf}</option>
            ))}
          </select>
        </label>
        <label>
          Date:
          <input type="date" onChange={e => onFilterChange('date', e.target.value)} />
        </label>
      </div>
      {/* Live summary section */}
      <div style={{marginTop: 24}}>
        <h4>Live Issue Summary</h4>
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
