# Tài liệu API Quản lý Người Dùng

<!-- Gỏ CTRL + Shift + V để trông OK hơn-->
<!-- Xem thử mẫu API: nhấp vào route api (nếu có) -->
Tài liệu này mô tả các route API và chức năng cho việc quản lý người dùng trong hệ thống.
API nguồn: http://localhost:3000/api/v1

---

## 1. Route: **[/users](http://localhost:3000/api/v1/users)** hoặc **[/users?role=spso](http://localhost:3000/api/v1/users?role=spso)** hoặc **[/users?role=student](http://localhost:3000/api/v1/users?role=student)**

- **Phương thức:** `GET`
- **Mục đích:** Lấy danh sách tất cả người dùng hoặc lọc theo vai trò.
- **Tham số yêu cầu (tùy chọn):**
  - `role` (string): Vai trò của người dùng để lọc (ví dụ: "spso", "student").
- **Dữ liệu trả về:**
  - **Thành công:**
    ```json
    {
      "status": 200,
      "data": [
        {
          "user_ID": "integer",
          "name": "string",
          "email": "string",
          "role": "string",
          "created_at": "string"
        },
        ...
      ],
      "message": "Successfully retrieved users!"
    }
    ```
  - **Lỗi:**
    ```json
    {
      "status": 500,
      "message": "Error retrieving users."
    }
    ```

---

## 2. Route: **/users/:id**

- **Phương thức:** `GET`
- **Mục đích:** Lấy thông tin chi tiết của một người dùng cụ thể.
- **Tham số yêu cầu:**
  - `id` (string): ID của người dùng cần truy xuất.
- **Dữ liệu trả về:**
  - **Thành công:**
    ```json
    {
      "status": 200,
      "data": {
        "user_ID": "integer",
        "name": "string",
        "email": "string",
        "role": "string",
        "created_at": "string"
      },
      "message": "User details retrieved successfully!"
    }
    ```
  - **Lỗi:**
    ```json
    {
      "status": 404,
      "message": "User does not exist."
    }
    ```

---

## 3. Route: **/users**

- **Phương thức:** `POST`
- **Mục đích:** Tạo mới một người dùng.
- **Dữ liệu yêu cầu:**
  - `name` (string): Tên của người dùng.
  - `email` (string): Email của người dùng.
  - `password` (string): Mật khẩu người dùng.
  - `role` (string, tùy chọn): Vai trò của người dùng (mặc định là "user").
- **Dữ liệu trả về:**
  - **Thành công:**
    ```json
    {
      "status": 201,
      "data": {
        "id": "integer",
        "name": "string",
        "email": "string",
        "role": "string"
      },
      "message": "Tạo người dùng thành công!"
    }
    ```
  - **Lỗi:**
    ```json
    {
      "status": 500,
      "message": "Lỗi khi tạo người dùng."
    }
    ```

---

## 4. Route: **/users/:id**

- **Phương thức:** `PUT`
- **Mục đích:** Cập nhật thông tin của một người dùng cụ thể.
- **Tham số yêu cầu:**
  - `id` (string): ID của người dùng cần cập nhật.
- **Dữ liệu yêu cầu:**
  - Có thể gửi bất kỳ trường nào sau đây để cập nhật:
    - `name` (string): Tên của người dùng.
    - `email` (string): Email của người dùng.
    - `password` (string): Mật khẩu người dùng.
    - `role` (string): Vai trò của người dùng.
- **Dữ liệu trả về:**
  - **Thành công:**
    ```json
    {
      "status": 200,
      "message": "User updated successfully!"
    }
    ```
  - **Lỗi:**
    ```json
    {
      "status": 500,
      "message": "Error updating user."
    }
    ```

---

## 5. Route: **/users/:id**

- **Phương thức:** `DELETE`
- **Mục đích:** Xóa một người dùng khỏi hệ thống.
- **Tham số yêu cầu:**
  - `id` (string): ID của người dùng cần xóa.
- **Dữ liệu trả về:**
  - **Thành công:**
    ```json
    {
      "status": 200,
      "message": "User deleted successfully!"
    }
    ```
  - **Lỗi:**
    ```json
    {
      "status": 500,
      "message": "Error deleting user."
    }
    ```

---
