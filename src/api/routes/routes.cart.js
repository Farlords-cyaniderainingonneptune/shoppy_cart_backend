import { Router } from 'express';
import * as cartController from '../controllers/controllers.cart.js';
import * as listController from '../controllers/controllers.list.js';
import models from '../middlewares/middlewares.models.js';
import * as authMiddleware from '../middlewares/middlewares.auth.js';
const router = Router();
// Allows you to view all the av ailable carts
router.get('/',
    authMiddleware.verifyToken,
    cartController.viewAllCarts
);
// Allows you to see the carts ordered by the recently opened
router.get('/recent',
    authMiddleware.verifyToken,
    cartController.recentlyViewed
);
// Allows a user to create a cart
router.post('/create',
    authMiddleware.verifyToken,
    cartController.createCart
);
// Allows a user to change the title of the cart
router.patch('/:cart_id/title',
    authMiddleware.verifyToken,
    cartController.addTitle
);
// edits or deletes a cart
router.patch('/:cart_id/edit_delete',
    authMiddleware.verifyToken,
    cartController.editDeleteCart
);
// For viewing information on a singular cart
router.get('/:cart_id/viewCart',
    authMiddleware.verifyToken,
    cartController.viewCart
);

// List routes
router.get('/:cart_id',
    authMiddleware.verifyToken,
    listController.viewList
);
router.post('/:cart_id',
    authMiddleware.verifyToken,
    listController.addItem
);
router.patch('/:item_id',
    authMiddleware.verifyToken,
    listController.editItem
);
router.delete('/:item_id',
    authMiddleware.verifyToken,
    listController.deleteItem
);

export default router;