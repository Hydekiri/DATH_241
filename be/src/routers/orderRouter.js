/*const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// API: Mua số trang in
router.post("/buy-pages", orderController.buyPages);

// API: Lấy đơn hàng theo ID
router.get("/:id", orderController.getOrderById);

// API: Lấy tất cả đơn hàng của một người dùng
router.get("/user/:userId", orderController.getAllOrdersByUser);

module.exports = router;
*/
module.exports = (router) => {
    const orderController = require("../controllers/orderController");
    // API: Mua số trang in
    router.post("/buypages", orderController.buyPages);
    /*router.post("/buypages", (req, res, next) => {
        console.log("POST /buypages called");
        next(); // Chuyển tiếp request đến controller
    }, orderController.buyPages);*/

   // API: Lấy đơn hàng theo ID
//    router.get("/checkorderid", orderController.getOrderById);

   // API: Lấy tất cả đơn hàng của một người dùng
//    router.get("/checkorderuser", orderController.getAllOrdersByUser);
   //API tạo link thanh toán QR'
   router.post("/create-payment-link", orderController.CreatePaymentLink);
};


