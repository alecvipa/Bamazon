var mysql = require('mysql');
var inquirer = require('inquirer');

var choiceArray;
var sign;

var connection = mysql.createConnection({
    host:'localhost',
    port: 3306,
    user:"root",
    password: "harry potter 8",
    database: "bamazon"
 
});

connection.connect(function(err){
    console.log("conected as id: " + connection.threadId);  
    start();

});

var start = function() {
    connection.query("SELECT * FROM products", function(err,res){
        inquirer.prompt({
            name: "choice",
            type: "rawlist",
            choices: function(value){
                choiceArray = [];
                Firstterm = [];

                for(var i=0; i<res.length;i++) {
                    choiceArray.push(res[i].id +" "+res[i].product_name + " $" + res[i].price);
                    Firstterm.push(res[i].product_name);
                }
                
                return choiceArray;
                
            },
            message: "Which product would you like to buy?"
            

        }).then(function (answer) {

            var includes = answer.choice;
            sign = [];
            // console.log(includes);

            for(var i=0; i<includes.length; i++) {
                sign.push(includes[i]);

                if(includes[i]==" ") {
                    break
                }
            }
            console.log(parseInt(sign.join("")));

            if (includes.includes(answer.choice)) {

                inquirer.prompt({
                    name: "transaction",
                    type: "input",
                    message: "How many items would you like to buy?",
                    validate: function (value) {
                        if (isNaN(value) == false) {
                            return true;
                        } else {
                            return false;
                        }

                    }
                }).then(function (answer) {

                    var quantity = answer.transaction;
                    console.log(parseInt(quantity));
                    var quantity_to_substract = parseInt(quantity)
                    var signn = parseInt(sign.join(""))

                    connection.query(`UPDATE products SET stock_quantity = stock_quantity - ${quantity_to_substract} WHERE id = ${signn}` , function(err,res){
                        if(err){
                            console.log(err);
                        } else {
                            connection.query("SELECT * FROM products", function (err, res) {
                                if(err){
                                    console.log(err);
                                } else {
                                    var id = parseInt(sign.join("")) - 1;
                                    console.log("Items currently in stock: "+ res[id].stock_quantity);
                                }
                            })
                        }
                    });
                });
            };

        });
    });
};