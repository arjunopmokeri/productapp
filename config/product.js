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
  var sql = "CREATE TABLE IF NOT EXISTS product (product_name VARCHAR(255), product_code VARCHAR(255), price VARCHAR(255), category VARCHAR(255))";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Product Table created");
  });
});

module.exports = con;