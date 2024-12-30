const { connectDB } = require("../config/config.js");
const query = require("../config/query.js");
const usersModel = require("./usersModel");

let pool;

async function initDB() {
    pool = await connectDB();
}

initDB();

const orderModel = {
    createOrderAndUpdatePages: async (userId, pagesToBuy) => {
        try {
            // Cập nhật số trang in của người dùng
            const user = await usersModel.getUserById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            const currentPages = user.pageBalance || 0;
            const updatedPages = currentPages + pagesToBuy;
            const updateData = {
                pageBalance: updatedPages,
            };
            await usersModel.updateUser(userId, updateData);

            // Chèn đơn hàng vào bảng Orders
            const orderData = {
                user_ID: userId,
                quantityPaper: pagesToBuy,
                totalCost: pagesToBuy * 250,
                dateOrder: new Date(),
            };
            const result = await query.insertSingleRow("Orders", orderData);
            
            // Trả về thông tin đơn hàng và người dùng
            return {
                order: {
                    id: result.insertId,
                    ...orderData,
                },
                updatedUser: {
                    userId,
                    updatedPages,
                },
            };
        } catch (error) {
            console.error("💀 Error creating order and updating pages:", error);
            throw error;
        }
    },

    getOrderById: async (id) => {
        try {
            const order = await query.getOne("Orders", { order_ID: id });
            return order;
        } catch (error) {
            console.error("💀 Error fetching order:", error);
            throw error;
        }
    },

    getAllOrdersByUser: async (userId) => {
        try {
            const orders = await query.getAll("Orders", { user_ID: userId });
            return orders;
        } catch (error) {
            console.error("💀 Error fetching orders for user:", error);
            throw error;
        }
    },
};

module.exports = orderModel;


