const { message } = require("statuses");
const usersModel = require("../models/usersModel");

const jwt = require('jsonwebtoken');

module.exports = {
    //signin
    signIn: async (req, res) =>{
        try{
            const email = req.body.email;
            const password = req.body.password;
            const user = await usersModel.getUserByEmail(email);
            if(!user){
                return res.status(404).json({message: "User not found"});
            };

            if(user.password !== password){
                return res.status(401).json({message: "Invalid password"});
            }

            const token = jwt.sign({
                user_ID : user.user_ID,
                role : user.role
                },
                process.env.JWT_SECRET_KEY,
                { expiresIn: "2h" }
            )
            res.status(200).json(
                {
                    status: "Login successfully",
                    message: "Welcome " + user.email.split("@")[0],
                    id: user.user_ID,
                    role: user.role,
                    Access_token: token
                }    
            );
        }catch{
            res.status(500).json({message: "Internal server error"});
        };
    }
};