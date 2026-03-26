# ClearCash Financial Assistant for MSMEs

**ClearCash** is a high-fidelity, institutional-grade financial intelligence dashboard designed specifically for MSMEs (Micro, Small, and Medium Enterprises). It features an ecosystem of automated parsing, liquidity analysis, and predictive decision engines that transform raw banking data into actionable financial strategy.

---

## Key Features

### 1. **Neural Sync (Data Ingestion)**
- **Intelligent Parsers**: Extract data directly from unstructured sources like generic bank statements (PDF) and physical receipts (Images).
- **Graceful Fallbacks**: Features robust error-handling. If the system lacks OCR dependencies (like Tesseract) or encounters corrupt PDFs, it safely saves placeholder bounds for human review without causing critical application crashes.
- **Deduplication Engine**: A high-speed RapidFuzz algorithm cross-checks new data against the Universal Ledger to prevent double-counting.

### 2. **Financial Trajectory (Command Hub)**
- **Liquidity Reservoir Tracker**: Real-time snapshot of available capital versus impending obligations.
- **Operational Horizon (DCOH)**: Dynamically calculates "Days Cash on Hand" projecting the runway of business operations.
- **Expenditure Matrix**: Visual categorization of spending habits (Income, Payroll, Rent, Utilities, etc.) mapped natively via Recharts.

### 3. **The Decision Engine (Priority Rankings)**
- **Smart Staggering**: Automatically scores unfulfilled commitments (payables) on a 0-100 scale, categorizing them as `PRIORITY`, `STAGGER`, or `DELAY`.
- **Explainability Tracing**: Each generated priority score explicitly details *why* the AI weighted it that way. For example:
  - `+40 (Critical Category)` for essential obligations like GST/Taxes or Salary.
  - `-20 (High Cash Impact: 45%)` to protect capital ratios if a payment exceeds 10% of operating cash.

---

## Technology Stack

**Backend (The Intelligence Engine)**
* **Framework**: FastAPI (Python)
* **Database**: SQLite backed by SQLAlchemy ORM
* **Data Processing**: Pydantic models for strict type validation
* **OCR & Extraction**: `pypdfium2`, `pytesseract` (Tesseract-OCR hardware dependency), and `pdfplumber`

**Frontend (The Institutional Dashboard)**
* **Framework**: React 18
* **Build Tool**: Vite
* **Styling**: Tailwind CSS v4 (Custom Institutional Dark-mode Palette with Glassmorphism)
* **Data Visualization**: Recharts integration
* **Icons**: Lucide React

---

## Local Development Setup

### Preliminaries
Ensure you have the following installed on your machine:
* Python 3.9+
* Node.js v18+ 
* [Tesseract-OCR](https://github.com/tesseract-ocr/tesseract) (Must be installed at `C:\Program Files\Tesseract-OCR\tesseract.exe` or updated in the backend configuration script).

### 1. Start the Backend
```bash
cd backend
python -m venv venv
source venv/Scripts/activate  # On Windows
pip install -r requirements.txt
uvicorn main:app --reload
```
*The backend API will run on `http://127.0.0.1:8000`.*

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
*The React UI will run on `http://localhost:5173` (or the port specified by Vite).*

### 3. Initialize the Sandbox
Once both servers are running:
1. Open the UI in your browser.
2. Sign in using the default testing credentials (Username: `silson` | Password: `12345`).
3. Click the **Refresh** button in the top right to query the backend and populate the UI dashboards.
4. *Optional*: Use the `/api/seed` API request in the backend to rapidly fill the SQLite database with 20 diverse, staggered transactions.

---

## 🛡️ License & Authorship
Developed by **SJ Thanav Kumar**, **Pranav Shreyas TC**, **Sharon Mariam Abhraham**, **Sreyas Shyam**.
ClearCash — Designed for resilience, optimized for clarity.
