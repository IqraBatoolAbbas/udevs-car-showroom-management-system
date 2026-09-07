const { Application } = require('../models');
const makeResourceController = require('./resourceController');

const base = makeResourceController(Application, ['fullName', 'email', 'selectedCar']);
const list = async (req, res) => {
  if (req.user.role === 'customer') req.query.customerId = req.userId;
  return base.list(req, res);
};
const get = async (req, res) => {
  const application = await Application.findByPk(req.params.id);
  if (!application || (req.user.role === 'customer' && application.customerId !== req.userId)) {
    return res.status(404).json({ success: false, message: 'Application not found' });
  }
  return res.json({ success: true, data: application });
};
const create = async (req, res) => {
  const payload = req.user.role === 'customer' ? { ...req.body, customerId: req.userId } : req.body;
  return base.create({ ...req, body: payload }, res);
};
const updateStatus = async (req, res) => {
  const application = await Application.findByPk(req.params.id);
  if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
  const history = [...(application.statusHistory || []), { status: req.body.status, notes: req.body.notes || '', timestamp: new Date().toISOString(), changedBy: req.userId }];
  await application.update({ status: req.body.status, statusHistory: history, notes: req.body.notes || application.notes });
  res.json({ success: true, message: 'Application status updated', data: application });
};
module.exports = { ...base, list, get, create, updateStatus };
