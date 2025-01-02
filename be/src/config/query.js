const { connectDB } = require("./config.js");

let pool;

async function initDB() {
    pool = await connectDB();
}

initDB();

const Query = {
    getOne: async (table, condition = {}) => {
        try {
            const keys = Object.keys(condition);
            const values = Object.values(condition);
            const whereClause = keys.map((key) => `${key} = ?`).join(" AND ");
            const query = `SELECT * FROM ${table} ${keys.length > 0 ? `WHERE ${whereClause}` : ""} LIMIT 1`;
            const [rows] = await pool.query(query, values);
            return rows[0] || null;
        } catch (error) {
            console.log(error);
        }
    },

    getAll: async (table, condition = {}) => {
        try {
            const keys = Object.keys(condition);
            const values = Object.values(condition);
            const whereClause = keys.map((key) => `${key} = ?`).join(" AND ");
            const query = `SELECT * FROM ${table} ${keys.length > 0 ? `WHERE ${whereClause}` : ""}`;
            const [rows] = await pool.query(query, values);
            return rows;
        } catch (error) {
            console.log(error);
        }
    },

    insertSingleRow: async (table, data = {}) => {
        try {
            const fields = Object.keys(data).join(", ");
            const placeholders = Object.keys(data).map(() => "?").join(", ");
            const query = `INSERT INTO ${table} (${fields}) VALUES (${placeholders})`;
            const [result] = await pool.query(query, Object.values(data));
            return result;
        } catch (error) {
            console.log(error);
        }
    },

    insertMultipleRows: async (table, rows = []) => {
        try {
            if (rows.length === 0) {
                throw new Error("No data to insert");
            }
            const fields = Object.keys(rows[0]).join(", ");
            const placeholders = rows.map(() => `(${Object.keys(rows[0]).map(() => "?").join(", ")})`).join(", ");
            const query = `INSERT INTO ${table} (${fields}) VALUES ${placeholders}`;
            const values = rows.reduce((acc, row) => acc.concat(Object.values(row)), []);
            const [result] = await pool.query(query, values);
            return result;
        } catch (error) {
            console.log(error);
        }
    },

    updateRow: async (table, data, condition = {}) => {
        try {
            const keys = Object.keys(condition);
            const values = Object.values(condition);
            const whereClause = keys.map((key) => `${key} = ?`).join(" AND ");
            const query = `UPDATE ${table} SET ? ${keys.length > 0 ? `WHERE ${whereClause}` : ""}`;
            const [result] = await pool.query(query, [data, ...values]);
            return result;
        } catch (error) {
            console.log(error);
        }
    },

    deleteRow: async (table, condition = {}) => {
        try {
            const keys = Object.keys(condition);
            const values = Object.values(condition);
            const whereClause = keys.map((key) => `${key} = ?`).join(" AND ");
            const query = `DELETE FROM ${table} ${keys.length > 0 ? `WHERE ${whereClause}` : ""}`;
            const [result] = await pool.query(query, values);
            return result;
        } catch (error) {
            console.log(error);
        }
    },
};

module.exports = Query;
