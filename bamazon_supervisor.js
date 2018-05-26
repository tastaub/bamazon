require('dotenv').config();
var mysql = require('mysql');
var inquire = require('inquirer');
var cTable = require('console.table');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,

    user: 'root',

    password: process.env.password,
    database: "bamazon_DB"
})

connection.connect(function(err) {
    if (err) throw err;
    connection.query("SELECT * FROM departments", function(err,res)  {
        for(i = 0; i < res.length; i++)  {
            console.log(`${res[i].dpt_name} ${res[i].dpt_sales}`)
        }
        connection.end();
    })
  });

// 

