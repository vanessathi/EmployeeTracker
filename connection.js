const mysql = require("mysql");


const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1thoigi@n",
    port: 3306,
    database: "employees"
})


module.exports = connection;