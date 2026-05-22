-- ============================================================
-- Migration 002: Mini Jumia Marketplace Upgrade
-- Adds: categories, brands, product_variants, orders, cart,
--       order_tracking, ai_agent_logs
-- Enhances: listings, listing_images, sellers
-- ============================================================

-- ── Categories ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  emoji VARCHAR(10),
  image_url TEXT,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON categories(is_active);

-- ── Subcategories ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS subcategories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(category_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_subcategories_category_id ON subcategories(category_id);

-- ── Brands ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  logo_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_brands_slug ON brands(slug);

-- ── Enhance listings table ────────────────────────────────────
ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS subcategory_id UUID REFERENCES subcategories(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS discount_percent DECIMAL(5,2) DEFAULT 0 CHECK (discount_percent >= 0 AND discount_percent <= 100),
  ADD COLUMN IF NOT EXISTS condition VARCHAR(20) DEFAULT 'new' CHECK (condition IN ('new','used','refurbished')),
  ADD COLUMN IF NOT EXISTS weight_kg DECIMAL(8,3),
  ADD COLUMN IF NOT EXISTS sku VARCHAR(100),
  ADD COLUMN IF NOT EXISTS is_negotiable BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS delivery_available BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS delivery_cost DECIMAL(10,2) DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_listings_subcategory_id ON listings(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_listings_brand_id ON listings(brand_id);
CREATE INDEX IF NOT EXISTS idx_listings_condition ON listings(condition);
CREATE INDEX IF NOT EXISTS idx_listings_stock_quantity ON listings(stock_quantity);

-- ── Enhance listing_images table ──────────────────────────────
ALTER TABLE listing_images
  ADD COLUMN IF NOT EXISTS is_primary BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS alt_text VARCHAR(255),
  ADD COLUMN IF NOT EXISTS storage_path TEXT,
  ADD COLUMN IF NOT EXISTS width INTEGER,
  ADD COLUMN IF NOT EXISTS height INTEGER,
  ADD COLUMN IF NOT EXISTS size_bytes INTEGER;

CREATE INDEX IF NOT EXISTS idx_listing_images_is_primary ON listing_images(listing_id, is_primary);

-- ── Enhance sellers table ─────────────────────────────────────
ALTER TABLE sellers
  ADD COLUMN IF NOT EXISTS banner_url TEXT,
  ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
  ADD COLUMN IF NOT EXISTS location VARCHAR(255),
  ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_sales INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_orders INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_earnings DECIMAL(12,2) DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS response_time_hours INTEGER DEFAULT 24,
  ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS return_policy TEXT,
  ADD COLUMN IF NOT EXISTS is_online BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMP WITH TIME ZONE;

-- ── Product Variants ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  value VARCHAR(100) NOT NULL,
  price_modifier DECIMAL(10,2) DEFAULT 0,
  stock_quantity INTEGER DEFAULT 0,
  sku VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  tenant_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_product_variants_listing_id ON product_variants(listing_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_tenant_id ON product_variants(tenant_id);

-- ── Carts ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_id VARCHAR(255),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active','checked_out','abandoned')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  tenant_id UUID NOT NULL,
  UNIQUE(buyer_id, status) DEFERRABLE INITIALLY DEFERRED
);

CREATE INDEX IF NOT EXISTS idx_carts_buyer_id ON carts(buyer_id);
CREATE INDEX IF NOT EXISTS idx_carts_status ON carts(status);
CREATE INDEX IF NOT EXISTS idx_carts_tenant_id ON carts(tenant_id);

-- ── Cart Items ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(cart_id, listing_id, variant_id)
);

CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_listing_id ON cart_items(listing_id);

-- ── Orders ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(20) NOT NULL UNIQUE,
  buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  seller_id UUID NOT NULL REFERENCES sellers(id) ON DELETE RESTRICT,
  status VARCHAR(30) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','paid','processing','shipped','delivered','completed','cancelled','returned','refunded')),
  subtotal DECIMAL(10,2) NOT NULL,
  delivery_cost DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
  payment_method VARCHAR(50),
  delivery_address JSONB,
  delivery_notes TEXT,
  estimated_delivery_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancellation_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  tenant_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_buyer_id ON orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller_id ON orders(seller_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_tenant_id ON orders(tenant_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- ── Order Items ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE RESTRICT,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  title VARCHAR(500) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL,
  discount_percent DECIMAL(5,2) DEFAULT 0,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_listing_id ON order_items(listing_id);

-- ── Order Tracking ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status VARCHAR(30) NOT NULL,
  description TEXT NOT NULL,
  location VARCHAR(255),
  tracking_number VARCHAR(100),
  carrier VARCHAR(100),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_tracking_order_id ON order_tracking(order_id);
CREATE INDEX IF NOT EXISTS idx_order_tracking_created_at ON order_tracking(created_at DESC);

-- ── AI Agent Logs ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ai_agent_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  agent_type VARCHAR(50) NOT NULL
    CHECK (agent_type IN ('product_assistant','buyer_assistant','fraud_agent','support_agent','moderation','smart_search')),
  user_role VARCHAR(20),
  input_data JSONB,
  output_data JSONB,
  model_used VARCHAR(50),
  tokens_used INTEGER,
  duration_ms INTEGER,
  success BOOLEAN DEFAULT TRUE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  tenant_id UUID NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_ai_agent_logs_user_id ON ai_agent_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_agent_logs_agent_type ON ai_agent_logs(agent_type);
CREATE INDEX IF NOT EXISTS idx_ai_agent_logs_tenant_id ON ai_agent_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_ai_agent_logs_created_at ON ai_agent_logs(created_at DESC);

-- ── Triggers for new tables ───────────────────────────────────
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subcategories_updated_at BEFORE UPDATE ON subcategories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_carts_updated_at BEFORE UPDATE ON carts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_variants_updated_at BEFORE UPDATE ON product_variants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── Seed: Categories ──────────────────────────────────────────
INSERT INTO categories (name, slug, emoji, description, display_order) VALUES
  ('Electronics',    'electronics',    '📱', 'Phones, laptops, TVs and gadgets',               1),
  ('Fashion',        'fashion',        '👗', 'Clothing, shoes, bags and accessories',           2),
  ('Home & Garden',  'home-garden',    '🏡', 'Furniture, appliances and garden tools',          3),
  ('Vehicles',       'vehicles',       '🚗', 'Cars, motorcycles, spare parts',                  4),
  ('Property',       'property',       '🏢', 'Houses, land, commercial property',               5),
  ('Agriculture',    'agriculture',    '🌾', 'Farm produce, livestock, equipment',              6),
  ('Sports',         'sports',         '⚽', 'Sports gear, fitness, outdoor activities',        7),
  ('Services',       'services',       '💼', 'Professional and personal services',              8),
  ('Baby & Kids',    'baby-kids',      '🍼', 'Baby gear, toys, children clothing',              9),
  ('Health & Beauty','health-beauty',  '💄', 'Skincare, supplements, medical supplies',        10)
ON CONFLICT (slug) DO NOTHING;

-- ── Seed: Subcategories ───────────────────────────────────────
INSERT INTO subcategories (category_id, name, slug) VALUES
  ((SELECT id FROM categories WHERE slug='electronics'), 'Mobile Phones',     'mobile-phones'),
  ((SELECT id FROM categories WHERE slug='electronics'), 'Laptops & Tablets', 'laptops-tablets'),
  ((SELECT id FROM categories WHERE slug='electronics'), 'TVs & Audio',       'tvs-audio'),
  ((SELECT id FROM categories WHERE slug='electronics'), 'Cameras',           'cameras'),
  ((SELECT id FROM categories WHERE slug='fashion'),     'Men Clothing',      'men-clothing'),
  ((SELECT id FROM categories WHERE slug='fashion'),     'Women Clothing',    'women-clothing'),
  ((SELECT id FROM categories WHERE slug='fashion'),     'Shoes',             'shoes'),
  ((SELECT id FROM categories WHERE slug='fashion'),     'Bags',              'bags'),
  ((SELECT id FROM categories WHERE slug='vehicles'),    'Cars',              'cars'),
  ((SELECT id FROM categories WHERE slug='vehicles'),    'Motorcycles',       'motorcycles'),
  ((SELECT id FROM categories WHERE slug='vehicles'),    'Spare Parts',       'spare-parts'),
  ((SELECT id FROM categories WHERE slug='home-garden'), 'Furniture',         'furniture'),
  ((SELECT id FROM categories WHERE slug='home-garden'), 'Kitchen',           'kitchen'),
  ((SELECT id FROM categories WHERE slug='home-garden'), 'Appliances',        'appliances')
ON CONFLICT DO NOTHING;

-- ── RLS for new tables ────────────────────────────────────────
ALTER TABLE categories      ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories   ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands          ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts           ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items      ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders          ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items     ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_tracking  ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_agent_logs   ENABLE ROW LEVEL SECURITY;

-- Public reads on categories, subcategories, brands
CREATE POLICY "Anyone can view categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view subcategories" ON subcategories FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view brands" ON brands FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view product variants" ON product_variants FOR SELECT USING (true);

-- Cart policies
CREATE POLICY "Buyers can manage their own cart" ON carts
  FOR ALL USING (auth.uid()::text = buyer_id::text);
CREATE POLICY "Buyers can manage their own cart items" ON cart_items
  FOR ALL USING (
    EXISTS (SELECT 1 FROM carts WHERE carts.id = cart_id AND carts.buyer_id::text = auth.uid()::text)
  );

-- Order policies
CREATE POLICY "Buyers can view their own orders" ON orders
  FOR SELECT USING (auth.uid()::text = buyer_id::text);
CREATE POLICY "Sellers can view their own orders" ON orders
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM sellers WHERE sellers.id = auth.uid()::text AND sellers.id = seller_id::text)
  );
CREATE POLICY "Buyers can create orders" ON orders
  FOR INSERT WITH CHECK (auth.uid()::text = buyer_id::text);
CREATE POLICY "Anyone can view order items of their orders" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_id
        AND (orders.buyer_id::text = auth.uid()::text OR orders.seller_id::text = auth.uid()::text)
    )
  );
CREATE POLICY "Anyone can view tracking for their orders" ON order_tracking
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_id
        AND (orders.buyer_id::text = auth.uid()::text OR orders.seller_id::text = auth.uid()::text)
    )
  );

-- Admin full access on new tables
CREATE POLICY "Admins full access on orders" ON orders
  FOR ALL USING (EXISTS (SELECT 1 FROM admins WHERE admins.id = auth.uid()::text));
CREATE POLICY "Admins full access on categories" ON categories
  FOR ALL USING (EXISTS (SELECT 1 FROM admins WHERE admins.id = auth.uid()::text));
CREATE POLICY "Admins full access on brands" ON brands
  FOR ALL USING (EXISTS (SELECT 1 FROM admins WHERE admins.id = auth.uid()::text));
CREATE POLICY "Admins full access on ai_agent_logs" ON ai_agent_logs
  FOR ALL USING (EXISTS (SELECT 1 FROM admins WHERE admins.id = auth.uid()::text));
