const orderModel = require("../models/orderModel");
const PayOs = require('@payos/node');
const payos = new PayOs (
    "6f374560-64ff-46ff-89bd-128a6baf4fbd",
    "4862d332-cc69-4282-8402-5cc9bef1d8b6",
    "3c6913e8fa45f293eefa91b65b24ce0456bc1b74d9e8d259ff972e8c29659c58"
);

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
            const result = await orderModel.CreateOrder(userId, pagesToBuy);

            res.status(200).json({
                message: "Create order successful!",
                order: result.order,
            });
        } catch (error) {
            console.error("💀 Error in buyPages:", error);
            res.status(500).json({
                error: "Failed to process purchase. Please try again later.",
            });
        }
    };

    exports.updatePages = async (req, res) => {
        const { userId, pagesToBuy } = req.body;
        // Kiểm tra đầu vào
        if (!userId || !pagesToBuy || pagesToBuy <= 0) {
            return res.status(400).json({
                error: "Invalid input! userId and positive pagesToBuy are required.",
            });
        }

        try {
            // Tạo đơn hàng và cập nhật số trang in
            const result = await orderModel.UpdatePages(userId, pagesToBuy);

            res.status(200).json({
                message: "update pages successful!",
                updatedUser: result.updatedUser,
            });
        } catch (error) {
            console.error("💀 Error in update pages:", error);
            res.status(500).json({
                error: "Failed to process updatePages. Please try again later.",
            });
        }
    };

    //tạo link thanh toán QR
    exports.CreatePaymentLink = async (req, res) => {
        const {code ,pagesToBuy, url, myDomain} = req.body;
        const order = {
            amount: 250*pagesToBuy,
            description: 'Thanh toán trang in',
            orderCode: code,
            returnUrl: `${myDomain}/fe/student-buy-update.html`, // nhập lại link để hệ thống biết sẽ điều hướng đến đâu khi thanh toán thành công
            cancelUrl: url, // nhập link để hệ thống biết điều hướng về đâu khi hủy thanh toán
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

