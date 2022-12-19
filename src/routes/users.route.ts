import express from 'express';
import { login, protect, signUp } from '../controllers/auth.controller.js';
import { getUsers, deleteUser } from '../controllers/users.controller.js';

const router = express.Router();

router.route('/signup').post(signUp);
router.route('/login').post(login);

router.route('/users').get(protect, getUsers);
router.route('/users/:id').delete(protect, deleteUser);

export default router;
