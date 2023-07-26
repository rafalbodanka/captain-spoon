import React, { useState } from "react";
import axios from "axios";

const DeleteRecipe = ({
  currentUser,
  recipeDetails,
  setRecipeDetails,
  recipes,
  setRecipes,
  setRecipeDeleteMessage,
  setIsRecipeDeleteMessageModalOpen,
}) => {
  const [isDeleteRecipeModalOpen, setIsDeleteRecipeModalOpen] = useState(false);

  const openDeleteRecipeModal = () => {
    setIsDeleteRecipeModalOpen(true);
  };

  const closeDeleteRecipeModal = () => {
    setIsDeleteRecipeModalOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    axios
      .delete(`http://localhost:8000/recipes/${recipeDetails.id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setRecipeDeleteMessage("Recipe deleted successfully!");
        setIsRecipeDeleteMessageModalOpen(true);
        updateRecipes();
        setRecipeDetails("");
      })
      .catch((error) => {
        setRecipeDeleteMessage(`Something went wrong, try again! ${error}`);
        setIsRecipeDeleteMessageModalOpen(true);
      });
  };

  const updateRecipes = () => {
    const updatedRecipes = recipes.filter(
      (recipe) => recipe.id !== recipeDetails.id
    );
    setRecipes(updatedRecipes);
  };

  return (
    <>
      {recipeDetails.creator === currentUser && (
        <div className="delete_recipe-btn" onClick={openDeleteRecipeModal}>
          Delete
        </div>
      )}
      {isDeleteRecipeModalOpen && (
        <div
          className="delete_recipe-modal-overlay"
          onClick={closeDeleteRecipeModal}
        >
          <div className="delete_recipe-modal">
            <div className="delete_recipe-message">
              Do you want to delete that recipe?
            </div>
            <button className="submit_btn" type="submit" onClick={handleSubmit}>
              Delete Recipe
            </button>
            <button className="cancel_btn" onClick={closeDeleteRecipeModal}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteRecipe;
