const { Op } = require('sequelize');


const makeResourceController = (Model, searchableFields = []) => ({
  list: async (req, res) => {
    const { search, status, page = 1, limit = 50, ...filters } = req.query;
    const where = { ...filters };
    if (status) where.status = status;
    if (search && searchableFields.length) where[Op.or] = searchableFields.map(field => ({ [field]: { [Op.iLike]: `%${search}%` } }));
    const result = await Model.findAndCountAll({
      where, limit: Math.min(Number(limit), 100), offset: (Number(page) - 1) * Number(limit), order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, data: result.rows, pagination: { page: Number(page), limit: Number(limit), total: result.count, pages: Math.ceil(result.count / Number(limit)) } });
  },
  get: async (req, res) => {
    const item = await Model.findByPk(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: `${Model.name} not found` });
    res.json({ success: true, data: item });
  },
  create: async (req, res) => {
    const item = await Model.create({ id: req.body.id || `${Model.name.toUpperCase()}_${Date.now()}`, ...req.body });
    res.status(201).json({ success: true, message: `${Model.name} created`, data: item });
  },
  update: async (req, res) => {
    const item = await Model.findByPk(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: `${Model.name} not found` });
    await item.update(req.body);
    res.json({ success: true, message: `${Model.name} updated`, data: item });
  },
  remove: async (req, res) => {
    const deleted = await Model.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ success: false, message: `${Model.name} not found` });
    res.status(204).send();
  }
});

module.exports = makeResourceController;
