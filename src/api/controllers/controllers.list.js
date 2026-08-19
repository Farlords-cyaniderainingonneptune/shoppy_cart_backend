import * as Helpers from '../../lib/utils/utils.helpers.js';
import * as cartModel from '../models/models.cart.js';
import * as listModel from '../models/models.list.js';

export const viewList = async (req, res) => {
    const userId = req.user.user_id;
    const {cartId} = req.params.cart_id;
    try{
        const cartExists = await cartModel.checkIfCartExists(cartId);
        if(!cartExists){
           return res.status(404).json({
                status:'error',
                code:404,
                message:'Cart does not exist'
            }); 
        };
        const cartList = await listModel.viewList(cartId);
        if(!cartList){
            return res.status(404).json({
                status:'error',
                code:404,
                message:'Unable to find list'
            });
        };
        return res.status(200).json({
            status:'success',
            code:200,
            message:'List retrieved successfully',
            data: cartList
        });
    }catch(error){
        return res.status(500).json({
            status:'error',
            code:500,
            message:error.message
        });
    };
};

export const addItem = async(req, res) => {
    const userId = req.user.user_id;
    const {cart_id} = req.params;
    try{
        const{name, price, quantity} = req.body
        if(!name || typeof name!=='string'){
           return res.status(400).json({
            status:'error',
            code:400,
            message:'Invalid product name'
        }); 
        };
        const cartExists = await cartModel.checkIfCartExists(cart_id, userId);
        if(!cartExists){
           return res.status(404).json({
            status:'error',
            code:404,
            message:'Cart does not exists'
        });  
        };

        const itemCost = parseInt(price * quantity);
        const cost = cartExists.total_cost;
        const newItem = await listModel.addItem(cart_id, name, price, quantity);
        if(!newItem){
            return res.status(422).json({
            status:'error',
            code:422,
            message:'Unable to add new item'
        }); 
        };
        const newTotalCost = parseInt(cost + itemCost)
        const updateCost = await listModel.updateTotalCost(cart_id, newTotalCost);
        return res.status(200).json({
            status:'Success',
            code:200,
            message:'Item succesfully added',
            data: newItem
        }); 
    }catch(error){
        return res.status(500).json({
            status:'error',
            code:500,
            message:error.message
        });
    };
};
export const editItem = async(req, res) => {
    const userId = req.user.user_id;
    const {item_id} = req.params;
    try{
        const{name, price, quantity} = req.body
        if(!name || typeof name!=='string'){
           return res.status(400).json({
            status:'error',
            code:400,
            message:'Invalid product name'
        }); 
        };
        const cartExists = await cartModel.checkIfItemExists(cart_id, userId);
        if(!cartExists){
           return res.status(404).json({
            status:'error',
            code:404,
            message:'Cart does not exists'
        });  
        };
        const itemCost = parseInt(price * quantity);
    
        const newItem = await listModel.addItem(cart_id, name, price, quantity);
        if(!newItem){
            return res.status(422).json({
            status:'error',
            code:422,
            message:'Unable to add new item'
        }); 
        };
        return res.status(200).json({
            status:'Success',
            code:200,
            message:'Item succesfully added',
            data: {...newItem, itemCost}
        }); 
    }catch(error){
        return res.status(500).json({
            status:'error',
            code:500,
            message:error.message
        });
    };
};

export const deleteItem = async(req, res) => {
    const userId = req.user.user_id;
    const {item_id} = req.body;
    try{
        const itemExists = await listModel.checkIfItemExists(item_id);
        if(!itemExists){
            return res.status(404).json({
                status:'error',
                code:404,
                message:'Item does not exist'
            });
        };
        const deleteItem = await listModel.deleteItem(item_id);
        if(!deleteItem){
            return res.status(422).json({
                status:'error',
                code:422,
                message:'Unable to delete item'
            });
        };
        return res.status(200).json({
                status:'error',
                code:200,
                message:'Item successfully deleted',
                data: deleteItem
            });
    }catch(error){
        return res.status(500).json({
            status:'error',
            code:500,
            message:error.message
        });
    };
}; 
