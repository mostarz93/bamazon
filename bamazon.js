var mysql = require("mysql");
var inquire = require("inquirer");
var cTable = require("console.table");

var connection = mysql.createConnection({
    host: "localhost",

    port: 8889,

    user: "root",

    password: "root",
    database: "bamazon_db",
    
});

connection.connect(function(err){
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
     
});

var item;
var quanity;
var i;

function askCustomer (){
      inquire.prompt([
        {
        type: "input",
        message: "What you want? (give product ID)",
        name: "itemChoice"
        },
        {
        type: "input",
        message: "how much? (enter a number)",
        name: "itemQuanity"
        }
    ]).then (function(res){
        item = parseInt(res.itemChoice);
        quanity = parseInt(res.itemQuanity);
        i = item - 1;
        displayChoice(i);
       
      
        
    })
}

function showInventory (){
    connection.query("SELECT * FROM products", function(err, res){
    console.table(res);
    askCustomer();
    })
}

function displayChoice (i){
    connection.query("SELECT * FROM products", function(err, res){
        if (err) throw err;
        stockQuantity = res[i].stock_quantity;
        productPrice = res[i].price;
        
        console.log("\nitem selected: " + res[i].product_name + "\nquanity: " + quanity);
        console.log("Stock: " + stockQuantity + '\n');
        if (quanity > stockQuantity) {
            console.log("sorry, don't have that many");
        } else if (quanity <= stockQuantity){
            connection.query("UPDATE products SET stock_quantity = ?, product_sales = product_sales + ? WHERE id = ?", [stockQuantity - quanity, productPrice * quanity, item],  function(){
                    console.log("new " + res[i].product_name + " quantity: " + (stockQuantity - quanity));
                    showInventory();
                    console.log("you spent $" + quanity * res[i].price + '\n')
            })

        }
        
    }
    )}

showInventory();

