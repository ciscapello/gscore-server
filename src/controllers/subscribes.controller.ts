import { NextFunction, Request, Response } from 'express';
import Products from '../models/products.model.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import Subscribes from '../models/subscribes.model.js';
import Codes from '../models/codes.model.js';
import { codeGenerator } from '../utils/codeGenerator.js';
import mongoose from 'mongoose';

export const buyProduct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const products = await Products.findById(req.body.priceId);
  if (!products) {
    return next(new AppError('Incorrect product ID', 404));
  }
  const sitesCount = products.sitesCount;
  const productId = products.id;
  const userId = req.body.id;
  const currentPeriodStart = new Date();
  const currentPeriodEnd = new Date(new Date().setFullYear(new Date().getFullYear() + 1));

  let newSubscribe = await Subscribes.create({
    userId,
    productId,
    currentPeriodStart,
    currentPeriodEnd,
    sitesCount
  });

  const codes = codeGenerator(sitesCount, newSubscribe.id, userId);

  const insertCodes = await Codes.insertMany(codes);

  res.status(200).json({
    status: 'success',
    body: newSubscribe,
    codes: insertCodes
  });
});

export const getSubscribes = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.body.id;

  const subscribes = await Subscribes.aggregate([
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
});

export const activateCode = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const code = req.body.code;
  const newCode = await Codes.findOneAndUpdate({ code }, { status: 'ACTIVE' }, { new: true });
  res.status(200).json({
    status: 'success',
    data: newCode
  });
});

export const changeProduct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { productId, subscribeId } = req.body;
  const oldSubscribe = await Subscribes.findById(subscribeId);
  const product = await Products.findById(productId);

  if (!oldSubscribe || !product) {
    return next(new AppError('You should enter valid ids', 404));
  }

  let subscribes = await Subscribes.findByIdAndUpdate(
    subscribeId,
    {
      sitesCount: product.sitesCount,
      productId: product._id
    },
    { new: true }
  );

  let codes;
  const newCodes = codeGenerator(
    product.sitesCount - oldSubscribe.sitesCount,
    subscribeId,
    req.body.id
  );

  if (!newCodes) {
    await Codes.updateMany({ subscribeId }, { status: 'HOLD' }, { new: true });
    codes = await Codes.find({ subscribeId: subscribeId });
  } else {
    await Codes.insertMany(newCodes);
    codes = await Codes.find({ subscribeId: subscribeId });
  }

  res.status(200).json({
    status: 'success',
    data: {
      subscribes,
      codes
    }
  });
});

export const activateHoldedCodes = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { codeIds, subscribeId } = req.body;

    await Codes.updateMany(
      {
        _id: { $in: codeIds }
      },
      { status: 'INACTIVE' }
    );

    await Codes.deleteMany({ subscribeId: subscribeId, status: 'HOLD' });

    res.status(200).json({
      status: 'success',
      data: {}
    });
  }
);
