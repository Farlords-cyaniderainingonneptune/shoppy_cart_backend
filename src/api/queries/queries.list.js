export default{
    viewList:`
    SELECT * FROM
    items
    WHERE cart_id = $1
    AND is_deleted = true
    `,
    addItem:`
    INSERT INTO items(cart_id, name, price, quantity)
    VALUES($1, $2, $3, $4)
    `,
    editItem:`
    UPDATE items
    SET updated_at = NOW(),
    name = COALESCE ($2, name),
    price = COALESCE ($3, name),
    quantity = COALESCE ($4, quantity)
    WHERE item_id = $1
    AND is_deleted = $2
    RETURNING *
    `,
    deleteItem:`
    UPDATE items
    SET deleted_at = NOW(),
    is_deleted = true
    WHERE item_id = $1
    RETURNING *
    `,
    setItemToPurchased:`
    UPDATE items
    SET updated_at = NOW(),
    status = 'purchased'
    WHERE item_id = $1
    AND is_deleted = false
    RETURNING *
    `,
    setItemStatus:`
    UPDATE items
    SET update_at = NOW(),
    status = $2
    WHERE item_id = $1
    AND is_deleted = false
    `,
    searchForItem:`
    SELECT * FROM
    items 
    WHERE name ILIKE $2
    AND user_id = $1
    AND is_deleted = false
    `
}