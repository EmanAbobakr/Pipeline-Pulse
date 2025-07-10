const fs = require('fs');
const path = require('path');

const SRC_LOG = path.join(__dirname, 'dummy_logs.json');
const PUBLIC_LOG = path.join(__dirname, 'public', 'dummy_logs.json');

function syncLogFile() {
  if (fs.existsSync(SRC_LOG)) {
    fs.copyFileSync(SRC_LOG, PUBLIC_LOG);
  }
}

setInterval(syncLogFile, 2000);
console.log('Syncing dummy_logs.json to public/ every 2 seconds.');
