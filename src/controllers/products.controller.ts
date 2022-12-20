import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Products from '../models/products.model.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import { IProducts } from '../models/products.model.js';
import Pricing from '../models/pricing.model.js';

export const getProducts = catchAsync(async (req: Request, res: Response) => {
  const products = await Products.find();
  res.status(200).json({
    status: 'success',
    results: products.length,
    body: products
  });
});

export const getPricing = catchAsync(async (req: Request, res: Response) => {
  const pricing = await Pricing.find();
  res.status(200).json({
    status: 'success',
    body: pricing
  });
});

export const deleteProduct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  let product: IProducts | null = null;
  if (mongoose.Types.ObjectId.isValid(req.params.id)) {
    product = await Products.findByIdAndDelete(req.params.id);
  }
  if (!product) {
    return next(new AppError('There is no products with this ID', 404));
  }
  res.status(200).json({
    status: 'success'
  });
});

export const updateProduct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  let product: IProducts | null = null;
  let oldImages;
  if (mongoose.Types.ObjectId.isValid(req.params.id)) {
    product = await Products.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
  }
  res.status(200).json({
    status: 'success',
    data: product
  });
});
