var preferences = {};
var customerPreferences = {};
var drinks = [];
var customers = [];
var currentCustomer;
var isCustomer = false;
var state = {
    drinkNumber: 0,
    yesCount: 0
};
var pirateDrinkNames = ["Blackbeard's Ghost", "Buried Treasure", "Captain's Booty", "Captain's First Mate", "Captain's Parrot", "Captain's Table", "Captain Cook", "Captain Jack Sparrow", "Captains Treasure", "Confederate Pirate", "Deep Blue Sea", "Dirty Pirate Hooker", "English Pirate", "French Pirate", "French Pirate In A Thong", "Fuka", "Fuzzy Buccaneer", "Fuzzy Pirate", "Gale At Sea", "Gay Pirate", "Irish Pirate", "Navy Grog", "Old Pirate", "Peachy Pirate", "Pirate's Blood", "Pirate's Coffee", "Pirate's Cordial", "Pirate's Eye", "Pirate's Treasure", "Pirate's Treasure #2", "Pirate Booty", "Pirate Float", "Pirate Margarita", "Pirate Of The Caribbean", "Pirate Ship Bomb", "Pirates Of The Caribbean", "Poker Pirate", "Rattling Skulls And Bones", "Salty Dog", "Salty Dog #2", "Salty Sea Dog", "Scurvy Sailor", "Sea Witch", "Shipwreck", "Skinny Pirate", "Swann Song", "The Stinky Pirate", "Treasure Hunt", "Tropical Sea Breeze", "Whaler on the Moon", "White Pirate", "Wooden Leg", "Wooden Leg #2"]
var restock = [];
//False if needs restocking
var restockBool = true;

var Pantry = function(type) {
    this.type = type;
};
var Question = function(question, category) {
    this.question = question;
    this.category = category;
};

var Ingredient = function(ingredient, category, stockValue) {
    this.ingredient = ingredient;
    this.category = category;
    this.stockValue = stockValue;
};

var Drink = function(drink, name) {
    this.drink = drink;
    this.name = name;
};

var Bartender = function(bartender) {
    this.bartender = bartender;
};

var Customer = function(name, preferences) {
    this.name = name;
    this.preferences = preferences;
};

Bartender.prototype.createDrink = function() {
    var tempPreferences;
    if (isCustomer) {
        tempPreferences = customerPreferences;
    } else {
        tempPreferences = preferences;
    }
    var drinksIngredients = [];
    var drinkName = [];
    for (var key in tempPreferences) {
        if (tempPreferences[key] === "Yes") {
            drinkName.push(key);
            for (var i = 0; i < pantry.type.length; i++) {
                if (pantry.type[i].category === key) {
                    var randomizeIngredient = Math.floor((Math.random() * 3));
                    if (randomizeIngredient && (pantry.type[i].stockValue > 0)) {
                        drinksIngredients.push(pantry.type[i].ingredient);
                        pantry.type[i].stockValue--;
                        if (pantry.type[i].stockValue === 0) {
                            restock.push({
                                index: i,
                                ingredient: pantry.type[i].ingredient,
                                restock: true
                            });
                            displayRestockItems();
                        }
                        else {
                            $(".restock").css("visibility","hidden");
                        }
                    }
                }
            }
        }
    }
    if(drinksIngredients.length > 0) {
        restockBool = true;
        var randomNameIndex = Math.floor((Math.random() * drinkName.length-1) + 1);
        var randomPirateIndex = Math.floor((Math.random() * pirateDrinkNames.length-1) + 1);
        drinks.push(new Drink(drinksIngredients, drinkName[randomNameIndex]+" "+pirateDrinkNames[randomPirateIndex]));
    }
    else {
        restockBool = false;
    }
};

var bartender = new Bartender("bartender");

//Questions
var questions = [new Question("Do ye like yer drinks strong?", "strong"),
    new Question("Do ye like it with a salty tang?", "salty"),
    new Question("Are ye a lubber who likes it bitter?", "bitter"),
    new Question("Would ye like a bit of sweetness with yer poison?", "sweet"),
    new Question("Are ye one for a fruity finish?", "fruity")
];

