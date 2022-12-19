import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Products from '../models/products.model.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import { IProducts } from '../models/products.model.js';

export const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  const products = await Products.find();
  res.status(200).json({
    status: 'success',
    results: products.length,
    body: products
  });
});

export const getProduct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  let product;
  if (mongoose.Types.ObjectId.isValid(req.params.id)) {
    product = await Products.findById(req.params.id);
  }
  if (!product) {
    return next(new AppError('There is no product with this ID', 400));
  }
  res.status(200).json({
    status: 'success',
    body: product
  });
});

export const createProduct = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.files) {
    return next(new AppError('You should provide at least one image', 400));
  }
  const newProduct = await Products.create(req.body);
  res.status(200).json({
    status: 'success',
    data: { newProduct }
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
    let oldProduct = await Products.findById(req.params.id);
    oldImages = oldProduct?.images;
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
