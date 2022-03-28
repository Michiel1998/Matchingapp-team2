
   
   
let newRandomCocktail = document.querySelector(".generateCocktail");

async function getRandomCocktail() {
  const res = await fetch( "https://www.thecocktaildb.com/api/json/v1/1/random.php");
  const cocktail = await res.json();
  showCocktail(cocktail)
}

//insert random cocktail in text field
function showCocktail(cocktail) {
  let cocktailTextField = document.querySelector(".randomCocktail");

  let cocktailName = cocktail.drinks[0].strDrink;
  cocktailTextField.innerHTML = cocktailName
}