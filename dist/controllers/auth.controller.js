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
import jwt from 'jsonwebtoken';
import AppError from '../utils/appError.js';
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};
const createSendToken = (user, statusCode, res) => {
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
export const signUp = catchAsync((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield Users.findOne({ email: req.body.email })) {
        return next(new AppError('Email is already exists, enter another email', 400));
    }
    const newUser = yield Users.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });
    createSendToken(newUser, 201, res);
}));
export const login = catchAsync((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new AppError('Please provide email and password!', 400));
    }
    const user = yield Users.findOne({ email }).select('+password');
    if (!user || !(yield user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }
    createSendToken(user, 201, res);
}));
export const protect = catchAsync((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.body = Object.assign(Object.assign({}, req.body), { id: decoded.id });
    const currentUser = yield Users.findById(decoded.id);
    if (!currentUser) {
        return next(new AppError('The user belonging to this token does no longer exist.', 401));
    }
    next();
}));
//# sourceMappingURL=auth.controller.js.map