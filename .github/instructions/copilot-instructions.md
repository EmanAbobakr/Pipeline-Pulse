# Pipeline Pulse Setup & Usage Instructions

## 1. Local Log Generation (No Backend Required)
- The app generates random workflow failure logs in-memory every 10 seconds.
- On startup, 10 logs are generated for immediate demo data.
- All filtering and dashboard features work on this in-memory data.

## 2. Running the App
- Use `npm run dev` to start the app. This will:
  - Start the Vite dev server.
  - (Legacy) Start dummy log file and sync scripts (these are now unused, but left for reference).
- Open the app in your browser (usually at http://localhost:5173 or as shown in your terminal).

## 3. Filtering & Table
- Use the Workflow and Date filters at the top of the dashboard to filter the data in the summary cards and the "Failed Workflows" table.
- The table and summary update live as new logs are generated.

## 4. Exporting Data
- Click the "Download Excel" button to export the current summary and logs to a multi-sheet Excel file.

## 5. Resetting Data
- The "Reset" button is disabled in live mode (since data is in-memory and auto-generated).

## 6. Legacy/Optional: File-based Log Generation
- If you want to use file-based logs instead:
  - Run `node dummy_log_job.js` to generate logs in `dummy_logs.json`.
  - Run `node sync_logs_to_public.js` to copy logs to the public folder for the frontend.
  - Update the dashboard code to fetch from `/dummy_logs.json` instead of using in-memory data.

## 7. GitHub Webhook Integration (Future)
- For real GitHub Actions data, you will need a backend to receive webhooks and update the logs.
- You can use ngrok to expose your local server for webhook testing.
- See https://ngrok.com/download for installation and usage.

## 8. Troubleshooting
- If you see no data, wait 10 seconds for the first log to appear, or reload the page.
- For any issues with dependencies, run `npm install`.

---

For more help, see the chat history or ask your Copilot assistant.
