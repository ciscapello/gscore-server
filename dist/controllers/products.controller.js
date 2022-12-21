var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Products from '../models/products.model.js';
import catchAsync from '../utils/catchAsync.js';
import Pricing from '../models/pricing.model.js';
export const getProducts = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield Products.find();
    res.status(200).json({
        status: 'success',
        results: products.length,
        body: products
    });
}));
export const getPricing = catchAsync((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pricing = yield Pricing.find();
    res.status(200).json({
        status: 'success',
        body: pricing
    });
}));
//# sourceMappingURL=products.controller.js.map