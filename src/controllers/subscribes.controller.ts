import { NextFunction, Request, Response } from 'express';
import Products from '../models/products.model.js';
import catchAsync from '../utils/catchAsync.js';
import Pricing from '../models/pricing.model.js';
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
    currentPeriodEnd
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
  console.log(userId);

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
