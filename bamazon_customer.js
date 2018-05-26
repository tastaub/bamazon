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
    console.log(`
     ____   ___  __   __  ___  _________  __  _ 
    |  _   / _      /  |/  _  ___  / _   |  || |
    | |_) ) |_| |   v   | |_| |  / / | | |  |/ |
    |  _ (|  _  | | _/| |  _  | / /| | | |     |
    | |_) ) | | | |   | | | | |/ /_| |_| | |_  |
    |____/|_| |_|_|   |_|_| |_/_____)___/|_| |_|`)
    var search = "SELECT * FROM products";
    connection.query(search, function(err, res)  {
        if(err)  throw err; 
        console.log("You in");
        for(var i = 0; i < res.length; i++)  {
            console.log(`
         ID: ${res[i].id}    NAME: ${res[i].product_name}    DEPARTMENT: ${res[i].department_name} 
                PRICE: $ ${res[i].price}       QUANITY: ${res[i].quanity}`)
        }
    })
    getItems();
}

function getItems()  {
    inquire.prompt([
        {
            type: "input",
            name: "id",
            message: "Enter item ID to purchase",
            
        },  {
            type: "submit",
            name: "quanity",
            message: "How many would you like?",
            validate: function(value){
                var valid = value.match(/^[0-9]+$/)
                if(valid){
                    return true
                }
                    return 'Please enter a numerical value'
            }
        }
    ]).then(function(input)  {
        connection.query('SELECT * FROM products WHERE id=?', [input.id], function(err,res)  {
            if(err)  throw err;
            if(input.quanity > res[0].quanity)  {
                console.log("This is too many items");
                displayStore();
            } else {
                connection.query('UPDATE products SET ? WHERE ?', [{
                    quanity: res[0].quanity - input.quanity
                },  {
                    id: input.id
                }], function(err, update)  {
                    
                    console.log(`
                            Bamazon Receipt
            -----------------------------------------------
                Item:   ${res[0].product_name}
                
                Quanity: ${input.quanity}    $${res[0].price}

                Total $ ${input.quanity * res[0].price}
            -----------------------------------------------      
                        ~Thank You Come Again~`)
                    connection.end();
                })
            }
                
                
        })
        
    })
}



displayStore();