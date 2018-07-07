var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "zombies23",
  database: "greatBay_db",
  multipleStatements: true
});

connection.connect(function(err) {
  if (err) {
    connection.end();
    throw err;
  }
  console.log("TEST CONNECTION");
  start();
  //   showlist();
  // goShopping();
  // connection.end();
});

var start = function() {
  inquirer
    .prompt({
      name: "postOrBid",
      type: "rawlist",
      message: "Would you like to [POST] an auction or [BID] on an auction?",
      choices: ["POST", "BID"]
    })
    .then(function(answer) {
      if (answer.postOrBid.toUpperCase() == "POST") {
        postAuction();
      } else {
        bidAuction();
      }
    });
};

var postAuction = function() {
  inquirer
    .prompt([
      {
        name: "item",
        type: "input",
        messsage: "What is the item you wish to submit?"
      },
      {
        name: "category",
        type: "input",
        message: "What category would you like to place it in?"
      },
      {
        name: "startingBid",
        type: "input",
        message: "what would you like the starting bid to be?",
        validate: function(value) {
          if (isNaN(value) == false) {
            return true;
          } else {
            return false;
          }
        }
      }
    ])
    .then(function(answer) {
      connection.query(
        "INSERT INTO auctions_items SET ?",
        {
          item_name: answer.item,
          category: answer.category,
          starting_bid: answer.startingBid,
          highest_bid: answer.startingBid
        },
        function(err, res) {
          console.log("You have added: " + answer.item + " to SQL!");
        }
      );
    });
};

var bidAuction = function() {
  connection.query("SELECT * FROM auctions_items", function(err, res) {
    console.log(res);
    inquirer
      .prompt({
        name: "choice",
        type: "rawlist",
        choices: function(value) {
          var choiceArray = [];
          for (var i = 0; i < res.length; i++) {
            choiceArray.push(res[i].item_name);
          }
          return choiceArray;
        },
        mesage: "What auction would you like to place a bid on?"
      })
      .then(function(answer) {
        for (var i = 0; i < res.length; i++) {
          if (res[i].item_name == answer.choice) {
            var chosenItem = res[i];
            inquirer.prompt({
                name: "bid",
                type: "input",
                message: "How much would you like to bid?",
                validate: function(value) {
                  if (isNaN(value) == false) {
                    return true;
                  } else {
                    return false;
                  }
                }
              })
              .then(function(answer) {
                if (chosenItem.highest_bid < parseInt(answer.bid)) {
                  connection.query(
                    "UPDATE auctions_items SET ? WHERE ?",
                    [
                      {
                        highest_bid: answer.bid
                      },
                      {
                        id: chosenItem.id
                      } 
                    ],
                    function(err, res) {
                      console.log("Bid Successfully Placed!");
                      start();
                    }
                  );
                } else {
                  console.log("your bid was too low. Try again...");
                  start();
                }
              });
          }
        }
      });
  });
};

//   function showlist(){
//       connection.query("SELECT * FROM products", function (err, store){
//           if (err){
//               connection.end();
//               throw err;
//           }
//           for (var i = 0, x = store.length; i<x; i++){
//               console.log("Product ID: " + store[i].id + " | Product: " + store[i].product_name + " | Price: " + store[i].price);
//           }
//       });
//   }

// function goShopping() {
//         inquirer
//           .prompt([
//             {
//               type: "list",
//               message: "What would you like to buy?",
//               choices: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
//               name: "chosen"
//             }
//           ])
//           .then(function(inquirerResponse) {
//             var ir = inquirerResponse;
//             var choice = parseInt(ir.chosen);
//             console.log(ir.chosen);
//             connection.query("SELECT * FROM products", function (err, store){
//                 if (err){
//                     connection.end();
//                     throw err;
//                 }
//                 for (var i = 0, x = store.length; i<x; i++){
//                     if(ir.chosen === store[i].id){
//                         console.log(store[ir.chosen].product_name)
//                     }
//                 }
//             });

//           });
//   }
