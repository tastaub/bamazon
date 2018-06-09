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
  managerTask();
});

var mgrPrompt = [
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
]

function managerTask() {
  inquire.prompt(mgrPrompt).then(function(task) {
      switch(task.mgrTask)  {
        case "View Items": return getProd().then(managerTask);
          break;
        case "View Low Inventory": return getLow().then(displayInventory);
          break;
        case "Add To Inventory": return getProd().then(addAsk);
          break;
        case "Add Product": return createItem().then(newItem);
          break;
        case "Exit": return connection.end();
      }
    });
}

//SELECT * FROM view products

function getProd() {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) reject(err);
      var t = new Table();

      res.forEach(function(product) {
        t.cell("Item ID", product.id);
        t.cell("Item Name", product.product_name);
        t.cell("Department Name", product.department_name);
        t.cell("Price", `$${product.price.toFixed(2)}`);
        t.cell("Quanity Available", product.quanity);
        t.newRow();
      });
    
      console.log(t.toString());
      resolve(res);
    });
  });
}

function getLow() {
  return new Promise((resolve, reject) => {
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) reject(err);
      let data = [];
      res.forEach(r => {
        if (r.quanity <= 100) {
          data.push(r);
        }
      });
      resolve(data);
    });
  });
}

function displayInventory(update) {
  var t = new Table();

  update.forEach(function(product) {
    t.cell("Item ID", product.id);
    t.cell("Item Name", product.product_name);
    t.cell("Department Name", product.department_name);
    t.cell("Price", `$${product.price.toFixed(2)}`);
    t.cell("Quanity Available", product.quanity);
    t.newRow();
  });

  console.log(t.toString());
  managerTask();
}

var stockPrompt = [
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
]


function addAsk() {
  inquire.prompt(stockPrompt).then(addQuanity).then(updateAdd).then(addDisplay).then(managerTask);
}
//UPDATE SET WHERE id add to
function addQuanity(val) {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM products WHERE id=?",
      [val.prodId],
      function(err, res) {
        if (err) reject(err);
        var add = parseFloat(val.amount) + parseFloat(res[0].quanity);
        let r = res[0];
        var update = {
          product: r.product_name,
          department: r.department_name,
          price: r.price,
          cost: r.cost,
          quanity: add,
          id: val.prodId
        };

        resolve(update);
      }
    );
  });
}

function updateAdd(update) {
  return new Promise((resolve, reject) => {
    connection.query(
      "UPDATE products SET ? WHERE ?",
      [
        {
          quanity: update.quanity
        },
        {
          id: update.id
        }
      ],
      function(err, res) {
        if (err) reject(err);
        resolve(update);
      }
    );
  });
}

function createItem() {
  return new Promise((resolve, reject) => {
    connection.query("SELECT dpt_name FROM departments", function(err, res) {
      if (err) reject(err);
      var departments = [];
      res.forEach(product => {
        departments.push(product.dpt_name);
      });
      resolve(departments);
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
      },  {
        type: "list",
        name: "department",
        choices: stuff,
        message: "Department"
      },  {
        type: "input",
        name: "price",
        message: "Item Price $"
      },  {
        type: "input",
        name: "quanity",
        message: "Receive Quanity"
      },  {
        type: 'input',
        name: 'cost',
        message: 'Item Cost'
      }
    ]
    ).then(updateProd).then(addDisplay).then(managerTask);

}

function updateProd(post) {
  return new Promise((resolve, reject) => {
    connection.query(
      "INSERT INTO products SET ?",
      {
        product_name: post.product,
        department_name: post.department,
        price: post.price,
        quanity: post.quanity,
        product_sales: 0,
        prod_cost: post.cost
      },
      function(err, res) {
        if (err) reject(err);

        resolve(post);
      }
    );
  });
}

function addDisplay(stuff) {
  var t = new Table();
  t.cell("Product Name", stuff.product);
  t.cell("Department", stuff.department);
  t.cell("Price", `$${stuff.price}`);
  t.cell("Quanity", stuff.quanity);
  t.newRow();
  console.log(t.toString());
}
