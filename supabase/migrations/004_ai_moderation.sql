ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS ai_flagged BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS ai_flag_reason TEXT,
  ADD COLUMN IF NOT EXISTS ai_fraud_score NUMERIC(3,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ai_fraud_reasons JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS ai_checked_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_listings_ai_flagged ON listings(ai_flagged) WHERE ai_flagged = TRUE;
