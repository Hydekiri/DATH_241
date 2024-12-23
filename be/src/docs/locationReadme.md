# Tài liệu API Quản lý Vị trí

API nguồn: `http://localhost:3000/api/v1`

---

## **1. Route: `/locations`**

### **Phương thức:** `GET`
- **Mục đích:** Lấy danh sách tất cả vị trí.
- **Tham số yêu cầu:** Không có.
- **Dữ liệu trả về:**
    ```json
    {
      "status": 200,
      "data": [
        {
          "id": "integer",
          "campus": "string",
          "building": "string",
          "room": "string"
        },
        ...
      ],
      "message": "Successfully Retrieved Locations!"
    }
    ```
- **Lỗi:**
    ```json
    {
      "status": 500,
      "message": "Error Retrieving Locations"
    }
    ```

---

## **2. Route: `/locations/:id`**

### **Phương thức:** `GET`
- **Mục đích:** Lấy thông tin chi tiết của một vị trí cụ thể.
- **Tham số yêu cầu:**
  - `id` (integer): ID của vị trí cần lấy.
- **Dữ liệu trả về:**
    ```json
    {
      "status": 200,
      "data": {
        "id": "integer",
        "campus": "string",
        "building": "string",
        "room": "string"
      },
      "message": "Successfully Retrieved Location!"
    }
    ```
- **Lỗi:**
    ```json
    {
      "status": 500,
      "message": "Error Retrieving Location"
    }
    ```

---

## **3. Route: `/locations`**

### **Phương thức:** `POST`
- **Mục đích:** Tạo mới một vị trí.
- **Dữ liệu yêu cầu:**
    ```json
    {
      "campus": "string",
      "building": "string",
      "room": "string"
    }
    ```
- **Dữ liệu trả về:**
    ```json
    {
      "status": 201,
      "data": {
        "id": "integer",
        "campus": "string",
        "building": "string",
        "room": "string"
      },
      "message": "Successfully Created Location!"
    }
    ```
- **Lỗi:**
    ```json
    {
      "status": 500,
      "message": "Error Creating Location"
    }
    ```

---

## **4. Route: `/locations/:id`**

### **Phương thức:** `PUT`
- **Mục đích:** Cập nhật thông tin vị trí.
- **Tham số yêu cầu:**
  - `id` (integer): ID của vị trí cần cập nhật.
- **Dữ liệu yêu cầu:** 
    ```json
    {
      "campus": "string",
      "building": "string",
      "room": "string"
    }
    ```
- **Dữ liệu trả về:**
    ```json
    {
      "status": 200,
      "data": {
        "id": "integer",
        "campus": "string",
        "building": "string",
        "room": "string"
      },
      "message": "Successfully Updated Location!"
    }
    ```
- **Lỗi:**
    ```json
    {
      "status": 500,
      "message": "Error Updating Location"
    }
    ```

---

## **5. Route: `/locations/:id`**

### **Phương thức:** `DELETE`
- **Mục đích:** Xóa một vị trí.
- **Tham số yêu cầu:**
  - `id` (integer): ID của vị trí cần xóa.
- **Dữ liệu trả về:**
    ```json
    {
      "status": 200,
      "data": {
        "id": "integer"
      },
      "message": "Successfully Deleted Location!"
    }
    ```
- **Lỗi:**
    ```json
    {
      "status": 500,
      "message": "Error Deleting Location"
    }
    ```
