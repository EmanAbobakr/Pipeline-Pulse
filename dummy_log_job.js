const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, 'dummy_logs.json');

function getRandomWorkflow() {
  const workflows = [
    'CI Pipeline',
    'Deploy to Production',
    'Lint & Test',
    'Build Docs',
    'Security Scan',
    'Integration Test',
    'Release',
  ];
  return workflows[Math.floor(Math.random() * workflows.length)];
}

function getRandomIssue() {
  const issues = [
    'Test failed',
    'Deployment error',
    'Lint error',
    'Build failed',
    'Timeout',
    'Permission denied',
    'Dependency error',
  ];
  return issues[Math.floor(Math.random() * issues.length)];
}

function getRandomAssignee() {
  const assignees = ['Alice', 'Bob', 'Charlie', 'Dana', 'Eve', 'Frank', 'Grace'];
  return assignees[Math.floor(Math.random() * assignees.length)];
}

function getRandomSummary() {
  const summaries = [
    'Unit test error in step 3',
    'Timeout during deployment',
    'ESLint rule violation',
    'Docs build script error',
    'Token expired',
    'Network unreachable',
    'Unknown error occurred',
  ];
  return summaries[Math.floor(Math.random() * summaries.length)];
}

function generateLog() {
  return {
    workflow: getRandomWorkflow(),
    issue: getRandomIssue(),
    summary: getRandomSummary(),
    date: new Date().toISOString().slice(0, 10),
    assignee: getRandomAssignee(),
  };
}

function appendLog() {
  let logs = [];
  if (fs.existsSync(LOG_FILE)) {
    try {
      logs = JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'));
    } catch (e) {
      logs = [];
    }
  }
  logs.push(generateLog());
  fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
  console.log('Appended new log. Total logs:', logs.length);
}

setInterval(appendLog, 10000);
console.log('Dummy log generator started. Writing to', LOG_FILE);
