# Tài liệu API tạo Order

API nguồn: http://localhost:3000/api/d1
---
## chú ý: chạy lệnh "npm install @payos/node" để thêm model payOS
## 1. Route: **(http://localhost:3000/api/d1/buypages)**
- **Phương thức:** `POST` 
- **Mục đích:** tạo đơn mua trang in và cập nhật vào database
- **Tham số yêu cầu:** `userId` (integer): ID của người dùng
- **Dữ liệu trả về:**
    ```json
    {
      "status": 200,

      "data": 
        {
          "order": {
            "id": "number",
            "user_ID": "number",
            "quantityPaper": "interger",
            "totalCost": "interger",
            "dateOrder": "time"
          },
          "updatedUser": {
            "userId": "number",
            "updatedPages": "interger"
          }
        },

      "message": "Purchase successful!"
    }
    ```
  - **Lỗi:**
    ```json
    {
      "status": 400,
      "message": "Invalid input! userId and positive pagesToBuy are required."
    }

    ```json
    {
      "status": 500,
      "message": "Failed to process purchase. Please try again later."
    }

---

## 2. Route: **[/create-payment-link](http://localhost:3000/api/d1/create-payment-link)** 

- **Phương thức:** `POST`
- **Mục đích:** tạo link quét QR thanh toán
- **Dữ liệu yêu cầu:**
       "code"(interger): ID của đơn hàng trên hệ thóng payOs.
       "pagesToBuy"(interger): số trang in mà người dùng mua trong đơn hàng lần này.
- **Dữ liệu trả về:**
  - **Thành công:**
    ```json
    {
      "status": 200,
      "message": "Tạo link thanh toán thành công!",
      "paymentLink": "string",
    }
    ```

  - **Lỗi:**
    ```json
    {
      "status": 500,
      "message": "Không thể tạo liên kết thanh toán"
    }
    ```


