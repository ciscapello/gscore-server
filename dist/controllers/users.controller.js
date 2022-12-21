var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Users from '../models/users.model.js';
import catchAsync from '../utils/catchAsync.js';
import bcrypt from 'bcryptjs';
import AppError from '../utils/appError.js';
export const setPassword = catchAsync((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { currentPassword, newPassword } = req.body;
    const user = yield Users.findById(req.body.id).select('+password');
    if (!user || !(yield user.correctPassword(currentPassword, user.password))) {
        return next(new AppError('Incorrect current password', 401));
    }
    const password = yield bcrypt.hash(req.body.newPassword, 12);
    yield Users.findByIdAndUpdate(req.body.id, { password });
    res.status(200).send('Password was successfully update');
}));
export const updateUserInfo = catchAsync((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.username || !req.body.email) {
        return next(new AppError('You should enter username and email', 401));
    }
    const newData = yield Users.findByIdAndUpdate(req.body.id, {
        email: req.body.email,
        username: req.body.username
    }, { new: true });
    res.status(200).json({
        status: 'success',
        user: newData
    });
}));
export const deleteUser = catchAsync((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield Users.findByIdAndRemove(req.params.id);
    res.status(200).json({
        status: 'success'
    });
}));
//# sourceMappingURL=users.controller.js.map