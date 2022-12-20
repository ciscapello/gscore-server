import express from 'express';
import { protect } from '../controllers/auth.controller.js';
import { getPricing, getProducts } from '../controllers/products.controller.js';
import {
  activateCode,
  activateHoldedCodes,
  buyProduct,
  changeProduct,
  getSubscribes
} from '../controllers/subscribes.controller.js';

const router = express.Router();

router.route('/payments/buy').post(protect, buyProduct);
router.route('/subscribe/self').get(protect, getSubscribes);
router.route('/code/activate').post(protect, activateCode);
router.route('/subscribe/change-product').post(protect, changeProduct);
router.route('/code/manage').put(protect, activateHoldedCodes);

export default router;
