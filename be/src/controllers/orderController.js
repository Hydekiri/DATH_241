const orderModel = require("../models/orderModel");
const PayOs = require('@payos/node');
const payos = new PayOs (
    "6f374560-64ff-46ff-89bd-128a6baf4fbd",
    "4862d332-cc69-4282-8402-5cc9bef1d8b6",
    "3c6913e8fa45f293eefa91b65b24ce0456bc1b74d9e8d259ff972e8c29659c58"
);
const YOUR_DOMAIN = 'http://localhost:3000';

    // Controller xử lý việc mua số trang in
    exports.buyPages = async (req, res) => {
        const { userId, pagesToBuy } = req.body;
        // Kiểm tra đầu vào
        if (!userId || !pagesToBuy || pagesToBuy <= 0) {
            return res.status(400).json({
                error: "Invalid input! userId and positive pagesToBuy are required.",
            });
        }

        try {
            // Tạo đơn hàng và cập nhật số trang in
            const result = await orderModel.createOrderAndUpdatePages(userId, pagesToBuy);

            res.status(200).json({
                message: "Purchase successful!",
                order: result.order,
                updatedUser: result.updatedUser,
            });
        } catch (error) {
            console.error("💀 Error in buyPages:", error);
            res.status(500).json({
                error: "Failed to process purchase. Please try again later.",
            });
        }
    };

    //tạo link thanh toán QR
    exports.CreatePaymentLink = async (req, res) => {
        const {code ,pagesToBuy} = req.body;
        const order = {
            amount: 250*pagesToBuy,
            description: 'Thanh toán trang in',
            orderCode: code,
            returnUrl: `${YOUR_DOMAIN}`, // nhập lại link để hệ thống biết sẽ điều hướng đến đâu khi thanh toán thành công
            cancelUrl: `${YOUR_DOMAIN}`, // nhập link để hệ thống biết điều hướng về đâu khi hủy thanh toán
        };
    
        try {
            const paymentLink = await payos.createPaymentLink(order);
            res.status(200).json({
                message: "Tạo link thanh toán thành công!",
                paymentLink: paymentLink.checkoutUrl,
            });
        } catch (error) {
            console.error("Lỗi khi tạo liên kết thanh toán:", error);
            res.status(500).json({ error: 'Không thể tạo liên kết thanh toán' });
        }
    };

    
    /*
    // Controller lấy thông tin đơn hàng theo ID
    exports.getOrderById = async (req, res) => {
        const { id } = req.params;

        try {
            const order = await orderModel.getOrderById(id);

            if (!order) {
                return res.status(404).json({ error: "Order not found!" });
            }

            res.status(200).json(order);
        } catch (error) {
            console.error("💀 Error in getOrderById:", error);
            res.status(500).json({ error: "Failed to fetch order." });
        }
    };

    // Controller lấy tất cả đơn hàng của một người dùng
    exports.getAllOrdersByUser = async (req, res) => {
        const { userId } = req.params;

        try {
            const orders = await orderModel.getAllOrdersByUser(userId);

            if (!orders) {
                return res.status(404).json({ error: "No orders found for this user!" });
            }

            res.status(200).json(orders);
        } catch (error) {
            console.error("💀 Error in getAllOrdersByUser:", error);
            res.status(500).json({ error: "Failed to fetch orders for user." });
        }
    }; */
//};

//module.exports = orderController;
