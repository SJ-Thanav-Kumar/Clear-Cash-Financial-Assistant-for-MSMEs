-- ============================================================
-- Stream C: Supabase Schema
-- Run this in your Supabase project's SQL Editor
-- ============================================================

-- Enable pgcrypto for encryption/hashing helpers
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- ENUM TYPES
-- ============================================================
DO $$ BEGIN
    CREATE TYPE transaction_type AS ENUM ('payable', 'receivable', 'expense', 'income');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_status AS ENUM ('pending', 'settled', 'overdue', 'needs_review');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================
-- TABLE: upload_sessions
-- Audit trail for every batch of documents uploaded
-- ============================================================
CREATE TABLE IF NOT EXISTS upload_sessions (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    uploaded_by       TEXT NOT NULL,
    uploaded_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    source_filename   TEXT,
    total_extracted   INTEGER NOT NULL DEFAULT 0,
    total_validated   INTEGER NOT NULL DEFAULT 0,
    total_quarantined INTEGER NOT NULL DEFAULT 0,
    notes             TEXT
);

-- ============================================================
-- TABLE: transactions
-- Central validated transaction table
-- ============================================================
CREATE TABLE IF NOT EXISTS transactions (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- Core financial fields
    date                DATE NOT NULL,
    due_date            DATE,
    amount              NUMERIC(15, 2) NOT NULL
                            CHECK (amount != 0),
    type                transaction_type NOT NULL,
    status              transaction_status NOT NULL DEFAULT 'pending',
    -- Counterparty
    counterparty        TEXT NOT NULL,
    -- Metadata
    source              TEXT NOT NULL,           -- 'bank_statement', 'receipt', 'invoice'
    description         TEXT,
    reference_number    TEXT,
    -- Validation flags
    needs_review        BOOLEAN NOT NULL DEFAULT FALSE,
    -- Deduplication
    dedup_hash          TEXT NOT NULL,
    -- Links
    raw_ref             TEXT,                    -- reference to original quarantine row if promoted
    upload_session_id   UUID REFERENCES upload_sessions(id) ON DELETE SET NULL,
    -- Timestamps
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Sign consistency enforced at DB level as a backup to app-level validation
    CONSTRAINT chk_sign_payable  CHECK (type != 'payable'    OR amount < 0),
    CONSTRAINT chk_sign_expense  CHECK (type != 'expense'    OR amount < 0),
    CONSTRAINT chk_sign_receivable CHECK (type != 'receivable' OR amount > 0),
    CONSTRAINT chk_sign_income   CHECK (type != 'income'     OR amount > 0),

    -- Date sanity enforced at DB level
    CONSTRAINT chk_date_min      CHECK (date >= '2015-01-01'),
    CONSTRAINT chk_due_after_date CHECK (due_date IS NULL OR due_date >= date)
);

CREATE INDEX IF NOT EXISTS idx_transactions_session ON transactions(upload_session_id);
CREATE INDEX IF NOT EXISTS idx_transactions_hash ON transactions(dedup_hash);
CREATE INDEX IF NOT EXISTS idx_transactions_counterparty ON transactions(counterparty);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);

-- ============================================================
-- TABLE: counterparty_profiles
-- Relationship data for each vendor / counterparty
-- ============================================================
CREATE TABLE IF NOT EXISTS counterparty_profiles (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name                TEXT NOT NULL UNIQUE,
    aliases             JSONB NOT NULL DEFAULT '[]',   -- list of alternate names
    relationship_score  NUMERIC(3, 1) CHECK (relationship_score BETWEEN 0 AND 10),
    flexibility_rating  NUMERIC(3, 1) CHECK (flexibility_rating BETWEEN 0 AND 10),
    tone_preference     TEXT CHECK (tone_preference IN ('formal', 'neutral', 'friendly')),
    notes               TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: quarantine
-- Records that failed validation — held for manual review
-- ============================================================
CREATE TABLE IF NOT EXISTS quarantine (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    upload_session_id   UUID REFERENCES upload_sessions(id) ON DELETE SET NULL,
    raw_extracted_data  JSONB NOT NULL,           -- exact extraction output before validation
    corrected_data      JSONB,                    -- user-submitted correction (NULL until corrected)
    reason              TEXT NOT NULL,            -- human-readable rejection reason
    raw_ref             TEXT,                     -- optional link to source document ref
    promoted            BOOLEAN NOT NULL DEFAULT FALSE,  -- TRUE once moved to transactions
    promoted_tx_id      UUID REFERENCES transactions(id) ON DELETE SET NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quarantine_session ON quarantine(upload_session_id);
CREATE INDEX IF NOT EXISTS idx_quarantine_promoted ON quarantine(promoted);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE transactions          ENABLE ROW LEVEL SECURITY;
ALTER TABLE counterparty_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE upload_sessions        ENABLE ROW LEVEL SECURITY;
ALTER TABLE quarantine             ENABLE ROW LEVEL SECURITY;

-- Service role bypasses RLS automatically.
-- The policies below allow authenticated users to read/write their own data.
-- Adjust as needed for your auth model.

CREATE POLICY "Allow authenticated read on transactions"
    ON transactions FOR SELECT
    TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert on transactions"
    ON transactions FOR INSERT
    TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated update on transactions"
    ON transactions FOR UPDATE
    TO authenticated USING (true);

CREATE POLICY "Allow authenticated read on upload_sessions"
    ON upload_sessions FOR SELECT
    TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert on upload_sessions"
    ON upload_sessions FOR INSERT
    TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated update on upload_sessions"
    ON upload_sessions FOR UPDATE
    TO authenticated USING (true);

CREATE POLICY "Allow authenticated read on quarantine"
    ON quarantine FOR SELECT
    TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert on quarantine"
    ON quarantine FOR INSERT
    TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated update on quarantine"
    ON quarantine FOR UPDATE
    TO authenticated USING (true);

CREATE POLICY "Allow authenticated all on counterparty_profiles"
    ON counterparty_profiles FOR ALL
    TO authenticated USING (true);

-- ============================================================
-- AUTO-UPDATE updated_at trigger
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_transactions_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_counterparty_updated_at
    BEFORE UPDATE ON counterparty_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_quarantine_updated_at
    BEFORE UPDATE ON quarantine
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
