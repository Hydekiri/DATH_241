const express = require("express");
const cors = require("cors");
// const cookieParser = require('cookie-parser');
require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
app.get("/", (req, res) => {
    res.send("Smart Printing Service!");
});

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

app.use("/api/d1/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

require("./config/connection.js");
require("./routers/[index].js")(app);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} ✨`);
});
