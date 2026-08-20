import * as Helpers from '../../lib/utils/utils.helpers.js';
import * as cartModel from '../models/models.cart.js';

export const viewAllCarts = async (req, res) => {
    const userId = req.user.user_id;
    const {query} = req;
    try{
        if (parseInt(query.per_page)>100){
            return res.status(422).json({
                status:'error',
                code:422,
                message:'per_page cannot be greater than 100'
            });
        };
        const {offset, limit} = Helpers.paginationOffsetLimit(query);
        const viewAllCarts = await cartModel.getAllCarts(offset, limit, userId);
        const countCarts = await cartModel.countCarts(userId);
        const totalPages = Helpers.paginationTotalPages(countCarts.count, limit);
        if(!viewAllCarts){
            return res.status(404).json ({
                status:'error',
                code:404,
                message:'No carts are available'
            });
        };
        return res.status(200).json({
            status:'success',
            code:200,
            message:'Carts retrieved successfully',
            data:{ 
                    page: parseInt(query.page)||1,
                    total_count: parseInt(countCarts.count),
                    total_pages: parseInt(totalPages),
                    viewAllCarts
            }
        });
    }catch(error){
        return res.status(500).json({
           status:'error',
           code:500,
           message:error.message 
        });
    };
};
export const viewCart = async (req, res) => {
    const userId = req.user.user_id;
    const {cartId} = req.params.cart_id;
    try{
        const viewCart = await cartModel.checkIfCartExists(cartId, userId);
        if(!viewCart){
            return res.status(404).json ({
                status:'error',
                code:404,
                message:'No carts available'
            });
        };
        return res.status(200).json({
            status:'success',
            code:200,
            message:'Cart retrieved successfully',
            data:viewCart
        });
    }catch(error){
        return res.status(500).json({
           status:'error',
           code:500,
           message:error.message 
        });
    };
};

export const recentlyViewed = async (req, res) => {
    const userId = req.user.user_id;
    try{
        const recentCarts = await cartModel.getCurrentCarts(userId)
        if(!recentCarts){
            return res.status(404)({
                status:'error',
                code:404,
                message:'Recent carts not found'
            });
        };
        return res.status(200).json({
            status:'success',
            code:200,
            message:'Recently viewed carts retrieved successfully',
            data:recentCarts
        });
    }catch(error){
        return res.status(500).json({
            status:'error',
            code:500,
            message:error.message
        });
    };
};

export const createCart = async (req, res) => {
    const userId = req.user.user_id;
    try{
        const {budget}= req.body;
        const createCart = await cartModel.createCart(userId, budget)
        if (!createCart){
            return res.status(422).json({
                status:'error',
                code:403,
                message:'Unable to create cart'
            });
        };
        return res.status(201).json({
            status:'success',
            code:201,
            message:'Cart successfully created',
            data: createCart
        });
    }catch(error){
        return res.status(500).json({
            status:'error',
            code:500,
            message:error.message
        });
    };
};

export const addTitle = async (req, res) => {
    const userId = req.user.user_id
    const {cartId} = req.params.cart_id;
    try{
        const {cart_title, description}= req.body
        const editTitle = await cartModel.editCartName(userId, cartId, description)
        if (!editTitle){
            return res.status(422).json({
                status:'error',
                code:403,
                message:'Unable to create cart'
            });
        };
        return res.status(200).json({
            status:'success',
            code:200,
            message:'Title updated successfully',
            data: editTitle
        });
    }catch(error){
        return res.status(500).json({
            status:'error',
            code:500,
            message:error.message
        });
    };
};

export const editDeleteCart = async (req, res) => {
    const userId = req.user.user_id
    const {cartId} = req.params.cart_id;
    const {action=['edit', 'delete']} = req.query;
    try{
        if (!action){
            return res.status(422).json({
                status:'error',
                code:403,
                message:'cannot complete action'
            });
        };
        const cartExists = await cartModel.checkIfCartExists(cartId, userId);
        if (!cartExists){
            return res.status(404).json({
                status:'error',
                code:404,
                message:'Cart not found'
            });
        };
        if (action === 'edit'){
            const {cart_title, description, budget}= req.body
            const updateCart = await cartModel.updateCart(userId, cartId, description, budget)
            if (!updateCart){
                return res.status(422).json({
                    status:'error',
                    code:403,
                    message:'Unable to create cart'
                });
            };
            return res.status(200).json({
                status:'success',
                code:200,
                message:'Cart successfully created',
                data: updateCart
            });
        };
        if (action === 'delete'){
            const deleteCart = await cartModel.deleteCart(cartId, userId);
            if(!deleteCart){
                return res.status(422).json({
                    status:'error',
                    code:403,
                    message:'unable to delete cart'
            });
            }
            return res.status(200).json({
                status:'success',
                code:200,
                message:'Cart deleted successfully',
                data: deleteCart
            });
        }
        
    }catch(error){
        return res.status(500).json({
            status:'error',
            code:500,
            message:error.message
        });
    };
};
