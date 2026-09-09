# CNPM 3 — KhIm Hub

## Hệ thống Quản lý và Chia sẻ Học liệu số

Đồ án cá nhân môn Chuyên đề Công nghệ phần mềm 3, sử dụng Node.js, Express, React, RESTful API và MySQL.

| Thông tin | Nội dung |
|---|---|
| Sinh viên thực hiện | Đinh Gia Khiêm |
| Mã số sinh viên | 2200011704 |
| Repository | https://github.com/giakhiem1803/CNPM-3 |

## Chức năng

- Ba vai trò STUDENT, LECTURER và ADMIN.
- Đăng ký, đăng nhập JWT, cập nhật hồ sơ.
- Tìm kiếm và lọc học liệu đã duyệt.
- Upload file, theo dõi trạng thái, duyệt hoặc từ chối.
- Tải file có kiểm tra quyền và ghi lịch sử.
- Yêu thích, quản lý danh mục, người dùng và thống kê.
- Đăng ký, hồ sơ cá nhân và lịch sử tải xuống.
- Phân trang, lọc định dạng và sắp xếp học liệu.
- Chỉnh sửa/xóa tài liệu, preview PDF có kiểm tra quyền.
- Nhật ký hoạt động và dashboard quản trị mở rộng.

## Yêu cầu

- Node.js LTS (khuyến nghị 20+).
- MySQL 8+.
- npm.

## Cài đặt

1. Tạo database và cấu trúc bảng bằng file `database/schema.sql` trong MySQL Workbench hoặc MySQL CLI.

Nếu chỉ cần tạo database trước khi chạy Sequelize:

```sql
CREATE DATABASE digital_learning_resources CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Sao chép `backend/.env.example` thành `backend/.env`, sau đó sửa thông tin MySQL và `JWT_SECRET`.

`JWT_SECRET` bắt buộc phải là chuỗi bí mật dài do bạn tự tạo. Backend sẽ từ chối khởi động nếu biến này bị thiếu hoặc vẫn dùng giá trị mẫu.

3. Sao chép `frontend/.env.example` thành `frontend/.env` nếu API không chạy ở cổng 5000.

4. Cài dependencies:

```bash
npm install
npm run install:all
```

5. Tạo bảng và tài khoản mẫu:

```bash
npm run seed --prefix backend
```

6. Chạy cả frontend và backend:

```bash
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:5000/api
- Health check: http://localhost:5000/api/health

## Tài khoản demo

| Vai trò | Email | Mật khẩu |
|---|---|---|
| Sinh viên | student@demo.local | Demo@123 |
| Giảng viên | lecturer@demo.local | Demo@123 |
| Quản trị viên | admin@demo.local | Demo@123 |

Chỉ dùng các tài khoản này để demo cục bộ; hãy thay mật khẩu nếu triển khai công khai.

## Luồng demo 5–7 phút

1. Đăng nhập Giảng viên và upload một file PDF.
2. Mở “Tài liệu của tôi” để chỉ ra trạng thái PENDING.
3. Đăng xuất, đăng nhập Quản trị viên và duyệt tài liệu.
4. Đăng nhập Sinh viên, tìm kiếm và mở chi tiết tài liệu.
5. Thêm yêu thích và tải file.
6. Đăng nhập Quản trị viên để xem thống kê lượt tải.
7. Mở quản lý môn học/danh mục, người dùng và nhật ký hoạt động.

## Kiểm tra

```bash
npm test
npm run build
```

## Tài liệu kèm theo

- `docs/report-outline.md`: khung nội dung báo cáo.
- `docs/product-backlog.md`: Product Backlog và Sprint đầu tiên.
- `docs/project-proposal.md`: đề cương, phạm vi và kế hoạch thực hiện đồ án.
- `docs/api-documentation.md`: danh sách API.
- `docs/test-cases.md`: 25 kịch bản kiểm thử.
- `docs/diagrams/system-design.md`: kiến trúc, ERD và sequence diagram.
- `docs/postman/KhIm_Hub_API_Export.postman_collection.json`: Postman Collection chuẩn để kiểm thử API.
- `docs/postman/KhIm_Hub_Local_Export.postman_environment.json`: Environment cục bộ, không chứa JWT đã đăng nhập.

## Giới hạn

Phiên bản MVP lưu file cục bộ và chưa có OCR, AI gợi ý, streaming, watermark hoặc thông báo thời gian thực. Đây là các hướng phát triển, không phải chức năng đã hoàn thành.
