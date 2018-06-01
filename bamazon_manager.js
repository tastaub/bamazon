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
    managerTask();
  });

function managerTask()  {
    inquire
      .prompt([
        {
          type: "list",
          name: "mgrTask",
          message: "What is your task?",
          choices: [
            "View Items",
            "View Low Inventory",
            "Add To Inventory",
            "Add Product",
            "Exit"
          ]
        }
      ])
      .then(function(task) {
        if (task.mgrTask === "View Low Inventory") {
          lowInventory().then(managerTask);
        } else if (task.mgrTask === "Add To Inventory") {
          displayInventory().then(addAsk);
        } else if (task.mgrTask === "Add Product") {
          createItem().then(newItem);
        } else if (task.mgrTask === "Exit") {
          connection.end();
        } else if (task.mgrTask === "View Items") {
          displayInventory().then(managerTask);
        }
      });
}

//SELECT * FROM view products


function displayInventory() {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) reject(err);

      var data = res;
      var t = new Table();

      data.forEach(function(product) {
        t.cell("Item ID", product.id);
        t.cell("Item Name", product.product_name);
        t.cell("Department Name", product.department_name);
        t.cell("Price $", product.price);
        t.cell("Quanity Available", product.quanity);
        t.newRow();
      });

      console.log(t.toString());
      resolve(res);
    });
  });
}

//VIEW IF below x view low
function lowInventory() {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM products", function(err, lowStock) {
      if (err) reject(err);
      var t = new Table();
      lowStock.forEach(function(product) {
        if (product.quanity <= 100) {
          t.cell("Item", product.product_name);
          t.cell("Quanity", product.quanity);
          t.newRow();
        }
      });
      console.log(t.toString());
      resolve(lowStock);
    });
  });
}

function addAsk()  {
  inquire.prompt([
    {
      type: "input",
      name: "prodId",
      message: "Add to ID#"
    },
    {
      type: "input",
      name: "amount",
      message: "Add Stock"
    }
  ]).then(addQuanity)
}
//UPDATE SET WHERE id add to
function addQuanity(val) {
      return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM products WHERE id=?",[val.prodId], function(err,res) {
            if(err) reject(err);
            var add = parseFloat(val.amount);
            var org = parseFloat(res[0].quanity);
            
          connection.query("UPDATE products SET ? WHERE ?",[
            {
              quanity: add + org
            },  {

              id: val.prodId
            }
          ], function(err,res)  {
            displayInventory().then(mangerTask);
          })
          resolve(res);
          });
          
            
          
        });
}


// INSERT INTO table(x,y,z,a)  VALUES (dd,ee,ss,rr) add product
function newItem(stuff) {
  inquire
    .prompt([
      {
        type: "input",
        name: "product",
        message: "Product Name"
      },
      {
        type: "list",
        name: "department",
        choices: stuff,
        message: "Department"
      },
      {
        type: "input",
        name: "price",
        message: "Item Price $"
      },
      {
        type: "input",
        name: "quanity",
        message: "Receive Quanity"
      }
    ])
    .then(updateProd);
  }


  function updateProd(post)  {
    return new Promise((resolve,reject) =>  {
        connection.query("INSERT INTO products SET ?",
        {
            product_name: post.product,
            department_name: post.department,
            price: post.price,
            quanity: post.quanity
        }, function(err,res)  {
            if(err) reject(err);
            
            displayInventory().then(managerTask);
            resolve(post);
              
          })
      
    })
  }

  function createItem() {
      return new Promise((resolve,reject) =>  {
        connection.query("SELECT dpt_name FROM departments", function(err,res)  {
          if(err) reject(err);
          var departments = [];
          res.forEach((product) => {
            departments.push(product.dpt_name);
          })  
          resolve(departments);
        })
      })
  }

  





