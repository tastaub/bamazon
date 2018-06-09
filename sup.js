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
            choices: ["Display Inventory", "Add Department", "EXIT"],
            message: "Action"

        }
    ]).then((res) =>  {
        switch(res.supervisor) {
            case "Display Inventory":
                return updateCost().then(updateDpt).then(displayStock).then(superPrompt)
                break;
            case "Add Department":
                return createDepartment()
                break;
            case "EXIT":
                return connection.end()
                break;

        }
    })
};

function updateCost()  {
    return new Promise((resolve,reject) =>  {
        connection.query("SELECT * FROM products", function(err,res)  {
            if(err) reject(err);
            var data = [];
            res.forEach((prod) => {
                var overhead = prod.quanity * prod.prod_cost;
                var costData = {
                    cost: overhead,
                    dpt: prod.department_name,
                }
                data.push(costData);
            })
            resolve(data);
        })
    })
}

function updateDpt(data)  {


    data.forEach(function(prods)  {
    return new Promise((resolve,reject) =>  {
            connection.query("UPDATE departments SET ? WHERE ?",[
                {
                    dpt_cost: prods.cost
                },  {
                    dpt_name: prods.dpt
                }
            ], function(err,res)  {
                if(err) reject(err);
                resolve(prods);
            })    
    })
    })
}
function displayStock() {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM departments", function(err, data) {
      if(err) reject(err);
      var t = new Table();

      data.forEach(function(product) {
        var profit = product.dpt_sales - product.dpt_cost;
        var p = profit.toFixed(2);
        
        t.cell("Department Name", product.dpt_name);
        t.cell("Department Cost", `$${product.dpt_cost.toFixed(2)}`);
        t.cell("Department Sales", `$${product.dpt_sales.toFixed(2)}`);
        t.cell("Profit", `$${p}`);
        t.newRow();
      });
      resolve(data);
      console.log(t.toString());
    });
  });
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
    ]).then(insertDpt).then(displayStock).then(superPrompt);
}

function insertDpt(post)  {
    return new Promise((resolve,reject) =>  {
                
        connection.query("INSERT INTO departments SET ?",
            {
                dpt_name: post.name,
                dpt_cost: post.cost,
                dpt_sales: post.sales
            }, function(err,res)  {
                if(err) resolve(err) 
                resolve(res);
                
            })
    })
}

