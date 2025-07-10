import React from 'react';
import './WorkflowTable.css';

function WorkflowTable({ workflows, onSelect }) {
  return (
    <div className="workflow-table">
      <h2>Failed Workflows</h2>
      <table>
        <thead>
          <tr>
            <th>Workflow</th>
            <th>Job</th>
            <th>Error</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {workflows.map((wf, idx) => (
            <tr key={idx} onClick={() => onSelect(wf)}>
              <td>{wf.workflowName}</td>
              <td>{wf.jobName}</td>
              <td className="error-cell">{wf.errorSummary}</td>
              <td>{wf.date}</td>
              <td>{wf.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default WorkflowTable;
