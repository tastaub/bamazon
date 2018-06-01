require('dotenv').config();
var mysql = require('mysql');
var inquire = require('inquirer');
var Table = require('easy-table');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,

    user: 'root',

    password: process.env.password,
    database: "bamazon_DB"
})

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    displayStore();
  });

function displayStore()  {
    console.log(`
     ____   ___  __   __  ___  _________  __  _ 
    |  _   / _      /  |/  _  ___  / _   |  || |
    | |_) ) |_| |   v   | |_| |  / / | | |  |/ |
    |  _ (|  _  | | _/| |  _  | / /| | | |     |
    | |_) ) | | | |   | | | | |/ /_| |_| | |_  |
    |____/|_| |_|_|   |_|_| |_/_____)___/|_| |_|
    `)
    var search = "SELECT * FROM products";
    connection.query(search, function(err, res)  {
        if(err)  throw err; 
        var data = res
        var t = new Table
 
            data.forEach(function(product) {
            t.cell('Item ID', product.id)
            t.cell('Item Name', product.product_name)
            t.cell('Department Name', product.department_name)
            t.cell('Price', product.price)
            t.cell('Quanity Available', product.quanity);
            t.newRow()
            })
            
            console.log(t.toString())
        getItems();
    })
    
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
                var sales = input.quanity * res[0].price;
                var department = res[0].department_name
                connection.query('UPDATE products SET ? WHERE ?', [{
                    quanity: res[0].quanity - input.quanity,
                    product_sales: input.quanity * res[0].price
                },  {
                    id: input.id
                }], function(err, update)  {
                    if(err) throw err;
                    console.log(`
                            Bamazon Receipt
            -----------------------------------------------
                Item:   ${res[0].product_name}
                
                Quanity: ${input.quanity}    $${res[0].price}

                Total $ ${sales}
            -----------------------------------------------      
                        ~Thank You Come Again~`)
                    updateDpt(sales, department);
                })
            }
                
                
        })
        
    })
}

function updateDpt(sales, dpt)  {
    connection.query("SELECT * FROM departments WHERE ?",
    [{
        dpt_name: dpt,
    }
    ],function(err,res)  {
        if(err) throw err
        connection.query("UPDATE departments SET ? WHERE ?",[{
            dpt_sales: res[0].dpt_sales + sales
        },  {
            dpt_name: res[0].dpt_name
        }], function(err, dptSales)  {
            if(err)  throw err;
            connection.end();
        })
    })
    
    
    // connection.query("UPDATE departments SET ? WHERE ?",[{
    //     dpt_sales: sales + 
    // },  {

    // }]
    // function(err,results)  {

    // })
}
