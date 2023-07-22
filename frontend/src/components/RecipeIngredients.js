import React from "react";

const RecipeIngredients = ({ ingredients }) => {
  return (
    <>
      {ingredients.map((ingredient, index) => (
        <div className="recipe__ingredient" key={index}>
          <span className="recipe_ingredient-span">
            {ingredient.quantity ? (
              <span className="recipe__quantity">{ingredient.quantity}</span>
            ) : null}
              {ingredient.unit ? (
                <span className="recipe__unit">{ingredient.unit}</span>
              ) : (
                ""
              )}
              <span>
                {ingredient.name}
              </span>
          </span>
        </div>
      ))}
    </>
  );
};

export default RecipeIngredients;
