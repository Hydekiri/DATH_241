module.exports = (router) => {
    const usersController = require("../controllers/usersController");

    const middlewareController = require("../controllers/middlewareController");

    router.get("/users",usersController.getUsers);
    router.get("/users/:id", middlewareController.verifyControllerAndAdmin, usersController.getUserById);
    router.put("/users/:id", middlewareController.verifyControllerAndAdmin, usersController.updateUser);
    router.delete("/users/:id", middlewareController.verifyControllerAndAdmin, usersController.deleteUser);
    router.post("/users", middlewareController.verifyAdmin, usersController.createUser);
    // router.post("/users/login", usersController.login); 
};
