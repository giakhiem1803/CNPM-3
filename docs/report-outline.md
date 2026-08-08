# BÁO CÁO ĐỒ ÁN CUỐI KỲ

## Xây dựng nền tảng Quản lý và Chia sẻ Học liệu số sử dụng Node.js và React

> Đây là bản khung bám sát phần mềm. Chỉ chèn ảnh và đánh dấu kết quả kiểm thử sau khi chạy thực tế.

## LỜI MỞ ĐẦU

Học liệu số ngày càng đóng vai trò quan trọng trong quá trình dạy và học. Tuy nhiên, tài liệu thường được chia sẻ phân tán qua email, mạng xã hội và nhiều dịch vụ lưu trữ, gây khó khăn cho việc tìm kiếm, phân loại và kiểm soát quyền truy cập. Đề tài xây dựng một nền tảng tập trung nhằm hỗ trợ sinh viên, giảng viên và quản trị viên quản lý, kiểm duyệt, tìm kiếm và chia sẻ học liệu hiệu quả.

Mục tiêu của đề tài là xây dựng một MVP chạy trên nền web, sử dụng React ở frontend, Node.js/Express ở backend và MySQL để lưu dữ liệu. Phạm vi tập trung vào xác thực, phân quyền, upload, kiểm duyệt, tìm kiếm và tải học liệu. Các chức năng AI, OCR, streaming và lưu trữ đám mây được định hướng phát triển sau.

## CHƯƠNG 1: TỔNG QUAN VÀ CƠ SỞ LÝ THUYẾT

### 1.1. Bài toán thực tế

Tài liệu phân tán làm tăng thời gian tìm kiếm, dễ xuất hiện liên kết hỏng và khó đánh giá tính phù hợp. Hệ thống đề xuất tạo kho học liệu tập trung, gắn tài liệu với môn học và danh mục, đồng thời áp dụng quy trình duyệt trước khi công khai.

### 1.2. Công nghệ

- Node.js cung cấp môi trường JavaScript phía máy chủ với mô hình I/O bất đồng bộ.
- Express.js hỗ trợ xây dựng RESTful API và middleware.
- React tổ chức giao diện thành component, sử dụng props, state và Virtual DOM.
- MySQL lưu dữ liệu có cấu trúc; Sequelize ánh xạ mô hình JavaScript sang bảng quan hệ.
- JWT xác thực các API riêng tư; bcrypt bảo vệ mật khẩu.
- Multer tiếp nhận file multipart; Git theo dõi phiên bản mã nguồn.

### 1.3. Lý do lựa chọn

Các công nghệ thống nhất trên JavaScript, phù hợp nội dung môn học, có cộng đồng lớn và đủ khả năng hoàn thành MVP trong thời gian ngắn.

## CHƯƠNG 2: PHÂN TÍCH VÀ THIẾT KẾ

### 2.1. Tác nhân và yêu cầu

- Sinh viên tìm kiếm, xem, tải và lưu yêu thích.
- Giảng viên upload, quản lý và theo dõi trạng thái tài liệu.
- Quản trị viên quản lý danh mục, người dùng và kiểm duyệt.

### 2.2. Yêu cầu phi chức năng

- Mật khẩu không lưu dạng rõ; API riêng tư bắt buộc JWT.
- File tối đa 20 MB và chỉ nhận định dạng cho phép.
- Giao diện responsive, phản hồi rõ trạng thái tải và lỗi.
- Tìm kiếm có phân trang; cấu trúc mã nguồn phân lớp, dễ bảo trì.

### 2.3. Thiết kế

Sử dụng các biểu đồ tại `docs/diagrams/system-design.md`. Cơ sở dữ liệu gồm vai trò, người dùng, môn học, danh mục, học liệu, file, yêu thích, lịch sử tải và lịch sử duyệt.

## CHƯƠNG 3: XÂY DỰNG ỨNG DỤNG

Backend cung cấp RESTful API, middleware JWT và RBAC. Frontend dùng React Router, AuthContext và Axios. File được đổi tên an toàn trước khi lưu vào `backend/uploads`; metadata được lưu trong MySQL. Tài liệu mới có trạng thái PENDING và chỉ xuất hiện công khai sau khi ADMIN duyệt.

[CẦN BỔ SUNG ẢNH: trang đăng nhập]

[CẦN BỔ SUNG ẢNH: trang danh sách và tìm kiếm]

[CẦN BỔ SUNG ẢNH: form upload]

[CẦN BỔ SUNG ẢNH: trang quản trị duyệt tài liệu]

## CHƯƠNG 4: KIỂM THỬ VÀ ĐÁNH GIÁ

Kiểm thử bao gồm chức năng, API, xác thực, phân quyền và upload. Danh sách kịch bản nằm tại `docs/test-cases.md`.

[CẦN XÁC NHẬN: cập nhật kết quả thực tế và ảnh Postman sau khi chạy]

## CHƯƠNG 5: TỔNG KẾT VÀ HƯỚNG PHÁT TRIỂN

Sản phẩm hướng đến hoàn thành luồng cốt lõi từ đăng tải, kiểm duyệt đến tìm kiếm và tải học liệu. Hạn chế của MVP là lưu file cục bộ, chưa có xem trước, OCR, AI đề xuất và thông báo thời gian thực. Hướng phát triển gồm lưu trữ đám mây, tìm kiếm toàn văn, AI gợi ý, watermark, streaming và ứng dụng di động.

## TÀI LIỆU THAM KHẢO

[CẦN BỔ SUNG: tài liệu chính thức Node.js, Express, React, MySQL, Sequelize và JWT theo chuẩn trích dẫn của trường]
