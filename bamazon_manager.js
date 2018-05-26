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

function managerTask()  {
    inquire.prompt([
        {
            type: 'list',
            name: 'mgrTask',
            message: "What is your task?",
            choices: ['View Products For Sale', 'View Low Inventory', 'Add To Inventory', 'Add Product']
        }
    ]).then(function(task)  {
        if(task.mgrTask === 'View Products For Sale')  {
            displayInventory();
        } else if(task.mgrTask === 'View Low Inventory')  {
            lowInventory();
        } else if(task.mgrTask === 'Add To Inventory')  {
            addQuanity();
        } else if(task.mgrTask === 'Add Product')  {
            
        }
    })
}

//SELECT * FROM view products
function displayInventory()  {
    connection.query("SELECT * FROM products", function(err,res)  {
        if(err)  throw err;
        for(var i = 0; i < res.length; i++)  {
            console.table(res[i]);
        }
    })
}
//VIEW IF below x view low
function lowInventory()  {
    connection.query("SELECT * FROM products", function(err,lowStock)  {
        if(err)  throw err;
        for(i = 0; i < lowStock.length; i++)  {
            if(lowStock[i].quanity <= 12)  {
                console.log(lowStock[i].product_name + " " + lowStock[i].quanity);
            }
        }
        
    })
}
//UPDATE SET WHERE id add to
function addQuanity()  {
    displayInventory();
    inquire.prompt([
        {
            type: "input",
            name: "prodId",
            message: "Add to ID#"
        },  {
            type: 'input',
            name: 'amount',
            message: 'Add Stock'
        }
    ]).then(function(val)  {
        connection.query('SELECT * FROM products WHERE id=?', [val.prodId], function(err, addStock)  {
            if(err) throw err;
            var updQnt = parseFloat(val.amount) + addStock[0].quanity
            console.log(updQnt);
            connection.query('UPDATE products SET ? WHERE ?', [{
                quanity: updQnt
            },  {
                id: val.prodId
            }], function(err, update)  {
                
                console.log(`
                        Adjustment Log
        -----------------------------------------------
            Item:   ${addStock[0].product_name}
            
            Quanity Before: ${addStock[0].quanity}

            Quanity After: ${updQnt}
        -----------------------------------------------      
                    ~Thank You Come Again~`)
                connection.end();
            })
        })
    })
}

// INSERT INTO table(x,y,z,a)  VALUES (dd,ee,ss,rr) add product

managerTask();