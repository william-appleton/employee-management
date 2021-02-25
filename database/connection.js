const mysql = require("mysql");
const util = require("util");

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "CleanSlate68@",
    database: "employees"
  });
  
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });

con.query = util.promisify(con.query);

module.exports = con;