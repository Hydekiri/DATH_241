const { message } = require("statuses");
const usersModel = require("../models/usersModel");
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

module.exports = {
    //signin
    signIn: async (req, res) => {
        try {
            const email = req.body.email;
            const password = req.body.password;
            const user = await usersModel.getUserByEmail(email);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            };

            /*
            if (user.password !== password) {
                return res.status(401).json({ message: "Invalid password" });
            }*/
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Invalid password" });
            }

            const token = jwt.sign({
                user_ID: user.user_ID,
                role: user.role
            },
                process.env.JWT_SECRET_KEY,
                { expiresIn: "2h" }
            )
            return res.status(200).json(
                {
                    status: "Login successfully",
                    message: "Welcome " + user.email.split("@")[0],
                    id: user.user_ID,
                    role: user.role,
                    Access_token: token
                }
            );
        } catch {
            return res.status(500).json({ message: "Internal server error" });
        };
    },
    register: async (req, res) => {
        try {
            const { email, password, name, role, pageBalance } = req.body;

            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(password, salt);

            const user = await usersModel.createUser({ email, password: hashedPassword, name, role, pageBalance });

            if (!user) return res.status(404).json({ Message: "Can't create new account !" });

            return res.status(200).json({
                status: 200,
                data: user,
                message: "Create new user successfully !"
            });
        }
        catch (error) {
            return res.status(500).json({ Message: "Internal Server error !" });
        }
    }
};