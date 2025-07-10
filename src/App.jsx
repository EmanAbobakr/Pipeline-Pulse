import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import WorkflowTable from './components/WorkflowTable';
import ErrorDetails from './components/ErrorDetails';
import './App.css';

function App() {
  // Placeholder state for UI structure
  const [summary, setSummary] = useState({
    totalFailures: 0,
    uniqueIssues: 0,
    mostCommonError: '-',
  });
  const [workflows, setWorkflows] = useState([]);
  const [selectedError, setSelectedError] = useState(null);

  const handleFilterChange = (type, value) => {
    // Filtering logic will go here
  };

  return (
    <div className="pipeline-pulse-app">
      <Dashboard summary={summary} onFilterChange={handleFilterChange} />
      <WorkflowTable workflows={workflows} onSelect={setSelectedError} />
      <ErrorDetails error={selectedError} />
    </div>
  );
}

export default App;
