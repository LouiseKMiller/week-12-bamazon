// Week 12 Homework: Node.js & MySQL
// Bamazon marketplace
// UT Bootcamp - Louise K Miller
// For Bamazon Manager
//
//load dependents
var mysql = require('mysql');
var inquirer = require('inquirer');

// set variable for mysql database connection
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "",
	database: "bamazondb"
});

// add prototype to String object to add left padding
// so table is formatted correctly in console
String.prototype.paddingLeft = function (paddingValue) {
	return String(paddingValue + this).slice(-paddingValue.length);
};


connection.connect(function(err){
	if (err) {
		console.log('error connecting: ' + err.stack);
		return;
	};
	console.log("");
	console.log("        WELCOME TO BAMAZON MANAGER CONSOLE!!  ");
	start();
})

var showInventory = function(){
	connection.query('SELECT * FROM products',
	function(err, res) {
		if (err) {
			console.log('error on query: ' + err.stack);
			return;
		}
     	console.log("----------------------------------------------");
     	console.log("|  ID  |  Product Name  |  Price  | Quantity |");
     	console.log("----------------------------------------------");
   		for (var i = 0; i < res.length; i++) {
   			var idPadded = res[i].id.toString().paddingLeft("    ");
   			var namePadded = res[i].ProductName.paddingLeft("              ");
   			var pricePadded = ("$" + res[i].Price.toFixed(2)).toString().paddingLeft("       ");
        	console.log("| " + idPadded + " | " + namePadded + " | " + pricePadded + " | ");
    	}
    	console.log("-----------------------------------");
    	start();
  	});

}


function start() {
    inquirer.prompt({
        name: "option",
        type: "list",
        message: "Choose an option",
        choices: ["View Products For Sale", "View Low Inventory", "Add To Inventory", "Add New Product", "Exit"]
    }).then(function(answer) {

        switch(answer.option) {
        	case "View Products For Sale":
        		console.log("");
        		showInventory();
        		break;
    		case "View Low Inventory":
    			console.log("View Low Inventory");
    			break;
			case "Add To Inventory":
				console.log("add");
				break;
			case "Add New Product":
				console.log("product");
				break;
			case "Exit":
				console.log("exit");
				break;
			default:
				console.log("default error");
		};

	});
};





