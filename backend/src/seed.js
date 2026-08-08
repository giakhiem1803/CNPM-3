import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { Category, Role, Subject, User, sequelize } from './models/index.js';

const accounts = [
  ['Sinh viên Demo', 'student@demo.local', 'STUDENT'],
  ['Giảng viên Demo', 'lecturer@demo.local', 'LECTURER'],
  ['Quản trị viên Demo', 'admin@demo.local', 'ADMIN']
];

try {
  await sequelize.sync();
  for (const name of ['STUDENT', 'LECTURER', 'ADMIN']) await Role.findOrCreate({ where: { name } });
  const passwordHash = await bcrypt.hash('Demo@123', 10);
  for (const [fullName, email, roleName] of accounts) {
    const role = await Role.findOne({ where: { name: roleName } });
    await User.findOrCreate({ where: { email }, defaults: { fullName, passwordHash, roleId: role.id } });
  }
  const subjects = [
    'An toàn thông tin',
    'Bảo mật ứng dụng Web',
    'Blockchain',
    'Cấu trúc dữ liệu và giải thuật',
    'Cơ sở dữ liệu',
    'Cơ sở lập trình',
    'Công nghệ phần mềm',
    'Đảm bảo chất lượng phần mềm',
    'Deep Learning',
    'DevOps',
    'Điện toán đám mây',
    'Đồ án Công nghệ phần mềm',
    'Hệ điều hành',
    'Hệ gợi ý',
    'Hệ thống phân tán',
    'Internet vạn vật',
    'Khai phá dữ liệu',
    'Khoa học dữ liệu',
    'Kiểm thử phần mềm',
    'Kiến trúc máy tính',
    'Kiến trúc Microservices',
    'Kỹ năng làm việc nhóm',
    'Kỹ năng nghiên cứu khoa học',
    'Kỹ thuật lập trình',
    'Linux và phần mềm nguồn mở',
    'Lập trình hướng đối tượng',
    'Lập trình Python',
    'Lập trình thiết bị di động',
    'Lập trình Web',
    'Lập trình Web nâng cao',
    'Luật',
    'Mạng máy tính',
    'Mật mã học',
    'Nhập môn Công nghệ thông tin',
    'Nhập môn Công nghệ phần mềm',
    'Nhập môn Machine Learning',
    'Phân tích và thiết kế hệ thống',
    'Phát triển ứng dụng .NET',
    'Phát triển ứng dụng Android',
    'Phát triển ứng dụng đa nền tảng',
    'Phát triển ứng dụng Java',
    'Phát triển ứng dụng với Node.js',
    'Phát triển giao diện với React',
    'Phát triển phần mềm mã nguồn mở',
    'Quản lý dự án phần mềm',
    'Quản trị hệ thống',
    'Quản trị mạng',
    'Thiết kế giao diện người dùng',
    'Thiết kế phần mềm',
    'Thị giác máy tính',
    'Tiếng Anh chuyên ngành Công nghệ thông tin',
    'Toán rời rạc',
    'Trí tuệ nhân tạo',
    'Trực quan hóa dữ liệu',
    'Tương tác người–máy',
    'Xác suất thống kê',
    'Xử lý ảnh số',
    'Xử lý ngôn ngữ tự nhiên'
  ];
  for (const name of subjects) await Subject.findOrCreate({ where: { name } });
  for (const name of ['Giáo trình', 'Bài giảng', 'Bài tập', 'Tài liệu tham khảo']) await Category.findOrCreate({ where: { name } });
  console.log(`Seed completed with ${await Subject.count()} subjects. Demo password: Demo@123`);
} catch (error) { console.error(error); process.exitCode = 1; }
finally { await sequelize.close(); }
