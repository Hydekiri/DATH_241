module.exports = (router) => {
    const authController = require("../controllers/authController");

    router.post("/auth/login", authController.signIn);
    router.post("/auth/register", authController.register);
};
