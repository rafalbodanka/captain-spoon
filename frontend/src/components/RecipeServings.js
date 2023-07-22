const RecipeServings = ({ recipeDetails, setRecipeDetails }) => {

    const updateServings = (number) => {
        if ((Number(recipeDetails.servings) <= 1 && number === -1) || (recipeDetails.servings >= 50 && number === 1)) return
        setRecipeDetails((prevDetails) => {
            //update servings
            const prevServings = prevDetails.servings
            const updatedServings = prevServings + number

            //update ingredients
            const updatedIngredients = prevDetails.ingredients.map((ing)=> {
                if (!ing.quantity) return ing;
                const adjustedQuantity = ing.scalingOffset * updatedServings;
                return { ...ing, quantity: adjustedQuantity};
            })
            return {...prevDetails, servings:updatedServings, ingredients: updatedIngredients}
            })
        // recipeDetails.servings = recipeDetails.servings + number
        // console.log(recipeDetails.servings)
        // const adjustedIngredients = recipeDetails.ingredients.map((ing) => {
        //   if (!ing.quantity) return ing;
      
        //   const scalingOffset = parseFloat(ing.scalingOffset);
        //   const adjustedQuantity = scalingOffset * Number(recipeDetails.servings);
      
        //   return { ...ing, quantity: adjustedQuantity.toString() };
        // });
      
        // recipeDetails.ingredients = adjustedIngredients;
      }

    return (
        <div className="recipe__info">
            <div className="recipe__info-servings">
                <button className="recipe__info-servings-btn" onClick={() => {updateServings(-1)}}>-</button>
                <span className="recipe__info-data recipe__info-data--people">
                {recipeDetails.servings}
                </span>
                <button className="recipe__info-servings-btn" onClick={() => {updateServings(1)}}>+</button>
            </div>
            <span className="recipe__info-text">servings</span>
        </div>
    )
}

export default RecipeServings