const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { isAuthenticated, authorize } = require('../middleware/authMiddleware');
const makeResourceController = require('../controllers/resourceController');
const { Car, Supplier, Customer, Notification, ActivityLog, Setting } = require('../models');
const applicationController = require('../controllers/applicationController');
const activityLogController = require('../controllers/activityLogController');

const createRoutes = (controller, writeRoles = ['admin'], readRoles) => {
  const router = express.Router();
  const read = readRoles ? authorize(...readRoles) : (req, res, next) => next();
  router.get('/', read, asyncHandler(controller.list));
  router.get('/:id', read, asyncHandler(controller.get));
  router.post('/', authorize(...writeRoles), asyncHandler(controller.create));
  router.put('/:id', authorize(...writeRoles), asyncHandler(controller.update));
  router.delete('/:id', authorize(...writeRoles), asyncHandler(controller.remove));
  return router;
};

const router = express.Router();
router.use(isAuthenticated);
router.use('/cars', createRoutes(makeResourceController(Car, ['make', 'model']), ['admin', 'inventory']));
router.use('/suppliers', createRoutes(makeResourceController(Supplier, ['companyName', 'contactPerson']), ['admin', 'inventory'], ['admin', 'inventory']));
router.use('/customers', createRoutes(makeResourceController(Customer, ['name', 'email', 'cnic']), ['admin', 'sales'], ['admin', 'sales']));
const applications = createRoutes(applicationController, ['admin', 'sales', 'customer'], ['admin', 'sales', 'customer']);
applications.patch('/:id/status', authorize('admin', 'sales'), asyncHandler(applicationController.updateStatus));
router.use('/applications', applications);
router.use('/notifications', createRoutes(makeResourceController(Notification, ['title', 'message']), ['admin'], ['admin', 'sales', 'inventory', 'customer']));
const activityLogRouter = express.Router();

activityLogRouter.get(
  '/',
  authorize('admin'),
  asyncHandler(activityLogController.list)
);

activityLogRouter.get(
  '/:id',
  authorize('admin'),
  asyncHandler(activityLogController.get)
);

router.use('/activity-logs', activityLogRouter);
router.use('/settings', createRoutes(makeResourceController(Setting, ['key']), ['admin'], ['admin']));
module.exports = router;

