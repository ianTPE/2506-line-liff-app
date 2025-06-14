-- ============================================================================
-- 更新產品圖片路徑 SQL
-- 修正圖片路徑以匹配實際檔案位置
-- ============================================================================

-- 更新所有產品的圖片路徑
UPDATE products SET image_url = '/images/products/pearl-milk-tea.webp' WHERE id = 'prod1';
UPDATE products SET image_url = '/images/products/jasmine-green-tea.webp' WHERE id = 'prod2';
UPDATE products SET image_url = '/images/products/cappuccino.webp' WHERE id = 'prod3';
UPDATE products SET image_url = '/images/products/mango-smoothie.webp' WHERE id = 'prod4';
UPDATE products SET image_url = '/images/products/croissant.webp' WHERE id = 'prod5';
UPDATE products SET image_url = '/images/products/oolong-tea.webp' WHERE id = 'prod6';
UPDATE products SET image_url = '/images/products/americano.webp' WHERE id = 'prod7';
UPDATE products SET image_url = '/images/products/latte.webp' WHERE id = 'prod8';

-- 驗證更新結果
SELECT id, name, image_url FROM products ORDER BY id;
