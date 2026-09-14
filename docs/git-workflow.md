# Quy trình Git và bằng chứng tích hợp mã nguồn

## Repository

- GitHub: https://github.com/giakhiem1803/CNPM-3
- Nhánh chính: `main`
- Đồ án cá nhân: không có thành viên nhóm khác cần mời vào repository.

## Quy trình áp dụng

1. Tạo feature branch từ `main` cho một nhóm thay đổi độc lập.
2. Chỉ commit các file thuộc phạm vi thay đổi; không commit `.env`, mật khẩu, file upload hoặc dependency.
3. Chạy backend test và frontend production build trước khi đẩy branch.
4. Tạo Pull Request vào `main`, mô tả mục tiêu, thay đổi, rủi ro và bằng chứng kiểm thử.
5. Tự review diff theo checklist vì đây là đồ án cá nhân; sửa lỗi nếu có.
6. Chỉ merge khi kiểm thử đạt và không có xung đột.

## Feature branch minh chứng

- Branch: `feature/production-hardening`
- Nội dung: lưu file học liệu trong database, bảo vệ dữ liệu file nội bộ, cập nhật tài liệu production và bổ sung kiểm thử.
- Pull Request: https://github.com/giakhiem1803/CNPM-3/pull/1

## Checklist code review

- [x] Không chứa secret hoặc file `.env`.
- [x] Không trả dữ liệu nhị phân và đường dẫn file trong API danh sách.
- [x] Upload, preview và download tương thích với dữ liệu lưu trong database.
- [x] Vẫn hỗ trợ đọc file cũ theo đường dẫn.
- [x] Backend test và frontend build phải đạt trước khi merge.
- [x] Tài liệu kiến trúc, deployment và backlog khớp trạng thái thực tế.

## Xử lý xung đột

Nếu feature branch lệch khỏi `main`, cập nhật branch bằng merge hoặc rebase, giải quyết từng file, chạy lại test/build và ghi kết quả trong Pull Request. PR minh chứng hiện tại không được cố ý tạo xung đột giả; trạng thái không có conflict cũng là kết quả hợp lệ của quy trình tích hợp.
