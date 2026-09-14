# Triển khai KhIm Hub

## Trạng thái

Phiên bản production đã được triển khai và kiểm tra thực tế ngày 15/09/2026.

- Frontend: https://khim-hub-web.onrender.com
- Backend: https://khim-hub-api.onrender.com
- Health check: https://khim-hub-api.onrender.com/api/health
- Repository: https://github.com/giakhiem1803/CNPM-3

## Kiến trúc khuyến nghị

- Frontend React/Vite: Render Static Site, Root Directory là `frontend`.
- Backend Node.js: Render Web Service, Root Directory là `backend`.
- AI service FastAPI: Render hoặc Railway, đặt Root Directory là `ai-service`.
- Database: MySQL được quản lý, tương thích kết nối từ Sequelize/mysql2.
- Database trên Render: PostgreSQL qua `DATABASE_URL`; local vẫn dùng MySQL qua các biến `DB_*`.
- File học liệu: lưu nhị phân trong database; route vẫn đọc được file cũ theo đường dẫn để tương thích ngược.

## Biến môi trường

### Frontend

```env
VITE_API_URL=https://BACKEND_DOMAIN/api
```

### Backend

```env
PORT=5000
DATABASE_URL=
DB_HOST=
DB_PORT=3306
DB_NAME=digital_learning_resources
DB_USER=
DB_PASSWORD=
JWT_SECRET=
FRONTEND_URL=https://FRONTEND_DOMAIN
AI_SERVICE_URL=https://AI_SERVICE_DOMAIN
MAX_FILE_SIZE_MB=20
```

### AI service

```env
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
AI_ENABLED=false
```

`AI_ENABLED=false` là cấu hình mặc định của bản nộp hiện tại: source vẫn giữ tích hợp OpenAI nhưng không gửi yêu cầu và không phát sinh phí. Chỉ chuyển thành `true` khi tài khoản API có hạn mức sử dụng.

Không commit giá trị thật của các biến trên. Thay mật khẩu demo trước khi công khai.

## Kiểm tra sau triển khai

1. `GET https://khim-hub-api.onrender.com/api/health` trả HTTP 200.
2. `GET https://AI_SERVICE_DOMAIN/health` trả HTTP 200 và cho biết trạng thái cấu hình.
3. Frontend mở được và tải manifest PWA.
4. Lecturer đăng nhập và upload một file nhỏ. Chỉ thử AI khi `AI_ENABLED=true` và tài khoản API có hạn mức.
5. Admin duyệt tài liệu.
6. Student tìm, xem và tải tài liệu.
7. Khởi động lại backend rồi xác nhận metadata và dữ liệu file trong PostgreSQL vẫn còn.

## Kết quả xác minh production

- Backend test: 33/33 test đạt sau khi bổ sung lưu file trong database.
- CORS chỉ cho phép `https://khim-hub-web.onrender.com`.
- 3 vai trò, 10 môn học và 4 danh mục được khởi tạo tự động.
- Luồng Lecturer upload -> PENDING -> Admin approve -> APPROVED -> hiển thị trang chủ đã được kiểm tra xuyên suốt.
- Học liệu kiểm thử đã được xóa và hai tài khoản smoke test đã bị khóa sau khi xác minh.

## Sao lưu và giới hạn gói miễn phí

PostgreSQL miễn phí hiện tại của Render có thời hạn đến ngày 14/10/2026. Việc gia hạn hoặc chuyển sang nhà cung cấp khác cần quyết định tài khoản/thanh toán của chủ dự án. Trước thời hạn này, dùng thông tin External Database URL trong Render để sao lưu:

```bash
pg_dump --format=custom --no-owner --no-acl "$DATABASE_URL" --file khim-hub-production.dump
```

Kiểm tra file backup khác rỗng và lưu ở vị trí riêng tư, không commit vào GitHub. Khôi phục sang PostgreSQL mới bằng:

```bash
pg_restore --clean --if-exists --no-owner --no-acl --dbname "$NEW_DATABASE_URL" khim-hub-production.dump
```

Các chuỗi kết nối database, JWT secret và mật khẩu quản trị không được ghi trong tài liệu hoặc repository.

## Chạy thử bằng Docker

Tạo file `.env` ở thư mục gốc với mật khẩu riêng, sau đó chạy:

```bash
docker compose up --build
```

Docker Compose sử dụng volume cho MySQL và uploads để dữ liệu không mất khi container được tạo lại.
