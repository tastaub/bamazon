require('dotenv').config();
var mysql = require('mysql');
var inquire = require('inquirer');
var Table = require('easy-table');

const questions = {
    task : {
        type : 'list',
        name: 'task',
        choices: ['View Inventory', 'View low Inventory', 'Add Inventory', 'Add Product'],
        message: 'Manager Options'
    }, items : {
        type : 'list',
        name: 'item',
        choices: ['View Inventory', 'View low Inventory', 'Add Inventory', 'Add Product'],
        message: 'Manager Options'
    }
}

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,

    user: 'root',

    password: process.env.password,
    database: "bamazon_DB"
})

connection.connect(function(err)  {
    if(err) throw err;
})

