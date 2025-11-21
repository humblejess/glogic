-- 为 page_views 表添加 ip_address 字段
ALTER TABLE page_views ADD COLUMN ip_address TEXT;

-- 为 user_rankings 表添加 ip_address 字段
ALTER TABLE user_rankings ADD COLUMN ip_address TEXT;

