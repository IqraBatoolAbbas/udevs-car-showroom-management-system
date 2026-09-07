const router = require('express').Router();
const { body } = require('express-validator');
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middleware/validateMiddleware');
const { isAuthenticated } = require('../middleware/authMiddleware');
const { register, login, me } = require('../controllers/authController');

const credentials = [
  body('email').trim().isEmail().withMessage('A valid email is required'),
  body('password').isLength({ min: 8, max: 128 }).withMessage('Password must be 8-128 characters')
];
router.post('/register', [...credentials, body('name').trim().notEmpty().isLength({ max: 500 }), validate], asyncHandler(register));
router.post('/login', [...credentials, validate], asyncHandler(login));
router.get('/me', isAuthenticated, asyncHandler(me));
router.post('/logout', (req, res) => {
  res.clearCookie('access_token', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
  res.json({ success: true, message: 'Logged out' });
});
module.exports = router;
