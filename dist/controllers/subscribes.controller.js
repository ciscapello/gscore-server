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
import AppError from '../utils/appError.js';
import Subscribes from '../models/subscribes.model.js';
import Codes from '../models/codes.model.js';
import { codeGenerator } from '../utils/codeGenerator.js';
import mongoose from 'mongoose';
export const buyProduct = catchAsync((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield Products.findById(req.body.priceId);
    if (!products) {
        return next(new AppError('Incorrect product ID', 404));
    }
    const sitesCount = products.sitesCount;
    const productId = products.id;
    const userId = req.body.id;
    const currentPeriodStart = new Date();
    const currentPeriodEnd = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
    let newSubscribe = yield Subscribes.create({
        userId,
        productId,
        currentPeriodStart,
        currentPeriodEnd,
        sitesCount
    });
    const codes = codeGenerator(sitesCount, newSubscribe.id, userId);
    const insertCodes = yield Codes.insertMany(codes);
    res.status(200).json({
        status: 'success',
        body: newSubscribe,
        codes: insertCodes
    });
}));
export const getSubscribes = catchAsync((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.id;
    const subscribes = yield Subscribes.aggregate([
        {
            $match: { userId: new mongoose.Types.ObjectId(userId) }
        },
        {
            $lookup: {
                from: 'codes',
                localField: '_id',
                foreignField: 'subscribeId',
                as: 'codes'
            }
        }
    ]);
    res.status(200).json({
        status: 'success',
        data: subscribes
    });
}));
export const activateCode = catchAsync((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const code = req.body.code;
    const newCode = yield Codes.findOneAndUpdate({ code }, { status: 'ACTIVE' }, { new: true });
    res.status(200).json({
        status: 'success',
        data: newCode
    });
}));
export const changeProduct = catchAsync((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId, subscribeId } = req.body;
    const oldSubscribe = yield Subscribes.findById(subscribeId);
    const product = yield Products.findById(productId);
    if (!oldSubscribe || !product) {
        return next(new AppError('You should enter valid ids', 404));
    }
    let subscribes = yield Subscribes.findByIdAndUpdate(subscribeId, {
        sitesCount: product.sitesCount,
        productId: product._id
    }, { new: true });
    let codes;
    const newCodes = codeGenerator(product.sitesCount - oldSubscribe.sitesCount, subscribeId, req.body.id);
    if (!newCodes) {
        yield Codes.updateMany({ subscribeId }, { status: 'HOLD' }, { new: true });
        codes = yield Codes.find({ subscribeId: subscribeId });
    }
    else {
        yield Codes.insertMany(newCodes);
        codes = yield Codes.find({ subscribeId: subscribeId });
    }
    res.status(200).json({
        status: 'success',
        data: {
            subscribes,
            codes
        }
    });
}));
export const activateHoldedCodes = catchAsync((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { codeIds, subscribeId } = req.body;
    yield Codes.updateMany({
        _id: { $in: codeIds }
    }, { status: 'INACTIVE' });
    yield Codes.deleteMany({ subscribeId: subscribeId, status: 'HOLD' });
    res.status(200).json({
        status: 'success',
        data: {}
    });
}));
//# sourceMappingURL=subscribes.controller.js.map