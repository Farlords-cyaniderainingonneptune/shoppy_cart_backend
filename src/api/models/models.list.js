import db from "../../config/db/index.js";
import queries from "../queries/queries.list.js";

export const viewList = async (cart_id) => {
    const items = await db.any(queries.viewList[cart_id]);
    return items;
};

export const addItem = async (cart_id, name, price, quantity) => {
    const item = await db.oneOrNone(queries.addItem[cart_id, name, price, quantity]);
    return item;
};

export const editItem = async (item_id, name, price, quantity) => {
    const item = await db.oneOrNone(queries.editItem[item_id, name, price, quantity]);
    return item;
};

export const deleteItem = async (item_id) => {
    const item = await db.oneOrNone(queries.deleteItem[item_id]);
    return item;
};

export const setItemToPurchased = async (item_id) => {
    const item = await db.oneOrNone(queries.setItemToPurchased[item_id]);
    return item;
};
export const setItemStatus = async (item_id, status) => {
    const item = await db.oneOrNone(queries.setItemStatus[item_id, status]);
    return item;
};
export const searchForItem = async (user_id, title) => {
    const item = await db.many(queries.searchForItem[user_id, title]);
    return item;
};