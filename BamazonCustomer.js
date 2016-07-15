// Week 12 Homework: Node.js & MySQL
// Bamazon marketplace
// UT Bootcamp - Louise K Miller
//
//load dependents
var mysql = require('mysql');
var prompt = require('prompt');

// set up for prompt - user asked for productID and quantity
var schema = {
	properties: {
		productID: {
			description: "Enter the Product ID",
			type: 'integer'
		},
		quantity: {
			description: "Enter the quantity",
			type: 'integer'
		}
	}
};


// add prototype to String object to add left padding
// so table is formatted correctly in console
String.prototype.paddingLeft = function (paddingValue) {
	return String(paddingValue + this).slice(-paddingValue.length);
};

// set variable for mysql database connection
var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "",
	database: "bamazondb"
});

// once user provides order data, this function
// checks database to see if there is sufficient quantity
// if no, order fails
// if yes, database is updated
// either way, you go back to start()
// parameter userInput includes productID and quantity
//
function handleOrder(userInput){
	// check database for quantity and price of requested item
	connection.query('SELECT StockQuantity, Price FROM products WHERE id =' + userInput.productID,
	function(err, res) {
		if (err) {
			console.log('error on query: ' + err.stack);
			return ("error");
		};
		// check if there is sufficient quantity to complete order
		var newQuantity = res[0].StockQuantity - userInput.quantity;
		// if insufficient quantity, no updates to database. user goes back to start
		if (newQuantity <= 0) {
			console.log("Insufficient quantity.  We're sorry - your order failed.");
			console.log("Try again");
			console.log("");
			start();
		} else {
		// if sufficient quantity, update database and inform user of total price
			connection.query("UPDATE Products SET ? WHERE ?", [{
    		StockQuantity: newQuantity
			}, {
    		id: userInput.productID
			}],
			function(err) {
				if (err) throw err;
				var total = userInput.quantity*res[0].Price;
				console.log("Your order has been placed. You have been charged $" + total.toFixed(2));
				console.log("Thank you for shopping for Bamazon!");
				console.log("");
				start();
			});
		}
	});
}

connection.connect(function(err){
	if (err) {
		console.log('error connecting: ' + err.stack);
		return;
	};
	console.log("");
	console.log("        WELCOME TO BAMAZON!!  ");
	start();
})

function start() {
	connection.query('SELECT id, ProductName, Price FROM products WHERE StockQuantity > 0',
	function(err, res) {
		if (err) {
			console.log('error on query: ' + err.stack);
			return;
		}
		console.log(" SHOP FROM THE FOLLOWING PRODUCTS");
		console.log(" ");
     	console.log("-----------------------------------");
     	console.log("|  ID  |  Product Name  |  Price  |");
     	console.log("-----------------------------------");
   		for (var i = 0; i < res.length; i++) {
   			var idPadded = res[i].id.toString().paddingLeft("    ");
   			var namePadded = res[i].ProductName.paddingLeft("              ");
   			var pricePadded = ("$" + res[i].Price.toFixed(2)).toString().paddingLeft("       ");
        	console.log("| " + idPadded + " | " + namePadded + " | " + pricePadded + " | ");
    	}
    	console.log("-----------------------------------");

 		// prompt user for order information
		prompt.start();
		prompt.get(schema, function (err, result){
			if (err) {
				console.log('error in prompt');
			}

			handleOrder(result);
		});
	});
}





