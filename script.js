/*
Mapping from MealDB Categories to TheCocktailDB drink ingredient
You can customize or expand this object to suit your needs.
*/
const mealCategoryToCocktailIngredient = {
  Beef: "whiskey",
  Chicken: "gin",
  Dessert: "amaretto",
  Lamb: "vodka",
  Miscellaneous: "vodka",
  Pasta: "tequila",
  Pork: "tequila",
  Seafood: "rum",
  Side: "brandy",
  Starter: "rum",
  Vegetarian: "gin",
  Breakfast: "vodka",
  Goat: "whiskey",
  Vegan: "rum",
  // Add more if needed; otherwise default to something like 'cola'
};

/*
    2) Main Initialization Function
       Called on page load to start all the requests:
       - Fetch random meal
       - Display meal
       - Map meal category to spirit
       - Fetch matching (or random) cocktail
       - Display cocktail
*/
function init() {
  fetchRandomMeal()
    .then((meal) => {
      displayMealData(meal);
      const spirit = mapMealCategoryToDrinkIngredient(meal.strCategory);
      return fetchCocktailByDrinkIngredient(spirit);
    })
    .then((cocktail) => {
      displayCocktailData(cocktail);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

/*
 Fetch a Random Meal from TheMealDB
 Returns a Promise that resolves with the meal object
 */
function fetchRandomMeal() {
    const url="https://www.themealdb.com/api/json/v1/1/random.php";
    return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log("Data:", data);
      return data.meals[0];
    }
  )}

/*
Display Meal Data in the DOM
Receives a meal object with fields like:
  strMeal, strMealThumb, strCategory, strInstructions,
  strIngredientX, strMeasureX, etc.
*/
function displayMealData(meal) {
  const mealContainer = document.getElementById("meal-container");

  const mealName = meal.strMeal;
  const mealThumb = meal.strMealThumb;
  const mealCategory = meal.strCategory;
  const mealInstructions = meal.strInstructions;


  let ingredientsList = "";
  for (let i = 1; i <= 20; i++) {
    let ingredient = meal["strIngredient"+i];
    let measure = meal["strMeasure"+i];
    if (ingredient) {
      ingredientsList += "<li>" + (measure ? measure : "") + "" + ingredient + "</li>";
    }
  }

  mealContainer.innerHTML =
    "<h2>" + mealName + "</h2>" +
    "<img src='" + mealThumb + "' alt='" + mealName + "' width='300'>" +
    "<p><strong>Category:</strong> " + mealCategory + "</p>" +
    "<h3>Ingredients:</h3>" +
    "<ul>" + ingredientsList + "</ul>" +
    "<h3>Instructions:</h3>" +
    "<p>" + mealInstructions + "</p>";
}
/*
Convert MealDB Category to a TheCocktailDB Spirit
Looks up category in our map, or defaults to 'cola'
*/
function mapMealCategoryToDrinkIngredient(category) {
  if (!category) return "cola";
  return mealCategoryToCocktailIngredient[category] || "cola";
}

/*
Fetch a Cocktail Using a Spirit from TheCocktailDB
Returns Promise that resolves to cocktail object
We call https://www.thecocktaildb.com/api/json/v1/1/search.php?s=DRINK_INGREDIENT to get a list of cocktails
Don't forget encodeURIComponent()
If no cocktails found, fetch random
*/
function fetchCocktailByDrinkIngredient(drinkIngredient) {
  const url = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" + encodeURIComponent(drinkIngredient);
  return fetch(url)
  .then ((response) => response.json())
  .then ((data) => {
    if (data.drinks) {
      return data.drinks[0];
    } else {
      return fetchRandomCocktail().then((randomDrink) => randomDrink);
    }
  })
}

/*
Fetch a Random Cocktail (backup in case nothing is found by the search)
Returns a Promise that resolves to cocktail object
*/
function fetchRandomCocktail() {
  return fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php")
  .then((response) => response.json())
  .then((data) => data.drinks[0]);
}

/*
Display Cocktail Data in the DOM
*/
function displayCocktailData(cocktail) { 

  const cocktailContainer = document.getElementById("cocktail-container");

  const cocktailName = cocktail.strDrink;
  const cocktailThumb = cocktail.strDrinkThumb;
  const cocktailInstructions = cocktail.strInstructions;

  let ingredientsList = "";
  for (let i = 1; i <= 15; i++) {
    const ingredient = cocktail["strIngredient" + i];
    const measure = cocktail["strMeasure" + i];
    if (ingredient && ingredient.trim() !== "") {
      ingredientsList += `<li>${measure || ""} ${ingredient}</li>`;
    }
    
}  

cocktailContainer.innerHTML = `
<h2>${cocktailName}</h2>
<img src="${cocktailThumb}" alt="${cocktailName}" width="300">
<h3>Ingredients:</h3>
<ul>${ingredientsList}</ul>
<h3>Instructions:</h3>
<p>${cocktailInstructions}</p>
`;
}

/*
Call init() when the page loads
*/
window.onload = init;
