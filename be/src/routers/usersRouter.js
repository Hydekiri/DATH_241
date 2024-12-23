module.exports = (router) => {
    const usersController = require("../controllers/usersController");

    router.get("/users", usersController.getUsers);
    router.get("/users/:id", usersController.getUserById);
    router.put("/users/:id", usersController.updateUser);
    router.delete("/users/:id", usersController.deleteUser);
    router.post("/users", usersController.createUser);
    // router.post("/users/login", usersController.login); 

};
