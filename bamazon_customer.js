require('dotenv').config();
var mysql = require('mysql');
var inquire = require('inquirer');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,

    user: 'root',

    password: process.env.password,
    database: "bamazon_DB"
})

function displayStore()  {
    var search = "SELECT * FROM products";
    connection.query(search, function(err, res)  {
        if(err)  throw err;
        console.log("You in");
        for(var i = 0; i < res.length; i++)  {
            console.log(`
         
    ID: ${res[i].id}    NAME: ${res[i].product_name}    DEPARTMENT: ${res[i].department_name} 
                PRICE: $ ${res[i].price}       QUANITY: ${res[i].quanity}
            
    `)
        }
    })
    connection.end();
}

displayStore();