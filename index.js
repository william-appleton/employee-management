const connection = require("./database/connection");

connection.query("SELECT * FROM employee", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  });