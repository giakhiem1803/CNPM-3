# Danh sách RESTful API

Base URL: `http://localhost:5000/api`. API riêng tư dùng header `Authorization: Bearer <token>`.

Backend yêu cầu biến môi trường `JWT_SECRET` có giá trị riêng và sẽ không khởi động nếu vẫn dùng giá trị mẫu. Các API trả thông tin file chỉ công khai tên gốc, MIME type, phần mở rộng và dung lượng; đường dẫn lưu nội bộ và tên file vật lý không được đưa vào response.

| Method | Endpoint | Quyền | Mục đích |
|---|---|---|---|
| POST | `/auth/register` | Công khai | Đăng ký sinh viên |
| POST | `/auth/login` | Công khai | Nhận JWT |
| GET | `/auth/me` | Đăng nhập | Hồ sơ hiện tại |
| PUT | `/auth/profile` | Đăng nhập | Cập nhật hồ sơ |
| GET | `/resources` | Công khai | Danh sách, tìm kiếm, lọc, phân trang |
| GET | `/resources/:id` | Công khai | Chi tiết học liệu đã duyệt |
| GET | `/resources/my-resources` | LECTURER, ADMIN | Tài liệu đã đăng |
| POST | `/resources` | LECTURER, ADMIN | Upload multipart/form-data |
| PUT | `/resources/:id` | Chủ sở hữu, ADMIN | Sửa metadata |
| DELETE | `/resources/:id` | Chủ sở hữu, ADMIN | Xóa tài liệu và file |
| GET | `/resources/:id/download` | Đăng nhập | Tải có kiểm tra quyền |
| GET | `/resources/:id/preview` | Đăng nhập | Xem trước PDF có kiểm tra quyền |
| GET/POST/PUT/DELETE | `/subjects` | Đọc công khai; sửa ADMIN | Quản lý môn học |
| GET/POST/PUT/DELETE | `/categories` | Đọc công khai; sửa ADMIN | Quản lý danh mục |
| GET | `/favorites` | Đăng nhập | Danh sách yêu thích |
| POST/DELETE | `/favorites/:resourceId` | Đăng nhập | Thêm/bỏ yêu thích |
| GET | `/history/downloads` | Đăng nhập | Lịch sử tải |
| GET | `/admin/users` | ADMIN | Danh sách tài khoản |
| PUT | `/admin/users/:id/status` | ADMIN | Khóa/mở khóa |
| PUT | `/admin/users/:id/role` | ADMIN | Đổi vai trò |
| GET | `/admin/approvals` | ADMIN | Danh sách chờ duyệt |
| PUT | `/admin/approvals/:id/approve` | ADMIN | Duyệt |
| PUT | `/admin/approvals/:id/reject` | ADMIN | Từ chối kèm lý do |
| GET | `/admin/statistics` | ADMIN | Thống kê tổng quan |
| GET | `/admin/activities` | ADMIN | 20 hoạt động gần nhất |

`GET /resources` hỗ trợ các query: `search`, `subjectId`, `categoryId`, `fileType`, `sort`, `page`, `limit`. Giá trị `sort` gồm `newest`, `oldest`, `popular`.

Chỉ học liệu ở trạng thái `PENDING` mới được duyệt hoặc từ chối. Yêu cầu xử lý lại học liệu đã được duyệt/từ chối trả HTTP `409`. Upload kiểm tra trường bắt buộc, môn học, danh mục, quyền truy cập, phần mở rộng và dung lượng file. Các thao tác ghi học liệu và file được thực hiện trong transaction.
