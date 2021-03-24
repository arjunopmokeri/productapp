const express = require('express');
const bodyParser = require('body-parser');

var dbConn = require('./config/db.config');

//let connection = mysql.createConnection(dbConn);

// create express app
const app = express();

// Setup server port
const port = process.env.PORT || 5000;

var urlencodedparser = bodyParser.urlencoded({ extended: false });
var jsonparser = bodyParser.json();


// define a root route
app.get('/hello', function (req, res) {
    res.status(200).send("welcome ");
})

app.get('/product/list', function (req, res) {
    var sql = 'select * from product';
    dbConn.query(sql, function (err, data) {
        if (err) throw err;
        if (data) {
            return res.status(500).send({ error: true, message: "product listed ", product: data });
        }
    })
})

app.delete('/product/delete/:product_code', (req, res) => {
    var sql = 'delete from product where product_code=?';
    dbConn.query(sql, [req.params.product_code], (err, data, fields) => {
        if (err) throw err;
        if (data) {
            return res.status(200).send({ error: true, message: "product deleted" });
        }
    })

})

app.put('/product/update/:product_code', jsonparser, (req, res) => {
    var sql = 'update product set product_name=?, price=?, category=?  where product_code=?';
    dbConn.query(sql, [req.body.product_name, req.body.price, req.body.category], (err, data, fields) => {
        if (err) throw err;
        if (data) {
            return res.status(200).send({ error: true, message: "product updated" });
        }
    })

})

app.post('/product/add', jsonparser, function (req, res) {
    var pro = {
        product_name: req.body.product_name,
        product_code: req.body.product_code,
        price: req.body.price,
        category: req.body.category
    };
    var sql = 'select * from product where product_code=?';
    dbConn.query(sql, [pro.product_code], (err, data, fields) => {
        if (err) throw err;
        if (data[0]) {
            var msg = pro.product_code + "  already exist";
            return res.status(500).send({ error: true, message: msg });
        }
        else {
            dbConn.query("INSERT INTO product set ?", pro, function (err, data) {
                if (err) {
                    console.log(err);
                    return res.status(500).send({ success: false, message: "product not created" });
                }
                return res.status(200).send({ success: true, message: "product created" });
            });
        }
    })
})

//signup
app.post('/signup', jsonparser, function (req, res) {
    console.log("hello")
    var Employee = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password
    };
    var sql = 'SELECT * FROM customers WHERE email=?';
    dbConn.query(sql, [Employee.email], (err, data, fields) => {
        if (err) throw err;
        if (data[0]) {
            var msg = Employee.email + " already exist";
            return res.status(500).send({ error: true, message: msg });
        }
        else {
            dbConn.query("INSERT INTO customers set ?", Employee, function (err, data) {
                if (err) {
                    console.log(err);
                    return res.status(500).send({ success: false, message: "User not created" });
                }
                return res.status(200).send({ success: true, message: "User created" });
            });
        }
    })

});

app.post('/signin', jsonparser, function (req, res) {
    console.log("arjun");
    //var email = req.body.email;
    //var password = req.body.password;
    //console.log(email);
    var sql = `SELECT * FROM customers WHERE email=?`;
    dbConn.query(sql, req.body.email, function (err, data, fields) {
        console.log(data[0])
        if (err) {
            return res.status(500).send("User not exist");
        }

        else {
            if (data[0].password == req.body.password && data[0].email == req.body.email) {
                return res.status(200).send({ success: true, message: "User authenticated" });
            }
            else if (data[0].password != req.body.password) {
                return res.status(500).send({ success: false, message: "password is incorrect.Please try again" });
            }
            else if (data[0].email != req.body.email) {
                return res.status(500).send({ success: false, message: "Email not exist.Create account" });
            }
            else {
                return res.status(500).send({ success: false, message: "Unautherized access" });
            }

        }
    })
});


// listen for requests
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});