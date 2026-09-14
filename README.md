# CNPM 3 — KhIm Hub

## Hệ thống Quản lý và Chia sẻ Học liệu số

Đồ án cá nhân môn Chuyên đề Công nghệ phần mềm 3, sử dụng Node.js, Express, React, RESTful API, MySQL ở local, PostgreSQL trên production và dịch vụ Python hỗ trợ OpenAI.

| Thông tin | Nội dung |
|---|---|
| Sinh viên thực hiện | Đinh Gia Khiêm |
| Mã số sinh viên | 2200011704 |
| Repository | https://github.com/giakhiem1803/CNPM-3 |
| Website production | https://khim-hub-web.onrender.com |
| Backend health | https://khim-hub-api.onrender.com/api/health |

## Chức năng

- Ba vai trò STUDENT, LECTURER và ADMIN.
- Đăng ký, đăng nhập JWT, cập nhật hồ sơ.
- Tìm kiếm và lọc học liệu đã duyệt.
- Upload file vào database, theo dõi trạng thái, duyệt hoặc từ chối.
- Tải file có kiểm tra quyền và ghi lịch sử.
- Yêu thích, quản lý danh mục, người dùng và thống kê.
- Đăng ký, hồ sơ cá nhân và lịch sử tải xuống.
- Phân trang, lọc định dạng và sắp xếp học liệu.
- Chỉnh sửa/xóa tài liệu, preview PDF có kiểm tra quyền.
- Nhật ký hoạt động và dashboard quản trị mở rộng.
- Lecturer/Admin có thể dùng OpenAI để gợi ý mô tả và từ khóa; API key chỉ nằm ở AI service.
- Frontend có manifest, service worker và trang offline để cài đặt theo mô hình PWA.

## Yêu cầu

- Node.js LTS (khuyến nghị 20+).
- MySQL 8+.
- npm.
- Python 3.12+ nếu chạy AI service.

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

7. Tùy chọn - chạy AI service:

```bash
cd ai-service
python -m venv .venv
.venv\Scripts\python -m pip install -r requirements.txt
copy .env.example .env
.venv\Scripts\python -m uvicorn app.main:app --reload --port 8000
```

AI là phần mở rộng tùy chọn. Bản nộp mặc định đặt `AI_ENABLED=false`, vì vậy không gọi OpenAI và không phát sinh phí. Khi cần trình diễn thật, điền `OPENAI_API_KEY` và đổi `AI_ENABLED=true`; KhIm Hub vẫn hoạt động bình thường khi AI tắt.

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

Kết quả gần nhất: 33/33 test backend đạt. Luồng production từ upload của giảng viên đến admin phê duyệt và hiển thị trên trang chủ đã được kiểm tra ngày 15/09/2026.

Kiểm thử AI service:

```bash
ai-service\.venv\Scripts\python -m pytest ai-service\tests
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
- `docs/deployment.md`: cấu hình Docker và hướng dẫn triển khai production.
- `docs/mendix-task-app.md`: đặc tả bài thực hành Mendix độc lập.

## Giới hạn

Phiên bản mở rộng đã có mã nguồn cho luồng AI gợi ý metadata và PWA. Bản nộp hiện để AI ở trạng thái tùy chọn, mặc định tắt do tài khoản API chưa có hạn mức; không mô tả đây là kết quả AI đã vận hành thực tế. Hệ thống vẫn chưa có OCR, streaming, watermark hoặc thông báo thời gian thực. File mới được lưu trong database để tồn tại qua các lần khởi động lại của Render. PostgreSQL miễn phí cần được sao lưu hoặc chuyển đổi trước ngày 14/10/2026 nếu muốn duy trì lâu dài.
