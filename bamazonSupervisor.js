var inquire = require("inquirer");
var mysql = require("mysql");
var cTable = require("console.table");

var connection = mysql.createConnection({
    host: "localhost",

    port: 8889,

    user: "root",

    password: "root",
    database: "bamazon_db",

});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);

});


function showInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        console.log("==========================================================\n");
        console.table(res);
        console.log("\n=========================================================")
        promptSupervisor();
    })
}

function promptSupervisor () {
    inquire.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: ["View Product Sales by Department", "Create New Department", "Remove Department", "Quit"],
            name:"choices"
        }
    ]).then(function(val){
        console.log(val.choices);
        if (val.choices === "View Product Sales by Department") {
            viewSales();
          }
          else if (val.choices === "Create New Department") {
            addDepartment();
          } else if(val.choices === "Remove Department"){
            showDepartments();
            removeDepartment();
          }
          else {
            console.log("Goodbye!");
            process.exit(0);
          }
    })
}

function viewSales() {
    // Selects a few columns from the departments table, calculates a total_profit column
    connection.query(
      "SELECT departProd.department_id, departProd.department_name, departProd.over_head_costs, SUM(departProd.product_sales) as product_sales, (SUM(departProd.product_sales) - departProd.over_head_costs) as total_profit FROM (SELECT departments.department_id, departments.department_name, departments.over_head_costs, IFNULL(products.product_sales, 0) as product_sales FROM products RIGHT JOIN departments ON products.department_name = departments.department_name) as departProd GROUP BY department_id",
      function(err, res) {
        console.table(res);
        promptSupervisor();
      }
    );
  }

function showDepartments (){
  connection.query("SELECT * FROM departments", function (err, res) {
    console.log("\n==========================================================\n");
    console.table(res);
    console.log("\n=========================================================")
})}

function removeDepartment(){
  
  inquire.prompt([
    
    {
      type: "input",
      message: "what department would you like to remove? (enter ID number)",
      name: "departmentChoice"
    }
   
  ]).then(function(res){
    
    connection.query("DELETE FROM departments WHERE department_id = ?", res.departmentChoice, function(){
      console.log ("DEPARTMENT DELETED");
      showDepartments();
      promptSupervisor();
    })
  })
 
}

function addDepartment(){
    inquire
    .prompt([
      {
        type: "input",
        name: "name",
        message: "What is the name of the department?"
      },
      {
        type: "input",
        name: "overhead",
        message: "What is the overhead cost of the department?",
        validate: function(val) {
          return val > 0;
        }
      }
    ])
    .then(function(val) {
      // Using the information the user provided to create a new department
      connection.query(
        "INSERT INTO departments (department_name, over_head_costs) VALUES (?, ?)",
        [val.name, val.overhead],
        function(err) {
          if (err) throw err;
          // If successful, alert the user, run makeTable again
          console.log("ADDED DEPARTMENT!");
          showInventory();
        }
      );
    });

}

showInventory();