require("dotenv").config();
var mysql = require("mysql");
var inquire = require("inquirer");
var Table = require("easy-table");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  user: "root",

  password: process.env.password,
  database: "bamazon_DB"
});

connection.connect(function(err) {
  if (err) throw err;
  welcome();
});

function welcome() {
  console.log(`
               ____   ___  __   __  ___  _________  __  _ 
              |  _   / _  |  | |  |/  _  ___  / _  |  || |
              | |_) ) |_| |   v   | |_| |  / / | | |  |/ |
              |  _ (|  _  | ||^|| |  _  | / /| | | |     |
              | |_) ) | | | |   | | | | |/ /_| |_| | |_  |
              |____/|_| |_|_|   |_|_| |_/_____)___/|_| |_|  Created By: Thomas Staub
   `);
  inquire
    .prompt([
      {
        type: "input",
        name: "user",
        message: "Enter your name to start an order."
      }
    ])
    .then(selectProd)
    .then(displayStore)
    .then(getItems);
}
function selectProd(real) {
  return new Promise((resolve, reject) => {
    var search = "SELECT * FROM products";
    connection.query(search, function(err, res) {
      if (err) reject(err);
      resolve(res);
    });
  });
}

function displayStore(display) {
  var data = display;
  var t = new Table();

  data.forEach(function(product) {
    t.cell("Item ID", product.id);
    t.cell("Item Name", product.product_name);
    t.cell("Department Name", product.department_name);
    t.cell("Price", product.price);
    t.cell("Quanity Available", product.quanity);
    t.newRow();
  });

  console.log(t.toString());
}

function getItems() {
  inquire
    .prompt([
      {
        type: "input",
        name: "id",
        message: "Enter item ID to purchase"
      },
      {
        type: "submit",
        name: "quanity",
        message: "How many would you like?",
        validate: function(value) {
          var valid = value.match(/^[0-9]+$/);
          if (valid) {
            return true;
          }
          return "Please enter a numerical value";
        }
      }
    ])
    .then(selectUnq)
    .then(checkout)
    .then(selectDpt)
    .then(updateDpt)
    .then(continueShop);
}

function selectUnq(input) {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM products WHERE id=?", [input.id], function(
      err,
      res
    ) {
      if (err) reject(err);
      if (input.quanity > res[0].quanity) {
        console.log("This is too many items");
        welcome();
      } else {
        var update = {
          id: input.id,
          amount: input.quanity,
          name: res[0].product_name,
          total: res[0].product_sales,
          sales: input.quanity * res[0].price,
          quanity: res[0].quanity - input.quanity,
          department: res[0].department_name
        };

        resolve(update);
      }
    });
  });
}

function checkout(update) {
  return new Promise((resolve, reject) => {
    connection.query(
      "UPDATE products SET ? WHERE ?",
      [
        {
          quanity: update.quanity,
          product_sales: update.total + update.sales
        },
        {
          id: update.id
        }
      ],
      function(err, res) {
        if (err) reject(err);
        var sales = update.sales.toFixed(2);
        var t = new Table();

        t.cell("Product", update.name);
        t.cell("Quanity", update.amount);
        t.cell("Total", `$${sales}`);
        t.newRow();
        console.log(t.toString());
        resolve(update);
      }
    );
  });
}

function selectDpt(update) {
  return new Promise((resolve, reject) => {
    var search = "SELECT dpt_sales FROM departments WHERE ?";
    connection.query(
      search,
      [
        {
          dpt_name: update.department
        }
      ],
      function(err, res) {
        if (err) reject(err);
        var total = res[0].dpt_sales + update.sales;
        var stuff = {
          sales: total,
          name: update.department
        };
        resolve(stuff);
      }
    );
  });
}

function updateDpt(update) {
  return new Promise((resolve, reject) => {
    var search = "UPDATE departments SET ? WHERE ?";
    connection.query(
      search,
      [
        {
          dpt_sales: update.sales
        },
        {
          dpt_name: update.name
        }
      ],
      function(err, res) {
        if (err) reject(err);
        resolve(res);
      }
    );
  });
}

function continueShop() {
  inquire
    .prompt([
      {
        type: "confirm",
        name: "continue",
        message: "Continue Shopping?"
      }
    ])
    .then(function(res) {
      if (res.continue === true) {
        welcome();
      } else {
        connection.end();
      }
    });
}
