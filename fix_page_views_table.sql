-- 重建 page_views 表（删除重复的 language 字段）
-- 注意：这会删除所有数据，但表是空的所以没问题

DROP TABLE IF EXISTS page_views;

CREATE TABLE page_views (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  page_path TEXT NOT NULL,
  language TEXT,
  referrer TEXT,
  user_agent TEXT,
  country_code TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_views_created ON page_views(created_at);
CREATE INDEX IF NOT EXISTS idx_views_language ON page_views(language);
CREATE INDEX IF NOT EXISTS idx_views_session ON page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_views_country ON page_views(country_code);

