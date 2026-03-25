/**
 * frontend/src/api/backend.js
 *
 * Central API bridge — all components import from here.
 * Never call fetch() directly from a page or component.
 *
 * The backend runs at http://localhost:8000 by default.
 * Set VITE_API_BASE in frontend/.env to override.
 */

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

// ----------------------------------------------------------------
// Internal helper
// ----------------------------------------------------------------
async function request(method, path, body = null) {
  const opts = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(`${API_BASE}${path}`, opts);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.detail ?? `Request failed: ${res.status}`);
  }
  return data;
}

// ----------------------------------------------------------------
// Upload Sessions
// ----------------------------------------------------------------

/**
 * Create a new upload session.
 * @param {string} uploadedBy  - Username or identifier
 * @param {string} [filename]  - Source filename (optional)
 * @returns {{ session_id: string }}
 */
export async function createSession(uploadedBy, filename = null) {
  return request("POST", "/api/sessions", {
    uploaded_by: uploadedBy,
    source_filename: filename,
  });
}

/**
 * List all upload sessions (most recent first).
 * @returns {{ sessions: Array }}
 */
export async function listSessions() {
  return request("GET", "/api/sessions");
}

// ----------------------------------------------------------------
// Records — write and read
// ----------------------------------------------------------------

/**
 * Submit a batch of raw extracted records for validation + write.
 *
 * Each record should have at minimum:
 *   date, amount, type, status, counterparty, source
 *
 * @param {string} sessionId
 * @param {Array<object>} records  - Raw extracted records
 * @returns {{
 *   validated: number,
 *   quarantined: number,
 *   probable_duplicates: number,
 *   inserted_transactions: string[],
 *   quarantine_ids: string[],
 * }}
 */
export async function writeRecords(sessionId, records) {
  return request("POST", `/api/sessions/${sessionId}/write`, { records });
}

/**
 * Fetch all validated transactions for a session (consumed by Stream D).
 * @param {string} sessionId
 * @returns {{ records: Array }}
 */
export async function getSessionRecords(sessionId) {
  return request("GET", `/api/sessions/${sessionId}/records`);
}

// ----------------------------------------------------------------
// Quarantine management
// ----------------------------------------------------------------

/**
 * Fetch all quarantine records for a session.
 * @param {string} sessionId
 * @returns {{ quarantine: Array }}
 */
export async function getQuarantine(sessionId) {
  return request("GET", `/api/sessions/${sessionId}/quarantine`);
}

/**
 * Submit a manual correction for a quarantine record.
 * If the corrected record passes validation it is promoted to transactions.
 *
 * @param {string} quarantineId
 * @param {object} correction  - Fields to override (partial OK)
 * @returns {{
 *   status: 'promoted' | 'still_quarantined',
 *   transaction_id?: string,
 *   reason?: string,
 * }}
 */
export async function correctQuarantineRecord(quarantineId, correction) {
  return request("PATCH", `/api/quarantine/${quarantineId}/correct`, correction);
}

// ----------------------------------------------------------------
// Receipts Processing (Stream B)
// ----------------------------------------------------------------

/**
 * Upload a receipt image for OCR / Vision extraction processing.
 * Stream B handles preprocessing, LLM fallback, and writes to Stream C automatically.
 *
 * @param {string} sessionId
 * @param {File} file  - The image file from an <input type="file">
 * @returns {{
 *   status: 'validated' | 'quarantined',
 *   transaction_record_id?: string,
 *   quarantine_record_id?: string,
 *   reason?: string,
 *   data?: object
 * }}
 */
export async function uploadReceipt(sessionId, file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("session_id", sessionId);

  const res = await fetch(`${API_BASE}/api/receipts/upload`, {
    method: "POST",
    body: formData, // do not set Content-Type header manually for FormData!
  });
  
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.detail ?? `Request failed: ${res.status}`);
  }
  return data;
}

// ----------------------------------------------------------------
// Health check
// ----------------------------------------------------------------

/**
 * Ping the backend to check it is reachable.
 * @returns {{ status: 'ok' }}
 */
export async function healthCheck() {
  return request("GET", "/health");
}
