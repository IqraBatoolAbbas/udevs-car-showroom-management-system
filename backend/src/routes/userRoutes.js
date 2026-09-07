const router = require('express').Router();
const { body } = require('express-validator');
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middleware/validateMiddleware');
const { isAuthenticated, authorize } = require('../middleware/authMiddleware');
const controller = require('../controllers/userController');

router.use(isAuthenticated);
router.get('/', authorize('admin'), asyncHandler(controller.getUsers));
router.get('/:id', asyncHandler(controller.getUser));
router.post('/', authorize('admin'), [
  body('name').trim().notEmpty(), body('email').isEmail(), body('password').isLength({ min: 8 }), validate
], asyncHandler(controller.createUser));
router.put('/', asyncHandler(controller.updateUser));
router.delete('/:id', authorize('admin'), asyncHandler(controller.deleteUser));
module.exports = router;
