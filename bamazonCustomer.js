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
        console.log("It's working I hope");
        seeItems();
        // postAuction();
      } else {
        console.log("Thanks for coming in!");
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
        console.log("working!");
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
                console.log("You have purchased " + chosenItem.product_name)
                console.log("That will cost: $" + totalCost )
                console.log("Thank you for shopping with us. Have a wonderful day!");
                connection.query("UPDATE products SET ? WHERE ?",
              [
                {stock:stock - answer.howMuch},
                {id:chosenItem.id}
              ])
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

//       .then(function(answer) {
//         for (var i = 0; i < res.length; i++) {
//           if (res[i].item_name == answer.choice) {
//             var chosenItem = res[i];
//             inquirer.prompt({
//                 name: "bid",
//                 type: "input",
//                 message: "How much would you like to bid?",
//                 validate: function(value) {
//                   if (isNaN(value) == false) {
//                     return true;
//                   } else {
//                     return false;
//                   }
//                 }
//               })
//               .then(function(answer) {
//                 if (chosenItem.highest_bid < parseInt(answer.bid)) {
//                   connection.query(
//                     "UPDATE auctions_items SET ? WHERE ?",
//                     [
//                       {
//                         highest_bid: answer.bid
//                       },
//                       {
//                         id: chosenItem.id
//                       }
//                     ],
//                     function(err, res) {
//                       console.log("Bid Successfully Placed!");
//                       start();
//                     }
//                   );
//                 } else {
//                   console.log("your bid was too low. Try again...");
//                   start();
//                 }
//               });
//           }
//         }
//       });
//   });
// };

// var postAuction = function(){
//   inquirer.prompt([{
//     name:"item",
//     type:"input",
//     messsage:"What is the item you wish to submit?"
//   },
//   {
//     name:"category",
//     type:"input",
//     message:"What category would you like to place it in?"
//   },
//   {
//     name:"startingBid",
//     type:"input",
//     message:"what would you like the starting bid to be?",
//     validate: function(value){
//       if(isNaN(value)==false){
//         return true;
//       } else{
//         return false;
//       }
//     }
//   }]).then(function(answer){
//     connection.query("INSERT INTO auctions_test SET ?", {
//       item_name: answer.item,
//       category: answer.category,
//       startingbid: answer.startingBid,
//       highestbid:answer.startingBid
//     },function(err,res){
//        console.log("You have added: "+ answer.item + " to SQL!")
//     });
//     });
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
