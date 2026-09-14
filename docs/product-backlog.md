# Product Backlog

| ID | User Story | Ưu tiên | Tiêu chí chấp nhận |
|---|---|---|---|
| US01 | Là người dùng, tôi muốn đăng nhập để sử dụng chức năng theo vai trò. | Must | JWT hợp lệ; sai thông tin bị từ chối. |
| US02 | Là sinh viên, tôi muốn tìm kiếm và lọc để nhanh chóng tìm tài liệu. | Must | Tìm theo từ khóa, môn và danh mục. |
| US03 | Là sinh viên, tôi muốn tải tài liệu đã duyệt để học tập. | Must | Kiểm tra đăng nhập, quyền và ghi lịch sử. |
| US04 | Là giảng viên, tôi muốn upload học liệu để chia sẻ. | Must | Kiểm tra file; trạng thái ban đầu PENDING. |
| US05 | Là giảng viên, tôi muốn xem trạng thái duyệt để biết kết quả. | Must | Hiện PENDING/APPROVED/REJECTED và lý do. |
| US06 | Là quản trị viên, tôi muốn duyệt học liệu để kiểm soát nội dung. | Must | Duyệt hoặc từ chối; từ chối bắt buộc lý do. |
| US07 | Là quản trị viên, tôi muốn quản lý môn và danh mục. | Should | CRUD có kiểm tra quyền ADMIN. |
| US08 | Là sinh viên, tôi muốn lưu yêu thích để xem lại. | Should | Không tạo bản ghi trùng; có thể bỏ lưu. |
| US09 | Là người dùng, tôi muốn xem lịch sử tải. | Should | Hiện tài liệu và thời điểm tải. |
| US10 | Là quản trị viên, tôi muốn xem thống kê để nắm tình trạng hệ thống. | Should | Hiện người dùng, học liệu, chờ duyệt, lượt tải. |
| US11 | Là quản trị viên, tôi muốn khóa tài khoản vi phạm. | Could | Tài khoản LOCKED không đăng nhập được. |
| US12 | Là người dùng, tôi muốn giao diện responsive. | Could | Dùng được trên desktop và điện thoại. |
| US13 | Là giảng viên, tôi muốn AI gợi ý mô tả và từ khóa để nhập metadata nhanh hơn. | Should | Chỉ gửi văn bản được nhập; không lộ API key; báo rõ khi AI chưa cấu hình. |
| US14 | Là người dùng, tôi muốn cài KhIm Hub như PWA để mở thuận tiện trên thiết bị. | Could | Có manifest, icon và trang offline; không cache dữ liệu riêng tư. |
| US15 | Là nhóm phát triển, tôi muốn triển khai hệ thống lên máy chủ để truy cập qua Internet. | Must | Frontend, API và PostgreSQL có URL/cấu hình production được kiểm thử; AI service được ghi rõ là phần mở rộng tùy chọn. |

Sprint đầu tiên: US01, US02, US03, US04, US06.

Sprint mở rộng: US13, US14, US15. US15 đã hoàn thành với frontend và backend trên Render; AI service vẫn là phần mở rộng tùy chọn, mặc định tắt.
