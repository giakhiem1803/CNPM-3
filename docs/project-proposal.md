# PROJECT PROPOSAL - KHIM HUB

## 1. Thông tin đề tài

- **Tên đề tài:** Xây dựng nền tảng Quản lý và Chia sẻ Học liệu số sử dụng Node.js và React.
- **Tên sản phẩm:** KhIm Hub.
- **Sinh viên thực hiện:** Đinh Gia Khiêm.
- **Mã số sinh viên:** 2200011704.
- **Hình thức thực hiện:** Đồ án cá nhân.

## 2. Bối cảnh và lý do chọn đề tài

Học liệu của sinh viên và giảng viên thường được lưu tại nhiều kênh khác nhau, khó tìm kiếm, thiếu phân loại và không có quy trình kiểm duyệt thống nhất. KhIm Hub được đề xuất nhằm tập trung học liệu theo môn học và danh mục, hỗ trợ giảng viên chia sẻ tài liệu, quản trị viên kiểm duyệt và sinh viên tìm kiếm, lưu yêu thích hoặc tải tài liệu phục vụ học tập.

## 3. Mục tiêu

- Xây dựng RESTful API bằng Node.js và Express.
- Xây dựng giao diện một trang bằng React và Vite.
- Lưu trữ dữ liệu có cấu trúc trong MySQL thông qua Sequelize.
- Cung cấp quy trình đăng tải, kiểm duyệt và công khai học liệu.
- Áp dụng xác thực JWT và phân quyền theo ba vai trò.
- Ghi nhận lịch sử tải, lượt tải, yêu thích và hoạt động quản trị.
- Cung cấp source code, schema, Postman Collection và bộ test có thể kiểm tra lại.

## 4. Phạm vi

### 4.1. Trong phạm vi

- Đăng ký, đăng nhập, đăng xuất và cập nhật hồ sơ.
- Vai trò Sinh viên, Giảng viên và Quản trị viên.
- Upload PDF, Word, PowerPoint và hình ảnh, tối đa 20 MB.
- Quản lý trạng thái PENDING, APPROVED và REJECTED.
- Tìm kiếm, lọc, sắp xếp và phân trang học liệu.
- Xem trước PDF, tải file, lưu yêu thích và xem lịch sử tải.
- Quản lý người dùng, môn học, danh mục, thống kê và nhật ký hoạt động.

### 4.2. Ngoài phạm vi phiên bản hiện tại

- OCR và tìm kiếm toàn văn trong nội dung file.
- Gợi ý học liệu bằng AI.
- Streaming video và watermark.
- Lưu file trên AWS S3 hoặc Cloudinary.
- Thông báo thời gian thực và ứng dụng di động riêng.

## 5. Đối tượng sử dụng

| Vai trò | Nhu cầu chính |
|---|---|
| Sinh viên | Tìm kiếm, xem, yêu thích và tải học liệu đã được duyệt. |
| Giảng viên | Đăng tải, chỉnh sửa và theo dõi trạng thái học liệu của mình. |
| Quản trị viên | Kiểm duyệt, quản lý người dùng, môn học, danh mục và theo dõi hệ thống. |

## 6. Công nghệ

| Thành phần | Công nghệ |
|---|---|
| Frontend | React 19, Vite, React Router, Axios, Bootstrap |
| Backend | Node.js, Express, RESTful API |
| Database | MySQL, Sequelize ORM |
| Bảo mật | JWT, bcrypt, Helmet, CORS, rate limiting |
| Upload | Multer, lưu file cục bộ |
| Kiểm thử | Jest, Supertest, Postman |
| Quản lý phiên bản | Git và GitHub |

## 7. Kiến trúc đề xuất

Người dùng thao tác trên giao diện React. Frontend gửi HTTP request đến Express API bằng Axios. Backend xác thực JWT, xử lý nghiệp vụ, sử dụng Sequelize để truy cập MySQL và lưu file học liệu trong thư mục upload cục bộ. Những file được tải hoặc xem trước chỉ được phục vụ thông qua API có kiểm tra quyền.

## 8. Yêu cầu phi chức năng

- Mật khẩu phải được băm, không lưu dạng văn bản thuần.
- API riêng tư phải xác thực JWT và kiểm tra vai trò ở backend.
- Không trả mật khẩu băm, đường dẫn lưu file hoặc tên file vật lý cho client.
- Chỉ chấp nhận định dạng cho phép và giới hạn dung lượng upload.
- Giao diện có trạng thái tải, lỗi, rỗng và hỗ trợ kích thước màn hình phổ biến.
- Database sử dụng khóa ngoại, chỉ mục và transaction cho nghiệp vụ quan trọng.

## 9. Kế hoạch thực hiện

| Giai đoạn | Công việc | Kết quả |
|---|---|---|
| 1 | Phân tích yêu cầu, User Story và Product Backlog | Phạm vi và tiêu chí chấp nhận |
| 2 | Thiết kế kiến trúc, ERD và REST API | Sơ đồ và danh sách endpoint |
| 3 | Xây dựng xác thực, phân quyền và danh mục | Backend nền tảng |
| 4 | Xây dựng upload, tìm kiếm và kiểm duyệt | Luồng nghiệp vụ cốt lõi |
| 5 | Xây dựng giao diện theo ba vai trò | Ứng dụng React hoàn chỉnh |
| 6 | Kiểm thử, sửa lỗi và siết bảo mật | Test case và kết quả kiểm thử |
| 7 | Chuẩn hóa schema, Postman, README và GitHub | Bộ source có thể cài đặt lại |

## 10. Tiêu chí hoàn thành

- Cài đặt được hệ thống theo README.
- Schema sạch tạo đủ các bảng và seed được dữ liệu mẫu.
- Ba vai trò đăng nhập và chỉ sử dụng đúng chức năng được cấp quyền.
- Luồng Giảng viên upload - Admin duyệt - Sinh viên tìm và tải hoạt động xuyên suốt.
- Backend test và frontend production build thành công.
- Repository không chứa `.env`, JWT thật, mật khẩu database, `node_modules` hoặc file build.

## 11. Rủi ro và hướng xử lý

| Rủi ro | Hướng xử lý |
|---|---|
| File quá lớn hoặc sai định dạng | Giới hạn Multer và danh sách phần mở rộng cho phép |
| Truy cập API trái quyền | Xác thực JWT và kiểm tra vai trò tại backend |
| Bản ghi học liệu và file không đồng bộ | Sử dụng transaction và dọn file khi thao tác thất bại |
| Xóa dữ liệu đang được sử dụng | Khóa ngoại và phản hồi HTTP 409 |
| Lộ thông tin nội bộ | Chỉ chọn các trường file an toàn khi trả response |
