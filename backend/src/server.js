require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');

const port = process.env.PORT || 5000;
(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(port, () => console.log(`Car showroom API listening on port ${port}`));
  } catch (error) {
    console.error('Startup failed:', error);
    process.exit(1);
  }
})();
