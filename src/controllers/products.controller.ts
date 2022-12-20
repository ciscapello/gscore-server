import { Request, Response } from 'express';
import Products from '../models/products.model.js';
import catchAsync from '../utils/catchAsync.js';
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
