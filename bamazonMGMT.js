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

function mgmtChoices() {
    inquire.prompt([
        {
            type: "list",
            message: "what would you like to do?",
            choices: ["view inventory", "view low inventory", "add to inventory", "add product"],
            name: "mgmtChoices"
        }
    ]).then(function (res) {
        switch (res.mgmtChoices) {
            case "view inventory":
                showInventory();
                break;
            case "view low inventory":
                showLowInventory();
                break;
            case "add to inventory":
                connection.query("SELECT * FROM products", function (err, data) {
                    console.log("\n==========================================================\n");
                    console.table(data);
                    console.log("\n=========================================================")
                    
                    inquire.prompt([
                        {
                            type: "input",
                            message: "what item would you like to restock? (choose ID #)",
                            name: "productID"
                        },
                        {
                            type: "input",
                            message: "how much would you like to restock?",
                            name: "restockCount"
                        }
                    ]).then(function (response) {
                        // console.log("working");
                        // console.log(response.productID);
                        // console.log(response.restockCount);
                        var newStock = parseInt(response.restockCount) + data[parseInt(response.productID) - 1].stock_quantity;
                        addToInventory(newStock, response.productID);
                    });
                });
                break;
            case "add product":
                inquire.prompt([
                    {
                        type: "input",
                        message: "what is the name of the product?",
                        name: "productName"
                    },
                    {
                        type: "input",
                        message: "what department?",
                        name: "productDept"
                    },
                    {
                        type: "input",
                        message: "what price?",
                        name: "productPrice"
                    },
                    {
                        type: "input",
                        message: "how much would you like to stock?",
                        name: "productStock"
                    }
                ]).then(function (res) {
                    connection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)", [res.productName, res.productDept, res.productPrice, res.productStock], function () {
                        showInventory();
                    })
                })
                break;
        }
    });
}


function showInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        console.log("==========================================================\n");
        console.table(res);
        console.log("\n=========================================================")
        mgmtChoices();
    })
}

function showLowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 6", function (err, res) {
        console.table(res);
        mgmtChoices();
    })

}

function addToInventory(quantity, id) {
    connection.query("UPDATE products SET stock_quantity = ? WHERE id = ?", [quantity, id], function () {
        showInventory();

    })
}

mgmtChoices();


