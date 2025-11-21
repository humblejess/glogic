-- 检查并确保 user_rankings 表结构正确
-- 如果 language 字段已存在，这个会报错，但可以忽略

-- 先检查表结构
-- SELECT sql FROM sqlite_master WHERE type='table' AND name='user_rankings';

-- 如果 language 字段不存在，添加它（但根据错误信息，它应该已经存在了）
-- ALTER TABLE user_rankings ADD COLUMN language TEXT;

-- 如果表结构不对，可以重建（注意：会删除所有数据）
-- DROP TABLE IF EXISTS user_rankings;
-- CREATE TABLE user_rankings (
--   id INTEGER PRIMARY KEY AUTOINCREMENT,
--   session_id TEXT NOT NULL,
--   ranking_order TEXT NOT NULL,
--   language TEXT,
--   user_agent TEXT,
--   created_at TEXT DEFAULT CURRENT_TIMESTAMP
-- );

