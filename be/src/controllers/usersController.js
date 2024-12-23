const usersModel = require("../models/usersModel");

exports.getUsers = async (req, res) => {
    try {
        const { role } = req.query; 
        const condition = role ? { role } : {}; 
        const users = await usersModel. getALLUsers(condition);
        res.status(200).json({ status: 200, data: users, message: "Successfully retrieved users!" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: 500, message: "Error retrieving users." });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await usersModel.getUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ status: 404, message: "User does not exist" });
        }
        res.status(200).json({ status: 200, data: user, message: "User details retrieved successfully!" });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Error retrieving user details' });
    }
};

  exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const userData = req.body;

    try {
        await usersModel.updateUser(id, userData);
        res.status(200).json({ status: 200, message: "User updated successfully!" });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Error updating user' });
    }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        await usersModel.deleteUser(id);
        res.status(200).json({ status: 200, message: "User deleted successfully!" });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Error deleting user' });
    }
};

exports.createUser = async (req, res) => {
    const userData = req.body;
    try {
        const newUser = await usersModel.createUser(userData);
        res.status(201).json({ status: 201, data: newUser, message: "Tạo người dùng thành công!" });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Lỗi khi tạo người dùng' });
    }
};

// exports.login = async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         const user = await usersModel.getUserByEmail(email);
//         if (!user || user.password !== password) {
//             return res.status(401).json({ status: 401, message: "Email hoặc mật khẩu không đúng" });
//         }
//         res.status(200).json({ status: 200, data: user, message: "Đăng nhập thành công!" });
//     } catch (error) {
//         res.status(500).json({ status: 500, message: 'Lỗi khi đăng nhập' });
//     }
// };
