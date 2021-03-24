const mysql = require('mysql');
//local mysql db connection
const con = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'crudapp'
});


con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "CREATE TABLE IF NOT EXISTS customers (name VARCHAR(255), email VARCHAR(255), phone VARCHAR(255), password VARCHAR(255))";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });
});


module.exports = con;