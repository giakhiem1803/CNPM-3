# Ứng dụng Mendix độc lập - Quản lý công việc học tập

Ứng dụng này là bài thực hành Mendix độc lập, không phải một module của KhIm Hub.

## User Story

- Là sinh viên, tôi muốn tạo công việc học tập để theo dõi việc cần làm.
- Là sinh viên, tôi muốn xem danh sách công việc để biết tiến độ.
- Là sinh viên, tôi muốn cập nhật trạng thái để đánh dấu công việc đã hoàn thành.

## Domain Model

Entity `Task` gồm:

| Attribute | Type | Yêu cầu |
|---|---|---|
| Title | String (200) | Bắt buộc |
| Description | String (unlimited) | Không bắt buộc |
| DueDate | Date and time | Bắt buộc |
| Status | Enumeration `TaskStatus` | Giá trị mặc định `Pending` |
| createdDate | System member | Được lưu tự động |

Enumeration `TaskStatus` gồm:

| Name | Caption |
|---|---|
| Pending | Mới |
| InProgress | Đang thực hiện |
| Completed | Hoàn thành |

## Trang giao diện

1. `Task_Overview`: Data Grid 2 hiển thị Title, Description, DueDate, Status và cột Hành động.
2. `Task_NewEdit`: Form nhập Title, Description, DueDate và Status.
3. Nút New, Edit, Delete và `Đánh dấu hoàn thành`.
4. Status dùng màu xanh dương cho Mới, màu cam cho Đang thực hiện và màu xanh lá cho Hoàn thành.
5. Nút `Đánh dấu hoàn thành` chỉ hiển thị khi Status khác `Completed`.

## Microflow ACT_Task_MarkCompleted

1. Nhận tham số `Task`.
2. Change Object: đặt `Status = MyFirstModule.TaskStatus.Completed`.
3. Commit Object và Refresh in client.
4. Hiển thị thông báo `Đã đánh dấu công việc hoàn thành`.

## Các bước trong Mendix Studio Pro

1. Tạo Blank Web App tên `StudyTaskManager`.
2. Sử dụng module `MyFirstModule`.
3. Tạo enumeration `TaskStatus` với `Pending`, `InProgress`, `Completed`.
4. Tạo entity và attribute theo bảng Domain Model.
5. Chọn entity Task, dùng Generate overview pages.
6. Thêm nút `Đánh dấu hoàn thành` vào trang overview và liên kết microflow.
7. Đặt `MyFirstModule.Task_Overview` làm trang chủ Responsive web.
8. Chạy Local, tạo công việc và cập nhật một công việc sang `Completed`.

## Tiêu chí hoàn thành

- Tạo, xem, sửa và xóa được Task.
- Microflow đổi trạng thái sang `Completed` hoạt động.
- Không thể lưu Task nếu thiếu Title hoặc DueDate.
- Danh sách phân biệt trực quan ba trạng thái và ẩn nút hoàn thành đúng điều kiện.
- Có ảnh Domain Model, Overview Page, Microflow và kết quả chạy Local.

## Kết quả kiểm thử thực tế

- Mendix Studio Pro: 11.12.1.
- Project: `StudyTaskManager`.
- Chạy Local thành công tại `localhost:8080`.
- Tạo và sửa Task thành công.
- Nút `Đánh dấu hoàn thành` đã gọi microflow và đổi trạng thái từ `Mới` sang `Hoàn thành`.
- Validation hiển thị đúng hai thông báo `Vui lòng nhập tiêu đề công việc` và `Vui lòng chọn hạn hoàn thành` khi lưu form trống.
- Cột Status hiển thị đúng màu xanh dương, cam và xanh lá tương ứng với ba trạng thái.
- Nút `Đánh dấu hoàn thành` biến mất sau khi Task chuyển sang `Completed`.
- Thông báo `Đã đánh dấu công việc hoàn thành` xuất hiện sau khi microflow chạy.
- Dữ liệu kiểm thử cuối cùng có bốn Task và bao phủ đủ `Pending`, `InProgress`, `Completed`.
- Ảnh chụp kết quả trên trình duyệt xác nhận dữ liệu được commit và giao diện được làm mới.

Hạng mục Mendix đã hoàn thành và được kiểm thử thủ công thành công ngày 14/09/2026.
