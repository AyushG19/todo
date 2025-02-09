const Pool = require('pg').Pool;

const pool = new Pool({
    user:"postgres",
    password: "@Ayush1900",
    host : "localhost",
    port : 5432,
    database : "todo_db"
});

module.exports = pool;