const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { isAuthenticated, authorize } = require('../middleware/authMiddleware');
const makeResourceController = require('../controllers/resourceController');
const { Car, Supplier, Customer, Notification, ActivityLog, Setting } = require('../models');
const applicationController = require('../controllers/applicationController');

const createRoutes = (controller, writeRoles = ['admin']) => {
  const router = express.Router();
  router.get('/', asyncHandler(controller.list));
  router.get('/:id', asyncHandler(controller.get));
  router.post('/', authorize(...writeRoles), asyncHandler(controller.create));
  router.put('/:id', authorize(...writeRoles), asyncHandler(controller.update));
  router.delete('/:id', authorize(...writeRoles), asyncHandler(controller.remove));
  return router;
};

const router = express.Router();
router.use(isAuthenticated);
router.use('/cars', createRoutes(makeResourceController(Car, ['make', 'model']), ['admin', 'inventory']));
router.use('/suppliers', createRoutes(makeResourceController(Supplier, ['companyName', 'contactPerson']), ['admin', 'inventory']));
router.use('/customers', createRoutes(makeResourceController(Customer, ['name', 'email', 'cnic']), ['admin', 'sales']));
const applications = createRoutes(applicationController, ['admin', 'sales']);
applications.patch('/:id/status', authorize('admin', 'sales'), asyncHandler(applicationController.updateStatus));
router.use('/applications', applications);
router.use('/notifications', createRoutes(makeResourceController(Notification, ['title', 'message']), ['admin']));
router.use('/activity-logs', createRoutes(makeResourceController(ActivityLog, ['description']), ['admin']));
router.use('/settings', createRoutes(makeResourceController(Setting, ['key']), ['admin']));
module.exports = router;
