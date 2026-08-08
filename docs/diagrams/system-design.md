# Biểu đồ hệ thống

## Kiến trúc tổng thể

```mermaid
flowchart LR
  U["Người dùng"] --> R["React + Vite"]
  R -->|"REST/JSON + JWT"| E["Node.js + Express"]
  E --> S["Sequelize"]
  S --> M[("MySQL")]
  E --> F[("uploads/")]
```

## ERD rút gọn

```mermaid
erDiagram
  ROLES ||--o{ USERS : grants
  USERS ||--o{ LEARNING_RESOURCES : uploads
  SUBJECTS ||--o{ LEARNING_RESOURCES : classifies
  CATEGORIES ||--o{ LEARNING_RESOURCES : groups
  LEARNING_RESOURCES ||--|| RESOURCE_FILES : contains
  USERS ||--o{ FAVORITES : saves
  LEARNING_RESOURCES ||--o{ FAVORITES : receives
  USERS ||--o{ DOWNLOAD_HISTORIES : creates
  LEARNING_RESOURCES ||--o{ DOWNLOAD_HISTORIES : records
  USERS ||--o{ APPROVALS : performs
  LEARNING_RESOURCES ||--o{ APPROVALS : receives
```

## Trình tự upload và duyệt

```mermaid
sequenceDiagram
  actor L as Giảng viên
  participant W as React
  participant A as Express API
  participant D as MySQL
  actor X as Quản trị viên
  L->>W: Chọn file và nhập metadata
  W->>A: POST /resources + JWT
  A->>A: Kiểm tra quyền, loại và dung lượng
  A->>D: Lưu tài liệu PENDING
  A-->>W: Upload thành công
  X->>A: PUT /admin/approvals/:id/approve
  A->>D: Cập nhật APPROVED
  A-->>X: Duyệt thành công
```
