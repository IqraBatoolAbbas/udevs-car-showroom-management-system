const { Application } = require('../models');
const makeResourceController = require('./resourceController');

const base = makeResourceController(Application, ['fullName', 'email', 'selectedCar']);
const updateStatus = async (req, res) => {
  const application = await Application.findByPk(req.params.id);
  if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
  const history = [...(application.statusHistory || []), { status: req.body.status, notes: req.body.notes || '', timestamp: new Date().toISOString(), changedBy: req.userId }];
  await application.update({ status: req.body.status, statusHistory: history, notes: req.body.notes || application.notes });
  res.json({ success: true, message: 'Application status updated', data: application });
};
module.exports = { ...base, updateStatus };
