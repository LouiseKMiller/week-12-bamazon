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

function displayTable(tableData){
 	console.log("----------------------------------------------");
 	console.log("|  ID  |  Product Name  |  Price  | Quantity |");
 	console.log("----------------------------------------------");
		for (var i = 0; i < tableData.length; i++) {
			var idPadded = tableData[i].id.toString().paddingLeft("    ");
			var namePadded = tableData[i].ProductName.paddingLeft("              ");
			var pricePadded = ("$" + tableData[i].Price.toFixed(2)).toString().paddingLeft("       ");
			var qtyPadded = tableData[i].StockQuantity.toString().paddingLeft("        ");
    	console.log("| " + idPadded + " | " + namePadded + " | " + pricePadded + " | " + qtyPadded + " |");
	}
	console.log("----------------------------------------------");
}


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
     	displayTable(res);
    	start();
  	});

}

var showLowInventory = function(){
	connection.query('SELECT * FROM products WHERE StockQuantity < 5',
	function(err, res) {
		if (err) {
			console.log('error on query: ' + err.stack);
			return;
		}
     	displayTable(res);
    	start();
  	});
}

var addQuantity = function() {
    inquirer.prompt([{
        name: "productID",
        type: "input",
        message: "Please enter the product ID"
    }, {
        name: "quantity",
        type: "input",
        message: "Please enter the amount to add",
        validate: function(value) {
            if (isNaN(value) == false) {
                return true;
            } else {
                return false;
            }
        }
    }]).then(function(answer) {
    	connection.query('SELECT StockQuantity FROM Products WHERE id = ' +answer.productID, function(err, res) {
    			var newQty = parseInt(res[0].StockQuantity) + parseInt(answer.quantity);

		 		connection.query("UPDATE Products SET ? WHERE ?", [{
            		StockQuantity: newQty
            		}, {
            		id: answer.productID
        			}], function(err, res) {
            			console.log("Your item was successfully updated!");
            			start();
            		});
        	});
    });
}

var addItem = function() {
    inquirer.prompt([{
        name: "product",
        type: "input",
        message: "Please enter the product name"
    }, {
        name: "department",
        type: "input",
        message: "Please enter the department name"
    }, {
        name: "price",
        type: "input",
        message: "Please enter the per item price",
        validate: function(value) {
            if (isNaN(value) == false) {
                return true;
            } else {
                return false;
            }
        }
    },{
        name: "quantity",
        type: "input",
        message: "Please enter the quantity",
        validate: function(value) {
            if (isNaN(value) == false) {
                return true;
            } else {
                return false;
            }
        }
    }]).then(function(answer) {
        connection.query("INSERT INTO Products SET ?", {
            ProductName: answer.product,
            DepartmentName: answer.department,
            Price: answer.price,
            StockQuantity: answer.quantity
        }, function(err, res) {
            console.log("Your item was added successfully!");
            start();
        });
    })
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
    			console.log("");
	    		showLowInventory();
    			break;
			case "Add To Inventory":
				console.log("");
				addQuantity();
				break;
			case "Add New Product":
				console.log("");
				addItem();
				break;
			case "Exit":
				console.log("exit");
				break;
			default:
				console.log("default error");
		};

	});
};





