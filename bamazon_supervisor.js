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
    superPrompt();
  });
function superPrompt()  {
    inquire.prompt([
        {
            type: "list",
            name: "supervisor",
            choices: ["Display Inventory", "Add Department"],
            message: "Action"

        }
    ]).then(function(res)  {
        
        if(res.supervisor === "Display Inventory")  {
            displayStock();
        } else if(res.supervisor === "Add Department")  {
            createDepartment();
        }
       
    })
};

function displayStock()  {
    connection.query("SELECT * FROM departments", function(err,result)  {
        if(err)  throw err;
            var data = result
            
            var t = new Table
 
            data.forEach(function(product) {
            t.cell('Department Name', product.dpt_name)
            t.cell('Department Cost', product.dpt_cost)
            t.cell('Department Sales', product.dpt_sales)
            t.cell('Profit',product.dpt_sales - product.dpt_cost)
            t.newRow()
            })
            
            console.log(t.toString())
        
            connection.end();
    })
}

function createDepartment()  {
    inquire.prompt([
        {
            type: "input",
            name: 'name',
            message: "Department Name"
        },  {
            type: "input",
            name: 'cost',
            message: "Department Cost"
        },  {
            type: "input",
            name: 'sales',
            message: "Department Sales"
        }
    ]).then(function(post)  {
        
        connection.query("INSERT INTO departments SET ?",
            {
                dpt_name: post.name,
                dpt_cost: post.cost,
                dpt_sales: post.sales
            }, function(err,res)  {
                if(err) throw err;
                displayStock();
            })
    })
}

