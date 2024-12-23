# Tài liệu API Quản lý Máy in

API nguồn: `http://localhost:3000/api/v1`

---

## **1. Route: `/printers`**

### **Phương thức:** `GET`
- **Mục đích:** Lấy danh sách tất cả máy in.
- **Tham số yêu cầu:** Không có.
- **Dữ liệu trả về:**
    ```json
    {
      "status": 200,
      "data": [
        {
          "id": "integer",
          "name": "string",
          "model": "string",
          "status": "string",
          "location": {
            "campus": "string",
            "building": "string",
            "room": "string"
          }
        },
        ...
      ],
      "message": "Successfully Printers Retrieved!"
    }
    ```
- **Lỗi:**
    ```json
    {
      "status": 500,
      "message": "Error Retrieving Printers"
    }
    ```

---

## **2. Route: `/printers/:id`**

### **Phương thức:** `GET`
- **Mục đích:** Lấy thông tin chi tiết của một máy in cụ thể.
- **Tham số yêu cầu:**
  - `id` (integer): ID của máy in cần lấy.
- **Dữ liệu trả về:**
    ```json
    {
      "status": 200,
      "data": {
        "id": "integer",
        "name": "string",
        "model": "string",
        "status": "string",
        "location": {
          "campus": "string",
          "building": "string",
          "room": "string"
        }
      },
      "message": "Successfully Printer Retrieved!"
    }
    ```
- **Lỗi:**
    ```json
    {
      "status": 500,
      "message": "Error Retrieving Printer"
    }
    ```

---

## **3. Route: `/printers`**

### **Phương thức:** `POST`
- **Mục đích:** Tạo mới một máy in.
- **Dữ liệu yêu cầu:**
    ```json
    {
      "name": "string",
      "model": "string",
      "description": "string",
      "status": "string",
      "location": {
        "campus": "string",
        "building": "string",
        "room": "string"
      }
    }
    ```
- **Dữ liệu trả về:**
    ```json
    {
      "status": 201,
      "data": {
        "id": "integer",
        "name": "string",
        "model": "string",
        "description": "string",
        "status": "string",
        "location": {
          "campus": "string",
          "building": "string",
          "room": "string"
        }
      },
      "message": "Successfully Created Printer!"
    }
    ```
- **Lỗi:**
    ```json
    {
      "status": 500,
      "message": "Error Creating Printer"
    }
    ```

---

## **4. Route: `/printers/:id`**

### **Phương thức:** `PUT`
- **Mục đích:** Cập nhật thông tin máy in.
- **Tham số yêu cầu:**
  - `id` (integer): ID của máy in cần cập nhật.
- **Dữ liệu yêu cầu:** 
    ```json
    {
      "name": "string",
      "model": "string",
      "description": "string",
      "status": "string",
      "location": {
        "campus": "string",
        "building": "string",
        "room": "string"
      }
    }
    ```
- **Dữ liệu trả về:**
    ```json
    {
      "status": 200,
      "data": {
        "id": "integer",
        "name": "string",
        "model": "string",
        "description": "string",
        "status": "string",
        "location": {
          "campus": "string",
          "building": "string",
          "room": "string"
        }
      },
      "message": "Successfully Updated Printer!"
    }
    ```
- **Lỗi:**
    ```json
    {
      "status": 500,
      "message": "Error Updating Printer"
    }
    ```

---

## **5. Route: `/printers/:id`**

### **Phương thức:** `DELETE`
- **Mục đích:** Xóa máy in.
- **Tham số yêu cầu:**
  - `id` (integer): ID của máy in cần xóa.
- **Dữ liệu trả về:**
    ```json
    {
      "status": 200,
      "data": {
        "id": "integer"
      },
      "message": "Successfully Deleted Printer!"
    }
    ```
- **Lỗi:**
    ```json
    {
      "status": 500,
      "message": "Error Deleting Printer"
    }
    ```
