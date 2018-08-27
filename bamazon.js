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

function showInventory (){
    connection.query("SELECT * FROM products", function(err, res){
        console.table(res);
    })
    inquire.prompt()
}

showInventory();