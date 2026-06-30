CREATE TYPE user_status AS ENUM ('active', 'inactive');
CREATE TYPE user_roles AS ENUM ('user', 'admin');
CREATE TYPE cart_status AS ENUM ('active', 'archived', 'deleted');
CREATE TYPE expense_status AS ENUM ('deficit', 'surplus', 'stagnant');
CREATE TYPE item_status AS ENUM ('purchased', 'unpurchased');
CREATE TYPE prompt_status AS ENUM ('ongoing', 'successful', 'failed');


CREATE TABLE IF NOT EXISTS item_categories(
	id SERIAL PRIMARY KEY,
	name VARCHAR(250) UNIQUE NOT NULL,
    description VARCHAR,
	category_image TEXT,
	popularity INT DEFAULT 0,
	is_deleted BOOLEAN DEFAULT false,
	created_at TIMESTAMPTZ DEFAULT NOW(),
	updated_at TIMESTAMPTZ DEFAULT NOW(),
	deleted_at TIMESTAMPTZ
);
INSERT INTO item_categories(name)
VALUES
	('Dairy'),
	('Vegetables'),
	('Meat'),
	('Tools'),
	('Electronics'),
	('Furniture'),
	('Household Accessories'),
	('Repairs'),
	('Expendables');

CREATE TABLE IF NOT EXISTS users(
	id SERIAL,
	user_id UUID PRIMARY KEY DEFAULT uuidv7(),
	google_id VARCHAR(255) UNIQUE,
	email VARCHAR(250) UNIQUE NOT NULL,
	password TEXT,
	display_name VARCHAR(255),
	status user_status DEFAULT 'active',
	role user_roles DEFAULT 'user',
	is_verified_account BOOLEAN DEFAULT false,
	verification_code VARCHAR,
	verification_code_expire_at TIMESTAMPTZ,
	is_deleted BOOLEAN DEFAULT false,
	logged_in BOOLEAN DEFAULT false,
	last_login_at TIMESTAMPTZ,
	created_at TIMESTAMPTZ DEFAULT NOW(),
	updated_at TIMESTAMPTZ DEFAULT NOW(),
	deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS carts(
	id SERIAL,
	user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
	cart_id UUID PRIMARY KEY DEFAULT uuidv7(),
	cart_title TEXT NOT NULL DEFAULT 'untitled',
    description TEXT,
	status cart_status DEFAULT 'active',
	budget DECIMAL(8,2) NOT NULL DEFAULT 0,
	total_cost DECIMAL(8,2) NOT NULL DEFAULT 0,
	currency TEXT DEFAULT 'USD',
	is_deleted BOOLEAN DEFAULT false,
	last_viewed_at TIMESTAMPTZ DEFAULT NOW(),
	created_at TIMESTAMPTZ DEFAULT NOW(),
	updated_at TIMESTAMPTZ DEFAULT NOW(),
	deleted_at TIMESTAMPTZ
);
CREATE TABLE IF NOT EXISTS items(
	id SERIAL,
	item_id UUID PRIMARY KEY DEFAULT uuidv7(),
	name VARCHAR NOT NULL,
	cart_id UUID NOT NULL REFERENCES carts(cart_id)ON DELETE CASCADE,
	price DECIMAL(8,2) NOT NULL DEFAULT 0 CHECK(price>=0),
	quantity DECIMAL(8,2) NOT NULL DEFAULT 1 CHECK(quantity>=0),
	category INT REFERENCES item_categories(id)ON DELETE CASCADE,
	status item_status DEFAULT 'unpurchased',
    is_deleted BOOLEAN DEFAULT false,
	created_at TIMESTAMPTZ DEFAULT NOW(),
	updated_at TIMESTAMPTZ DEFAULT NOW(),
	deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS prompts(
	id SERIAL,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
	chat_id UUID PRIMARY KEY DEFAULT uuidv7(),
	prompt VARCHAR NOT NULL,
	response VARCHAR,
	status prompt_status DEFAULT 'ongoing',
	prompted_at TIMESTAMPTZ DEFAULT NOW(),
	deleted_at TIMESTAMPTZ
);


INSERT INTO carts (user_id, cart_title, description, budget)
SELECT user_id, 'Sample_GroceriesXY70052', 'This is a cart sample containing groceries.', 500.00
FROM users
WHERE is_deleted = false
AND NOT EXISTS (
    SELECT 1 FROM carts 
    WHERE carts.user_id = users.user_id 
      AND carts.cart_title = 'Sample_GroceriesXY70052'
  );

INSERT INTO items (name, cart_id, price, quantity, category, status)
SELECT 
    v.name,
    c.cart_id,
    v.price,
    v.quantity,
    ic.id,
    'unpurchased'::item_status
FROM (
    VALUES
        ('Milk', 3.99, 2, 'Dairy'),
        ('Cheese', 5.49, 1, 'Dairy'),
        ('Broccoli', 2.99, 3, 'Vegetables'),
        ('Tomatoes', 1.99, 5, 'Vegetables'),
        ('Chicken Breast', 8.99, 2, 'Meat'),
        ('Ground Beef', 6.99, 1, 'Meat'),
        ('Bread', 2.49, 1, 'Expendables'),
        ('Eggs', 4.99, 2, 'Dairy')
) AS v(name, price, quantity, category_name)
JOIN carts c ON c.cart_title = 'Sample_GroceriesXY70052'
JOIN item_categories ic ON ic.name = v.category_name;