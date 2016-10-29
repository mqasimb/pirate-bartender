var preferences = {};

var Pantry = function(pantry) {
    this.pantry = pantry;
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

var questions = [new Question("Do ye like yer drinks strong?", "strong"),
                 new Question("Do ye like it with a salty tang?", "salty"),
                 new Question("Are ye a lubber who likes it bitter?", "bitter"),
                 new Question("Would ye like a bit of sweetness with yer poison?", "sweet"),
                 new Question("Are ye one for a fruity finish?", "fruity")];

var ingredients = [new Ingredient("Glug of rum", "strong", 10), new Ingredient("slug of whisky", "strong", 10), new Ingredient("splash of gin", "strong", 10), new Ingredient("Olive on a stick", "salty", 10),new Ingredient("salt-dusted rim", "salty", 10), new Ingredient("rasher of bacon", "salty", 10), new Ingredient("Shake of bitters", "bitter", 10), new Ingredient("splash of tonic", "bitter", 10), new Ingredient("twist of lemon peel", "bitter", 10), new Ingredient("Sugar cube","sweet", 10), new Ingredient("spoonful of honey", "sweet", 10), new Ingredient("splash of cola", "sweet", 10), new Ingredient("Slice of orange", "fruity", 10), new Ingredient("dash of cassis", "fruity", 10), new Ingredient("cherry on top", "fruity", 10)];

var pantry = new Pantry(ingredients);

$(document).ready(function() {
    var questionHTML = "";
    for(var i=0;i<questions.length;i++) {
        questionHTML += "<p>"+questions[i].question+"</p>";
        questionHTML += '<label>Yes<input type="radio" name="'+questions[i].category+'" value="Yes" required></label>'+'<label>No<input type="radio" name="'+questions[i].category+'" value="No" required></label><br>';
    }
        questionHTML += "<button>Submit</button>";
        $("form").html(questionHTML);
    
    $("form").submit(function(event) {
        event.preventDefault();
        for(var i=0; i < $($("input:checked")).length; i++) {
            preferences[questions[i].category] = $($("input:checked")[i]).val();
        }
    });
});