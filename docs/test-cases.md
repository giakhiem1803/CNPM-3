# Kế hoạch và test case

Môi trường đề xuất: Chrome mới nhất, Node.js LTS, MySQL 8, Postman. Chỉ đánh dấu Pass sau khi chạy thực tế.

| Mã | Chức năng | Dữ liệu/Thao tác | Kết quả mong đợi | Thực tế |
|---|---|---|---|---|
| TC01 | Đăng ký | Dữ liệu hợp lệ | Tạo tài khoản STUDENT | Pass - Jest/Supertest (mock database) |
| TC02 | Đăng ký | Email đã tồn tại | HTTP 409 | Pass - Jest/Supertest (mock database) |
| TC03 | Đăng ký | Mật khẩu dưới 6 ký tự | HTTP 400 | Pass - Jest/Supertest |
| TC04 | Đăng nhập | Đúng email/mật khẩu | Trả JWT và hồ sơ | Pass - Jest/Supertest và MySQL thực tế |
| TC05 | Đăng nhập | Sai mật khẩu | HTTP 401 | Pass - Jest/Supertest (mock database) |
| TC06 | Đăng nhập | Tài khoản LOCKED | HTTP 403 | Pass - Jest/Supertest (mock database) |
| TC07 | Xác thực | Không gửi token | HTTP 401 | Pass - Jest/Supertest |
| TC08 | Phân quyền | STUDENT gọi API admin | HTTP 403 | Pass - Jest/Supertest |
| TC09 | Upload | PDF dưới 20 MB | Tạo tài liệu PENDING | Pass - Jest/Supertest (mock transaction) |
| TC10 | Upload | File .exe | HTTP 400 | Pass - Jest/Supertest |
| TC11 | Upload | File trên 20 MB | Từ chối upload | Pass - Jest/Supertest |
| TC12 | Tìm kiếm | Từ khóa có kết quả | Trả đúng học liệu APPROVED | Pass - Jest/Supertest và MySQL thực tế |
| TC13 | Lọc | Chọn môn học | Chỉ trả tài liệu thuộc môn | Pass - Jest/Supertest |
| TC14 | Cập nhật | Giảng viên sửa tài liệu của mình | Cập nhật và chuyển PENDING | Pass - Jest/Supertest (mock database) |
| TC15 | Cập nhật | Sửa tài liệu người khác | HTTP 403 | Pass - Jest/Supertest (mock database) |
| TC16 | Duyệt | ADMIN duyệt tài liệu | Trạng thái APPROVED | Pass - kiểm thử API với MySQL thực tế |
| TC17 | Từ chối | Không nhập lý do | HTTP 400 | Pass - Jest/Supertest |
| TC18 | Tải file | Người dùng hợp lệ | Tải file và ghi lịch sử | Pass - kiểm thử API với MySQL thực tế |
| TC19 | Yêu thích | Thêm hai lần | Không tạo bản ghi trùng | Pass - Jest/Supertest (mock database) |
| TC20 | Xóa yêu thích | Bản ghi tồn tại | Xóa thành công | Pass - Jest/Supertest (mock database) |
| TC21 | Hồ sơ | Cập nhật họ tên hợp lệ | Lưu và cập nhật giao diện | Pass - Jest/Supertest (mock database) |
| TC22 | Phân trang | Chuyển sang trang tiếp theo | Giữ nguyên bộ lọc | Pass phần API - Jest/Supertest |
| TC23 | Preview | Mở PDF đã duyệt | Hiển thị trong tab mới | Pass phần API - Jest/Supertest |
| TC24 | Quản trị | Admin tự khóa chính mình | HTTP 400 | Pass - Jest/Supertest |
| TC25 | Danh mục | Xóa dữ liệu đang được sử dụng | HTTP 409 và thông báo rõ ràng | Pass - Jest/Supertest (mock database) |
