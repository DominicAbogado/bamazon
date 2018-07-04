var mysql = require("mysql");
var inquirer = require("inquirer")

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "zombies23",
    database: "bamazon",
    multipleStatements: true
  });

  connection.connect(function(err){
      if (err){
          connection.end();
          throw err;
      }
      console.log("Welcome to Bamazon Adventurer!") 
      showlist();
      goShopping();
      connection.end();
  });

  function showlist(){
      connection.query("SELECT * FROM products", function (err, store){
          if (err){
              connection.end();
              throw err;
          }
          for (var i = 0, x = store.length; i<x; i++){
              console.log("Product ID: " + store[i].id + " | Product: " + store[i].product_name+ " | Price: " + store[i].price);
          }
      });
  }

function goShopping(){
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to buy?",
            choices: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
            name: "chosen"
        }
    ]).then(function(inquirerResponse){
        var ir = inquirerResponse;
        var choice = parseInt(ir.chosen)
        console.log(ir.chosen)
    })
}