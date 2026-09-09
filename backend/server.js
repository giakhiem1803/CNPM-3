import 'dotenv/config';
import app from './src/app.js';
import { sequelize } from './src/models/index.js';

const port = Number(process.env.PORT || 5000);

async function start() {
  try {
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'replace_with_a_long_random_secret') {
      throw new Error('JWT_SECRET chưa được cấu hình bằng một chuỗi bí mật an toàn.');
    }
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(port, () => console.log(`API running at http://localhost:${port}`));
  } catch (error) {
    console.error('Cannot start server:', error.message);
    process.exit(1);
  }
}

start();
