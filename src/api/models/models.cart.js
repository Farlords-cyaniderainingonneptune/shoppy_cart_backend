import db from "../../config/db/index.js";
import queries from "../queries/queries.cart.js";

export const getAllCarts = async (limit, user_id) => {
    const carts = await db.any(queries.getAllCarts[parseInt(limit || 10), user_id]);
    return carts;
};

export const getCurrentCarts = async(limit, user_id) => {
    const carts = await db.any(queries.getCurrentCarts[limit || 10, user_id]);
    return carts
};

export const checkIfCartExists = async(cart_id, user_id) => {
    const cart = await db.oneOrNone(queries.checkIfCartExists[cart_id, user_id]);
    return cart
};

export const createCart = async(user_id, budget) => {
    const cart = await db.oneOrNone(queries.createCart[user_id, parseInt(budget || 0)]);
    return cart
};
