const { closeDB, connectDB } = require("./config.js");
const fs = require("fs");

const sqlScriptPath = "./src/config/db.sql";

async function waitForMysql(pool) {
  let isConnected = false;
  while (!isConnected) {
    try {
      await pool.query("SELECT 1"); // Thực hiện một truy vấn đơn giản để kiểm tra kết nối
      isConnected = true;
      console.log("MySQL is ready 🎉");
    } catch (error) {
      console.error("💀 MySQL is not ready yet, retrying...");
      await new Promise(resolve => setTimeout(resolve, 2000)); // Chờ 2 giây trước khi thử lại
    }
  }
}

async function executeSqlScript() {
  try {
    const sqlScript = fs.readFileSync(sqlScriptPath, "utf8");
    const commands = sqlScript.split(/;\s*$/m); // Phân tách theo dấu ;
    console.log(commands);

    const pool = await connectDB();
    await waitForMysql(pool);
    // Remove last empty command if it exists
    if (commands[commands.length - 1].trim() === "") {
      commands.pop();
    }

    for (let i = 0; i < commands.length; i++) {
      await pool.query(commands[i]);
    }
    console.log("Database setup completed 🚀");
  } catch (error) {
    console.error("💀 Error executing SQL script:", error);
  } /*finally {
    await closeDB();
    console.log("Connection pool closed 🚪");
  }*/
}

executeSqlScript();