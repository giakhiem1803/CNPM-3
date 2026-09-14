import bcrypt from 'bcryptjs';
import { DataTypes } from 'sequelize';
import { Category, Role, Subject, User } from '../models/index.js';

const roleNames = ['STUDENT', 'LECTURER', 'ADMIN'];
const categoryNames = ['Giáo trình', 'Bài giảng', 'Bài tập', 'Tài liệu tham khảo'];
const subjectNames = [
  'Cơ sở lập trình',
  'Cơ sở dữ liệu',
  'Công nghệ phần mềm',
  'Lập trình Web',
  'Phát triển giao diện với React',
  'Phát triển ứng dụng với Node.js',
  'Kiểm thử phần mềm',
  'Quản lý dự án phần mềm',
  'Trí tuệ nhân tạo',
  'Điện toán đám mây'
];

export async function ensureBaseData() {
  for (const name of roleNames) await Role.findOrCreate({ where: { name } });
  for (const name of categoryNames) await Category.findOrCreate({ where: { name } });
  for (const name of subjectNames) await Subject.findOrCreate({ where: { name } });

  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email && !password) return;
  if (!email || !password || password.length < 12) {
    throw new Error('ADMIN_EMAIL và ADMIN_PASSWORD (tối thiểu 12 ký tự) phải được cấu hình cùng nhau.');
  }

  const adminRole = await Role.findOne({ where: { name: 'ADMIN' } });
  await User.findOrCreate({
    where: { email },
    defaults: {
      fullName: process.env.ADMIN_NAME?.trim() || 'Quản trị viên',
      passwordHash: await bcrypt.hash(password, 10),
      roleId: adminRole.id
    }
  });
}

export async function ensureFileStorageSchema() {
  const queryInterface = User.sequelize.getQueryInterface();
  const columns = await queryInterface.describeTable('resource_files');
  if (!columns.data) {
    await queryInterface.addColumn('resource_files', 'data', {
      type: DataTypes.BLOB('long'),
      allowNull: true
    });
  }
  if (columns.path?.allowNull === false) {
    await queryInterface.changeColumn('resource_files', 'path', {
      type: DataTypes.STRING(500),
      allowNull: true
    });
  }
}
