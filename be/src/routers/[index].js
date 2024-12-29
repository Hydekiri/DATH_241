
module.exports = (app) => {
    const express = require("express");
    const router = express.Router();
    require("./usersRouter")(router);
    require("./printerRouter")(router);
    require("./locationRouter")(router);
    require("./receiverMessageRounter")(router);
    require("./notificationRouter")(router);
    require("./userNotificationRouter")(router);
    require("./authRouter")(router);
    require("./documentRouter")(router);
    require("./printConfigRouter")(router);
    require("./orderRouter")(router);
    app.use("/api/d1", router);
};
