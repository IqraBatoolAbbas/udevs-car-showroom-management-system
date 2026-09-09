const { Application, Customer } = require('../models');
const makeResourceController = require('./resourceController');

const base = makeResourceController(Application, ['fullName', 'email', 'selectedCar']);
const list = async (req, res) => {
  if (req.user.role === 'customer') {
    const customer = await Customer.findOne({ where: { userId: req.userId } });
    req.query.customerId = customer?.id || '__no_customer__';
  }
  return base.list(req, res);
};
const get = async (req, res) => {
  const application = await Application.findByPk(req.params.id);
  const customer = req.user.role === 'customer'
    ? await Customer.findOne({ where: { userId: req.userId } })
    : null;
  if (!application || (customer && application.customerId !== customer.id)) {
    return res.status(404).json({ success: false, message: 'Application not found' });
  }
  return res.json({ success: true, data: application });
};
const create = async (req, res) => {
  let payload = req.body;
  if (req.user.role === 'customer') {
    const customer = await Customer.findOne({ where: { userId: req.userId } });
    if (!customer) return res.status(400).json({ success: false, message: 'Customer profile not found' });
    payload = { ...req.body, customerId: customer.id };
  }
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
