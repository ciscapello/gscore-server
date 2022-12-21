import express from 'express';
import { getPricing, getProducts } from '../controllers/products.controller.js';
const router = express.Router();
router.route('/products').get(getProducts);
router.route('/pricing').get(getPricing);
export default router;
//# sourceMappingURL=products.route.js.map