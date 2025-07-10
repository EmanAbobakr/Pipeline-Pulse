import React from 'react';
import './ErrorDetails.css';

function ErrorDetails({ error }) {
  if (!error) return null;
  return (
    <div className="error-details">
      <h2>Error Details</h2>
      <pre>{error.fullLog}</pre>
    </div>
  );
}

export default ErrorDetails;
