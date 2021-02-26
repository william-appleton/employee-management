const mysql = require("mysql");
const util = require("util");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "CleanSlate68@",
    database: "employees"
  });
  
  connection.connect(function(err) {
    if (err) throw err;
  });

connection.query = util.promisify(connection.query);

module.exports = connection;