import React, { useState, useEffect, useRef } from 'react';
import Dashboard from './components/Dashboard';
import WorkflowTable from './components/WorkflowTable';
import ErrorDetails from './components/ErrorDetails';
import './App.css';

function App() {
  // In-memory logs and filter state
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [filters, setFilters] = useState({ workflow: '', date: '' });
  const [selectedError, setSelectedError] = useState(null);
  const logsRef = useRef([]);

  // Generate logs in-memory
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
    // Initial batch
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

  // Filtering logic
  useEffect(() => {
    let filtered = [...logs];
    if (filters.workflow) {
      filtered = filtered.filter(l => l.workflow === filters.workflow);
    }
    if (filters.date) {
      filtered = filtered.filter(l => l.date === filters.date);
    }
    setFilteredLogs(filtered);
  }, [logs, filters]);

  // Summary for Dashboard
  const summaryMap = {};
  filteredLogs.forEach(log => {
    if (!summaryMap[log.workflow]) summaryMap[log.workflow] = { workflow: log.workflow, failures: 0, last: log.date };
    summaryMap[log.workflow].failures += 1;
    if (log.date > summaryMap[log.workflow].last) summaryMap[log.workflow].last = log.date;
  });
  const failures = Object.values(summaryMap);
  const summary = {
    totalFailures: filteredLogs.length,
    uniqueIssues: failures.length,
    mostCommonError: (() => {
      if (!filteredLogs.length) return '-';
      const counts = filteredLogs.reduce((acc, curr) => {
        acc[curr.issue] = (acc[curr.issue] || 0) + 1;
        return acc;
      }, {});
      const max = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
      return max ? max[0] : '-';
    })(),
  };
  if (summary.mostCommonError !== '-') {
    const max = Object.entries(summary.mostCommonError).sort((a, b) => b[1] - a[1])[0];
    summary.mostCommonError = max ? max[0] : '-';
  }

  // Table data
  const workflowTableRows = filteredLogs.map(log => ({
    workflowName: log.workflow,
    jobName: log.assignee,
    errorSummary: log.summary,
    date: log.date,
    status: 'Failed',
    fullLog: `${log.issue}: ${log.summary}\nAssignee: ${log.assignee}\nDate: ${log.date}`,
  }));

  const handleFilterChange = (type, value) => {
    setFilters(f => ({ ...f, [type]: value }));
  };

  return (
    <div className="pipeline-pulse-app">
      <Dashboard summary={summary} onFilterChange={handleFilterChange} />
      <WorkflowTable workflows={workflowTableRows} onSelect={setSelectedError} />
      <ErrorDetails error={selectedError} />
    </div>
  );
}

export default App;
