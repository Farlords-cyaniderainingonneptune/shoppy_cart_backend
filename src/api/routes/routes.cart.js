import { Router } from 'express';
import * as cartController from '../controllers/controllers.cart.js';
import * as listController from '../controllers/controllers.list.js';
import models from '../middlewares/middlewares.models.js';
import * as authMiddleware from '../middlewares/middlewares.auth.js';
const router = Router();

// router.get('/',
//     authMiddleware.verifyToken,
//      cartController.viewCarts
//     );

// router.post('/create',
//     authMiddleware.verifyToken,
//     cartController.createCart
// );

// router.patch('/:cart_id/title',
//     authMiddleware.verifyToken,
//     cartController.addTitle
// );

// router.patch('/:cart_id/edit',
//     authMiddleware.verifyToken,
//     cartController.editCart
// );

// router.get('/:cart_id/viewCart',
//     authMiddleware.verifyToken,
//     cartController.viewCart
// );
// router.delete('/:cart_id',
//     authMiddleware.verifyToken,
//     cartController.deleteCart
// );

// router.get('/:item_id',
//     authMiddleware.verifyToken,
//     listController.getItem
// );

export default router;