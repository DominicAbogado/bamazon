var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "zombies23",
  database: "bamazon",
  multipleStatements: true
});

connection.connect(function(err) {
  if (err) {
    connection.end();
    throw err;
  }
  console.log("Welcome to my store!");
  start();
  //   showlist();
  // goShopping();
  // connection.end();
});

var start = function() {
  inquirer
    .prompt({
      name: "buyStuff",
      type: "rawlist",
      message: "What would you like to do?",
      choices: ["See items", "Leave Store"]
    })
    .then(function(answer) {
      if (answer.buyStuff == "See items") {
        seeItems();
        // postAuction();
      } else {
        console.log("Thank you for coming in. I hope Thanos doesn't snap you!");
        connection.end();
        // bidAuction()
      }
    });
};

var seeItems = function() {
  connection.query("SELECT * FROM products", function(err, store) {
    if (err) {
      connection.end();
    }
    for (var i = 0, x = store.length; i<x; i++){
    console.log("Product ID: " + store[i].id + " | Product: " + store[i].product_name +
        " | Price: " +
        store[i].price
    );
  };
    inquirer.prompt({
        name: "choice",
        type: "rawlist",
        choices: function(value) {
          var choiceArray = [];
          for (var i = 0; i < store.length; i++) {
            choiceArray.push(store[i].product_name);
          }
          return choiceArray;
        },
        mesage: "What would you like to buy?"
      })
      .then(function(answer) {
        for (var i=0; i<store.length;i++){
          if(store[i].product_name == answer.choice){
            var chosenItem = store[i];
            inquirer.prompt({
              name:"howMuch",
              type:"input",
              message:"How many would you like to buy?",
              validate: function(value){
                if(isNaN(value)== false){
                  return true
                } else {
                  return false;
                }
              }
            }).then(function(answer){
              if(chosenItem.stock_quantity >= parseInt(answer.howMuch)){
                var totalCost = parseInt(answer.howMuch)*chosenItem.price;
                console.log("You have purchased " + chosenItem.product_name);
                console.log("That will cost: $" + totalCost );
                connection.query("UPDATE products SET ? WHERE ?",
              [
                {stock_quantity:chosenItem.stock_quantity - answer.howMuch},
                {id:chosenItem.id}
              ]);
              console.log("Thank you for shopping with us. How else can we help you?");
              start();
              } else {
                console.log("You're buying too much, please lower your amount!");
                start();
              }
            })
          }
        }
      });
  });
};
