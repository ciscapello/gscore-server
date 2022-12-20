import { NextFunction, Request, Response } from 'express';
import Users from '../models/users.model.js';
import catchAsync from '../utils/catchAsync.js';
import bcrypt from 'bcryptjs';
import AppError from '../utils/appError.js';

export const setPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { currentPassword, newPassword } = req.body;
  const user = await Users.findById(req.body.id).select('+password');

  if (!user || !(await user.correctPassword(currentPassword, user.password))) {
    return next(new AppError('Incorrect current password', 401));
  }

  const password = await bcrypt.hash(req.body.newPassword, 12);
  await Users.findByIdAndUpdate(req.body.id, { password });

  res.status(200).send('Password was successfully update');
});

export const updateUserInfo = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.username || !req.body.email) {
      return next(new AppError('You should enter username and email', 401));
    }
    const newData = await Users.findByIdAndUpdate(
      req.body.id,
      {
        email: req.body.email,
        username: req.body.username
      },
      { new: true }
    );
    res.status(200).json({
      status: 'success',
      user: newData
    });
  }
);

export const deleteUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  await Users.findByIdAndRemove(req.params.id);

  res.status(200).json({
    status: 'success'
  });
});
