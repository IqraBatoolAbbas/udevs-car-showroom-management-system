const { ActivityLog, User } = require('../models');

const list = async (req, res) => {
  const {
    search,
    type,
    entity,
    page = 1,
    limit = 50
  } = req.query;

  const where = {};

  if (type) {
    where.type = type;
  }

  if (entity) {
    where.entity = entity;
  }

  if (search) {
    const { Op } = require('sequelize');

    where[Op.or] = [
      { description: { [Op.iLike]: `%${search}%` } },
      { type: { [Op.iLike]: `%${search}%` } },
      { entity: { [Op.iLike]: `%${search}%` } }
    ];
  }

  const pageNumber = Math.max(Number(page) || 1, 1);
  const limitNumber = Math.min(Math.max(Number(limit) || 50, 1), 100);

  const result = await ActivityLog.findAndCountAll({
    where,
    include: [
      {
        model: User,
        attributes: ['id', 'name', 'email'],
        required: false
      }
    ],
    limit: limitNumber,
    offset: (pageNumber - 1) * limitNumber,
    order: [['createdAt', 'DESC']]
  });

  const data = result.rows.map(log => {
    const item = log.toJSON();

    return {
      ...item,
      userName: item.User?.name || null,
      userEmail: item.User?.email || null
    };
  });

  res.json({
    success: true,
    data,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      total: result.count,
      pages: Math.ceil(result.count / limitNumber)
    }
  });
};

const get = async (req, res) => {
  const item = await ActivityLog.findByPk(req.params.id, {
    include: [
      {
        model: User,
        attributes: ['id', 'name', 'email'],
        required: false
      }
    ]
  });

  if (!item) {
    return res.status(404).json({
      success: false,
      message: 'Activity log not found'
    });
  }

  const data = item.toJSON();

  res.json({
    success: true,
    data: {
      ...data,
      userName: data.User?.name || null,
      userEmail: data.User?.email || null
    }
  });
};

module.exports = {
  list,
  get
};