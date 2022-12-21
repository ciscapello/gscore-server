import express from 'express';
import { login, protect, signUp } from '../controllers/auth.controller.js';
import { deleteUser, setPassword, updateUserInfo } from '../controllers/users.controller.js';
const router = express.Router();
router.route('/users/sign-up').post(signUp);
router.route('/users/sign-in').post(login);
router.route('/users/update-password').patch(protect, setPassword);
router.route('/users').patch(protect, updateUserInfo);
router.route('/users/:id').delete(protect, deleteUser);
export default router;
//# sourceMappingURL=users.route.js.map