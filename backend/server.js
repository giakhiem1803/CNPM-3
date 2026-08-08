import 'dotenv/config';
import app from './src/app.js';
import { sequelize } from './src/models/index.js';

const port = Number(process.env.PORT || 5000);

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(port, () => console.log(`API running at http://localhost:${port}`));
  } catch (error) {
    console.error('Cannot start server:', error.message);
    process.exit(1);
  }
}

start();

