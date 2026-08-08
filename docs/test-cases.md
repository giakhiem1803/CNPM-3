# Kế hoạch và test case

Môi trường đề xuất: Chrome mới nhất, Node.js LTS, MySQL 8, Postman. Chỉ đánh dấu Pass sau khi chạy thực tế.

| Mã | Chức năng | Dữ liệu/Thao tác | Kết quả mong đợi | Thực tế |
|---|---|---|---|---|
| TC01 | Đăng ký | Dữ liệu hợp lệ | Tạo tài khoản STUDENT | Chưa thực hiện |
| TC02 | Đăng ký | Email đã tồn tại | HTTP 409 | Chưa thực hiện |
| TC03 | Đăng ký | Mật khẩu dưới 6 ký tự | HTTP 400 | Chưa thực hiện |
| TC04 | Đăng nhập | Đúng email/mật khẩu | Trả JWT và hồ sơ | Chưa thực hiện |
| TC05 | Đăng nhập | Sai mật khẩu | HTTP 401 | Chưa thực hiện |
| TC06 | Đăng nhập | Tài khoản LOCKED | HTTP 403 | Chưa thực hiện |
| TC07 | Xác thực | Không gửi token | HTTP 401 | Chưa thực hiện |
| TC08 | Phân quyền | STUDENT gọi API admin | HTTP 403 | Chưa thực hiện |
| TC09 | Upload | PDF dưới 20 MB | Tạo tài liệu PENDING | Chưa thực hiện |
| TC10 | Upload | File .exe | HTTP 400 | Chưa thực hiện |
| TC11 | Upload | File trên 20 MB | Từ chối upload | Chưa thực hiện |
| TC12 | Tìm kiếm | Từ khóa có kết quả | Trả đúng học liệu APPROVED | Chưa thực hiện |
| TC13 | Lọc | Chọn môn học | Chỉ trả tài liệu thuộc môn | Chưa thực hiện |
| TC14 | Cập nhật | Giảng viên sửa tài liệu của mình | Cập nhật và chuyển PENDING | Chưa thực hiện |
| TC15 | Cập nhật | Sửa tài liệu người khác | HTTP 403 | Chưa thực hiện |
| TC16 | Duyệt | ADMIN duyệt tài liệu | Trạng thái APPROVED | Chưa thực hiện |
| TC17 | Từ chối | Không nhập lý do | HTTP 400 | Chưa thực hiện |
| TC18 | Tải file | Người dùng hợp lệ | Tải file và ghi lịch sử | Chưa thực hiện |
| TC19 | Yêu thích | Thêm hai lần | Không tạo bản ghi trùng | Chưa thực hiện |
| TC20 | Xóa yêu thích | Bản ghi tồn tại | Xóa thành công | Chưa thực hiện |
| TC21 | Hồ sơ | Cập nhật họ tên hợp lệ | Lưu và cập nhật giao diện | Chưa thực hiện |
| TC22 | Phân trang | Chuyển sang trang tiếp theo | Giữ nguyên bộ lọc | Chưa thực hiện |
| TC23 | Preview | Mở PDF đã duyệt | Hiển thị trong tab mới | Chưa thực hiện |
| TC24 | Quản trị | Admin tự khóa chính mình | HTTP 400 | Chưa thực hiện |
| TC25 | Danh mục | Xóa dữ liệu đang được sử dụng | HTTP 409 và thông báo rõ ràng | Chưa thực hiện |
