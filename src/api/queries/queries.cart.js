export default{
    getAllCarts:`
    SELECT * FROM
    carts
    WHERE user_id = $2
    AND is_deleted = false
    ORDER BY created_at DESC
    LIMIT $1
    `,
    getCurrentsCarts:`
    SELECT * FROM
    carts
    WHERE user_id = $2
    AND is_deleted = false
    ORDER BY last_viewed_at DESC
    LIMIT $1
    `,
    checkIfCartExists:`
    SELECT * FROM
    carts
    WHERE cart_id = $1
    AND user_id = $2
    `,
    createCart:`
    INSERT INTO carts (user_id, budget)
    VALUES ($1, $2)
    RETURNING *
    `,
    editCartName:`
    UPDATE carts
    SET updated_at = NOW(),
    cart_title = COALESCE ($4, cart_title),
    description = COALESCE($3, description)
    WHERE cart_id = $2
    AND user_id = $1
    RETURNING *
    `,
    updateCart:`
    UPDATE carts
    SET updated_at = NOW(),
    cart_title = COALESCE ($3, cart_title),
    description = COALESCE($4, description),
    budget = COALESCE($5, budget)
    WHERE cart_id = $2
    AND user_id = $1
    RETURNING *
    `,
    updateCost:`
    UPDATE carts
    SET updated_at = NOW(),
    total_cost = COALESCE($2, total_cost),
    cart_id = $1
    RETURNING *
    `,
    deleteCart:`
    UPDATE carts
    SET updated_at = NOW(),
    is_deleted = true
    WHERE cart_id = $1
    AND user_id = $2
    RETURNING *
    `,
    updateCartStatus:`
    UPDATE carts
    SET updated_at = NOW(),
    status = $3
    WHERE cart_id = $1
    AND user_id = $2
    RETURNING *
    `,
    updateCurrency:`
    UPDATE carts
    SET updated_at = NOW(),
    currency = $2
    WHERE cart_id = $1
    AND user_id = $2
    RETURNING *
    `,
    updateLastViewed:`
    UPDATE carts
    SET last_viewed_at = NOW()
    WHERE cart_id = $1
    AND user_id = $2
    RETURNING *
    `


}