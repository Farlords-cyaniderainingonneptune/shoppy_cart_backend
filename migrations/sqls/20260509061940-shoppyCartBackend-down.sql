-- Delete sample items from sample grocery carts
DELETE FROM items
WHERE cart_id IN (
  SELECT cart_id FROM carts 
  WHERE cart_title = 'Sample_GroceriesXY70052'
);

-- Delete sample grocery carts
DELETE FROM carts
WHERE cart_title = 'Sample_GroceriesXY70052';

DROP TABLE IF EXISTS prompts CASCADE;
DROP TABLE IF EXISTS items CASCADE;
DROP TABLE IF EXISTS carts CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS item_categories CASCADE;

DROP TYPE IF EXISTS prompt_status CASCADE;
DROP TYPE IF EXISTS item_status CASCADE;
DROP TYPE IF EXISTS expense_status CASCADE;
DROP TYPE IF EXISTS cart_status CASCADE;
DROP TYPE IF EXISTS user_roles CASCADE;
DROP TYPE IF EXISTS user_status CASCADE;