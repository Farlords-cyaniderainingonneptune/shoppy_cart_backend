import { Router } from 'express';
import * as cartController from '../controllers/controllers.cart.js';
import * as listController from '../controllers/controllers.list.js';
import models from '../middlewares/middlewares.models.js';
import * as authMiddleware from '../middlewares/middlewares.auth.js';
const router = Router();

router.get('/',
     cartController.viewCarts
    );

router.post('/create',
    cartController.createCart
);

router.patch('/:cart_id/title',
    cartController.addTitle
);

router.patch('/:cart_id/edit',
    cartController.editCart
);

router.get('/:cart_id/viewCart',
    cartController.viewCart
);
router.delete('/:cart_id',
    cartController.deleteCart
);

router.get('/:item_id',
    listController.getItem
)

export default router;