var ingredients = [new Ingredient("Glug of rum", "strong", 10), new Ingredient("slug of whisky", "strong", 10), new Ingredient("splash of gin", "strong", 10), new Ingredient("Olive on a stick", "salty", 10), new Ingredient("salt-dusted rim", "salty", 10), new Ingredient("rasher of bacon", "salty", 10), new Ingredient("Shake of bitters", "bitter", 10), new Ingredient("splash of tonic", "bitter", 10), new Ingredient("twist of lemon peel", "bitter", 10), new Ingredient("Sugar cube", "sweet", 10), new Ingredient("spoonful of honey", "sweet", 10), new Ingredient("splash of cola", "sweet", 10), new Ingredient("Slice of orange", "fruity", 10), new Ingredient("dash of cassis", "fruity", 10), new Ingredient("cherry on top", "fruity", 10)];

var pantry = new Pantry(ingredients);

$(document).ready(function() {
    $(".customer-name").submit(function(event) {
        event.preventDefault();
        currentCustomer = $(".customer-name input").val().toLowerCase();
        checkCustomerList();
    });

    $(".preferences").submit(function(event) {
        event.preventDefault();
        for (var i = 0; i < $($(".preferences input:checked")).length; i++) {
            preferences[questions[i].category] = $($(".preferences input:checked")[i]).val();
            if(preferences[questions[i].category] === "Yes") {
                state.yesCount++;
            }
        }
        $(".questions-list").remove();
        printDrink(preferences);
            customers[customers.length - 1].preferences = Object.assign({}, preferences);
    });
    $(".order-drink").click(function(event) {
        $(".results p").remove();
        $(".customer-name").css("visibility", "visible");
        $(".order-drink").css("visibility", "hidden");
    });
    $(".restock").on("click", ".restock-button", function(event) {
        restockIngredients();
    });
});

function printDrink() {
    bartender.createDrink();
    // }
    $(".results form").remove();
    if(state.yesCount > 0 && restockBool) {
    $(".results").html("<p>Thank fer ye answers!</p><p>Here is your drink... " + drinks[state.drinkNumber].name + " it contains " + drinks[state.drinkNumber].drink.toString() + " so ENJOY!</p>");
    state.drinkNumber++;
    }
    else if(!restockBool) {
        $(".results").html("<p>Please restock we out of ingredients</p>");
    }
    else {
    $(".results").html("<p>Thank fer ye answers!</p><p>Sorry but you do not like any drink :(</p>");    
    }
    $(".order-drink").css("visibility", "visible");
}

function checkCustomerList() {
    isCustomer = false;
    for (var i = 0; i < customers.length; i++) {
        if (currentCustomer === customers[i].name) {
            isCustomer = true;
            customerPreferences = customers[i].preferences;
            state.yesCount = 0;
            for(var key in customers[i].preferences) {
                if(customers[i].preferences[key] === "Yes") {
                    state.yesCount++;
                }
            }
            printDrink(customers[i]);
        }
    }
    if (!isCustomer) {
        customers.push(new Customer(currentCustomer));
        $(".preferences").css("visibility", "visible");
        displayQuestions(questions);
    }
    $(".customer-name").css("visibility", "hidden");
}

function displayQuestions(questions) {
    if (!isCustomer) {
        state.yesCount = 0;
        var questionHTML = "<form class='questions-list'>";
        for (var j = 0; j < questions.length; j++) {
            questionHTML += "<p>" + questions[j].question + "</p>";
            questionHTML += '<label>Yes<input type="radio" name="' + questions[j].category + '" value="Yes" required></label>' + '<label>No<input type="radio" name="' + questions[j].category + '" value="No" required></label><br>';
        }
        questionHTML += "<button>Submit</button></form>";
        $(".preferences").html(questionHTML);
    }
}

function displayRestockItems() {
    $(".restock").css("visibility","visible");
    var restockString = "The following Ingredients need to be restocked: ";
    restock.forEach(function(item) {
        restockString += item.ingredient + " ";
    });
    $(".restock").html("<p>"+restockString+"</p><br><button class='restock-button'>Restock Now</button>");
}

function restockIngredients() {
    for(var i=0; i<restock.length; i++) {
        pantry.type[restock[i].index].stockValue = 10;
        restock.shift();
    };
    $(".restock").html("<p>All listed ingredients have been restocked!</p>");
}