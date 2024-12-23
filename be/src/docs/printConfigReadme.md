# Tài liệu API Quản lý Print Configurations
<!-- Gỏ CTRL + Shift + V để trông OK hơn-->
<!-- Xem thử mẫu API: nhấp vào route api (nếu có) -->
Tài liệu này mô tả các route API và chức năng dùng để quản lý các cấu hình in ấn (Print Configurations) trong hệ thống.
API nguồn: http://localhost:3000/api/v1
---

## 1. Route: **[/printconfig](http://localhost:3000/api/v1/printconfig)** hoặc **[/printconfig(kèm parameters)](http://localhost:3000/api/v1/printconfig/?config_ID=${config_ID}&user_ID=${user_ID}&printer_ID=${printer_ID}&status=${status})**
các parameter có thể được thay đổi theo nhu cầu xem như một bộ lọc (có thể thay đổi vị trí para) ví dụ:
http://localhost:3000/api/v1/printconfig?user_ID=1&config_ID=1 nhấp vào xem kết quả

- **Phương thức:** `GET` kèm parameter (không dùng body vì phải dùng post mất định nghĩa get)
- **Mục đích:** Lấy danh sách tất cả cấu hình in ấn.
- **Tham số yêu cầu:** Không có.
- **Dữ liệu trả về:**
  - **Thành công:** gọi /printconfig (không có parameter)
    ```json
    {
      "status": 200,
      "data": [
        {
          "config_ID": "integer",
          "printStart": "datetime",
          "printEnd": "datetime",
          "user_ID": "integer",
          "printer_ID": "integer"
        },
        ...
      ],
      "message": "Successfully retrieved Print Configurations!"
    }
    ```
  - **Lỗi:**
    ```json
    {
      "status": 500,
      "message": "Error retrieving Print Configurations"
    }
    ```

---

## 2. Route: **[/printconfig](http://localhost:3000/api/v1/printconfig)** 

- **Phương thức:** `POST`
- **Mục đích:** Tạo mới một cấu hình in ấn.
- **Dữ liệu yêu cầu:**
  - `printStart` (datetime): Thời gian bắt đầu in.
  - `printEnd` (datetime): Thời gian kết thúc in.
  - `user_ID` (integer): ID của người dùng.
  - `printer_ID` (integer): ID của máy in.
- **Dữ liệu trả về:**
  - **Thành công:**
    ```json
    {
      "status": 200,
      "data": {
        "config_ID": "integer",
        "printStart": "datetime",
        "printEnd": "datetime",
        "user_ID": "integer",
        "printer_ID": "integer"
      },
      "message": "Successfully created Print Configuration!"
    }
    ```
  - **Lỗi:**
    ```json
    {
      "status": 500,
      "message": "Error creating Print Configuration"
    }
    ```

---

## 3. Route: **/printconfig/:id**

- **Phương thức:** `PUT`
- **Mục đích:** Cập nhật thông tin của một cấu hình in ấn cụ thể.
- **Tham số yêu cầu:**
  - `id` (integer): ID của cấu hình cần cập nhật.
- **Dữ liệu yêu cầu:** 
  - Các trường có thể cập nhật:
    - `printStart` (datetime): Thời gian bắt đầu in.
    - `printEnd` (datetime): Thời gian kết thúc in.
    - `user_ID` (integer): ID của người dùng.
    - `printer_ID` (integer): ID của máy in.
- **Dữ liệu trả về:**
  - **Thành công:**
    ```json
    {
      "status": 200,
      "data": {
        "config_ID": "integer",
        "printStart": "datetime",
        "printEnd": "datetime",
        "user_ID": "integer",
        "printer_ID": "integer"
      },
      "message": "Successfully updated Print Configuration!"
    }
    ```
  - **Lỗi:**
    ```json
    {
      "status": 500,
      "message": "Error updating Print Configuration"
    }
    ```

---

## 4. Route: **/printconfig/:id**

- **Phương thức:** `DELETE`
- **Mục đích:** Xóa một cấu hình in ấn khỏi hệ thống.
- **Tham số yêu cầu:**
  - `id` (integer): ID của cấu hình cần xóa.
- **Dữ liệu trả về:**
  - **Thành công:**
    ```json
    {
      "status": 200,
      "data": {
        "config_ID": "integer"
      },
      "message": "Successfully deleted Print Configuration!"
    }
    ```
  - **Lỗi:**
    ```json
    {
      "status": 500,
      "message": "Error deleting Print Configuration"
    }
    ```

---

## Chú thích

- **Print Configurations** là các cấu hình liên quan đến thời gian, người dùng, và máy in được lưu trữ để quản lý các lệnh in ấn trong hệ thống.
