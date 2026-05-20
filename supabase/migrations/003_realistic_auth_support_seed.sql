CREATE TABLE IF NOT EXISTS password_resets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_password_resets_user_id ON password_resets(user_id);
CREATE INDEX IF NOT EXISTS idx_password_resets_token ON password_resets(token);

-- Demo realistic support + admin bootstrap
INSERT INTO users (email, password, role, tenant_id, email_verified, phone)
VALUES ('chrisotieno026@gmail.com', '$2a$10$qpA8ZcVd0ZUhwHbZP90LaOE4f.f9.XXepePAZMPR0OKK.IcxvXGDi', 'admin', 'chrisotieno026@gmail.com', true, '+254701059192')
VALUES ('chrisotieno026@gmail.com', '$2a$10$qpA8ZcVd0ZUhwHbZP90LaOE4f.f9.XXepePAZMPR0OKK.IcxvXGDi', 'admin', 'chrisotieno026@gmail.com', true, '+254700000026')
ON CONFLICT (email) DO UPDATE SET role='admin', password=EXCLUDED.password, email_verified=true;

INSERT INTO admins (id, permissions, tenant_id)
SELECT u.id, ARRAY['all'], u.tenant_id
FROM users u
WHERE u.email = 'chrisotieno026@gmail.com'
ON CONFLICT (id) DO UPDATE SET permissions=ARRAY['all'];

INSERT INTO users (email, password, role, tenant_id, email_verified)
VALUES
  ('buyer.demo@marketplace.co.ke', '$2a$10$qpA8ZcVd0ZUhwHbZP90LaOE4f.f9.XXepePAZMPR0OKK.IcxvXGDi', 'buyer', 'buyer.demo@marketplace.co.ke', true),
  ('seller.demo@marketplace.co.ke', '$2a$10$qpA8ZcVd0ZUhwHbZP90LaOE4f.f9.XXepePAZMPR0OKK.IcxvXGDi', 'seller', 'seller.demo@marketplace.co.ke', true)
ON CONFLICT (email) DO NOTHING;
