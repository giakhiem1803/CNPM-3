# Triển khai KhIm Hub

## Trạng thái

Source đã có cấu hình production và Docker. URL công khai chỉ được ghi nhận sau khi triển khai và kiểm tra thực tế.

## Kiến trúc khuyến nghị

- Frontend React/Vite: Vercel, đặt Root Directory là `frontend`.
- Backend Node.js: Render hoặc Railway, đặt Root Directory là `backend`.
- AI service FastAPI: Render hoặc Railway, đặt Root Directory là `ai-service`.
- Database: MySQL được quản lý, tương thích kết nối từ Sequelize/mysql2.
- File học liệu: gắn persistent volume hoặc chuyển sang object storage trước khi dùng production.

## Biến môi trường

### Frontend

```env
VITE_API_URL=https://BACKEND_DOMAIN/api
```

### Backend

```env
PORT=5000
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

1. `GET https://BACKEND_DOMAIN/api/health` trả HTTP 200.
2. `GET https://AI_SERVICE_DOMAIN/health` trả HTTP 200 và cho biết trạng thái cấu hình.
3. Frontend mở được và tải manifest PWA.
4. Lecturer đăng nhập và upload một file nhỏ. Chỉ thử AI khi `AI_ENABLED=true` và tài khoản API có hạn mức.
5. Admin duyệt tài liệu.
6. Student tìm, xem và tải tài liệu.
7. Khởi động lại backend rồi xác nhận file đã upload vẫn còn.

## Chạy thử bằng Docker

Tạo file `.env` ở thư mục gốc với mật khẩu riêng, sau đó chạy:

```bash
docker compose up --build
```

Docker Compose sử dụng volume cho MySQL và uploads để dữ liệu không mất khi container được tạo lại.
