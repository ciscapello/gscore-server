import { NextFunction, Request, Response } from 'express';
import Users from '../models/users.model.js';
import catchAsync from '../utils/catchAsync.js';
import jwt from 'jsonwebtoken';
import AppError from '../utils/appError.js';
import { Types } from 'mongoose';

const signToken = (id: Types.ObjectId) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (
  user: { username: string; email: string; _id: Types.ObjectId },
  statusCode: number,
  res: Response
) => {
  const token = signToken(user._id);

  res.status(statusCode).json({
    status: 'success',
    token,
    user: {
      name: user.username,
      email: user.email,
      id: user._id
    }
  });
};

export const signUp = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  console.log('TUTUTUTU');
  const newUser = await Users.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  });

  createSendToken(newUser, 201, res);
});

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  const user = await Users.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  createSendToken(user, 201, res);
});

export const protect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    console.log(req.cookies);
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET!);
  console.log(decoded);
  req.body = { ...req.body, id: (<any>decoded).id };

  const currentUser = await Users.findById((<any>decoded).id);
  if (!currentUser) {
    return next(new AppError('The user belonging to this token does no longer exist.', 401));
  }

  next();
});
