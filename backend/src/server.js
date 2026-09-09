require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');
const seedDatabase = require('./seed');

const port = process.env.PORT || 5000;
(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    if (process.env.NODE_ENV !== 'production') await seedDatabase();
    app.listen(port, () => console.log(`Car showroom API listening on port ${port}`));
  } catch (error) {
    console.error('Startup failed:', error);
    process.exit(1);
  }
})();
