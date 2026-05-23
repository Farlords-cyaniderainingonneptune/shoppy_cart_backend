import authRoutes from './routes.auth.js';
import cartRoutes from './routes.cart.js';
const routes = (app) => {
    app.use('/api/v1/auth', authRoutes);
    app.use('/api/v1/cart', cartRoutes);
   
};

export default routes;