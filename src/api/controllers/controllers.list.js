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
    }catch(error){
        return res.status(500).json({
            status:'error',
            code:500,
            message:error.message
        });
    };
};