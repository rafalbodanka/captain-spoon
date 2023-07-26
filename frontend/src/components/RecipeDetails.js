import React, { useEffect, useState } from "react";
import RecipeIngredients from "./RecipeIngredients";
import { useLocation } from "react-router-dom";
import { getJSON } from "../helper";
import { API_DETAIL_URL } from "../config";
import iconMenu from "../img/icon_menu.png";
import iconSmile from "../img/icon-smile.png";
import EditRecipe from "./EditRecipe";
import DeleteRecipe from "./DeleteRecipe";

import AddBookmark from "./AddBookmark";
import RecipeServings from "./RecipeServings";
import { colors } from "@mui/material";

const RecipeDetails = ({
  isSmallMobile,
  recipes,
  setRecipes,
  loading,
  recipeDetails,
  setRecipeDetails,
  currentUser,
  bookmarksIdList,
  userBookmarks,
  setUserBookmarks,
  loadingRecipeDetail,
  setLoadingRecipeDetail,
  setSearchQuery,
  setBookmarksIdList,
}) => {
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);

  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    setIsBookmarked(bookmarksIdList.includes(recipeDetails.id));
  }, [recipeDetails]);

  const location = useLocation();
  useEffect(() => {
    // Check if the URL contains a hashtag
    if (location.hash) {
      const id = location.hash.substring(1); // Remove the leading '#'
      handleHashTagLoad(id);
    }
  }, [location]);

  const handleHashTagLoad = async (id) => {
    setLoadingRecipeDetail(true);
    const data = await getJSON(`${API_DETAIL_URL}${id}/`);

    //set scaling offset for every ingredient for changing servings purposes
    const ingredientWithOffset = data.ingredients.map((ingredient) => {
      if (!ingredient.quantity) return ingredient;
      const scalingOffset = ingredient.quantity / data.servings;
      return { ...ingredient, scalingOffset };
    });
    setLoadingRecipeDetail(false);
    setRecipeDetails({ ...data, ingredients: ingredientWithOffset });
  };

  // deleting recipe
  const [recipeDeleteMessage, setRecipeDeleteMessage] = useState("");
  const [isRecipeDeleteMessageModalOpen, setIsRecipeDeleteMessageModalOpen] =
    useState(false);

  const handleRecipeDeleteMessageModalClose = () => {
    setIsRecipeDeleteMessageModalOpen(false);
  };

  if (loading) {
    return (
      <section className="spinner_container">
        <div className="spinner"></div>
      </section>
    );
  }

  if (loadingRecipeDetail) {
    return (
      <section className="spinner_container">
        <div className="spinner"></div>
      </section>
    );
  }

  return recipeDetails ? (
    <>
      <div className="recipe">
        <div className="recipe__control_container">
          <h1>{recipeDetails.title}</h1>
          <div className="recipe__control-btns">
            {isSmallMobile ? (
              recipeDetails.creator === currentUser ? (
                <div>
                  <img
                    src={iconMenu}
                    alt="icons8 icon menu"
                    className="icon_menu"
                    onClick={() => setIsRecipeModalOpen(true)}
                  ></img>
                  {isRecipeModalOpen && (
                    <div
                      className="recipe_modal_overlay"
                      onClick={(event) => {
                        if (event.target === event.currentTarget)
                          setIsRecipeModalOpen(false);
                      }}
                    >
                      <div className="recipe_modal">
                        <EditRecipe
                          recipeDetails={recipeDetails}
                          setRecipeDetails={setRecipeDetails}
                          currentUser={currentUser}
                        ></EditRecipe>
                        <DeleteRecipe
                          currentUser={currentUser}
                          recipeDetails={recipeDetails}
                          setRecipeDetails={setRecipeDetails}
                          recipes={recipes}
                          setRecipes={setRecipes}
                          setRecipeDeleteMessage={setRecipeDeleteMessage}
                          setIsRecipeDeleteMessageModalOpen={
                            setIsRecipeDeleteMessageModalOpen
                          }
                        ></DeleteRecipe>
                        {currentUser && (
                          <AddBookmark
                            isBookmarked={isBookmarked}
                            setIsBookmarked={setIsBookmarked}
                            recipeDetails={recipeDetails}
                            userBookmarks={userBookmarks}
                            setUserBookmarks={setUserBookmarks}
                            recipes={recipes}
                            setRecipes={setRecipes}
                            setBookmarksIdList={setBookmarksIdList}
                          ></AddBookmark>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                currentUser && (
                  <AddBookmark
                    isBookmarked={isBookmarked}
                    setIsBookmarked={setIsBookmarked}
                    recipeDetails={recipeDetails}
                    userBookmarks={userBookmarks}
                    setUserBookmarks={setUserBookmarks}
                    recipes={recipes}
                    setRecipes={setRecipes}
                    setBookmarksIdList={setBookmarksIdList}
                  ></AddBookmark>
                )
              )
            ) : (
              <>
                <EditRecipe
                  recipeDetails={recipeDetails}
                  setRecipeDetails={setRecipeDetails}
                  currentUser={currentUser}
                ></EditRecipe>
                <DeleteRecipe
                  currentUser={currentUser}
                  recipeDetails={recipeDetails}
                  setRecipeDetails={setRecipeDetails}
                  recipes={recipes}
                  setRecipes={setRecipes}
                  setRecipeDeleteMessage={setRecipeDeleteMessage}
                  setIsRecipeDeleteMessageModalOpen={
                    setIsRecipeDeleteMessageModalOpen
                  }
                ></DeleteRecipe>
                <div className="recipe_details_header"></div>
                {currentUser && (
                  <AddBookmark
                    isBookmarked={isBookmarked}
                    setIsBookmarked={setIsBookmarked}
                    recipeDetails={recipeDetails}
                    userBookmarks={userBookmarks}
                    setUserBookmarks={setUserBookmarks}
                    recipes={recipes}
                    setRecipes={setRecipes}
                    setBookmarksIdList={setBookmarksIdList}
                  ></AddBookmark>
                )}
              </>
            )}
          </div>
        </div>
        <figure className="recipe__fig">
          <img
            src={recipeDetails.image_url}
            alt={recipeDetails.title}
            className="recipe__img"
          />
        </figure>
        <div className="recipe__details">
          <div className="recipe__info">
            <span className="recipe__info-data recipe__info-data--minutes">
              {recipeDetails.cooking_time}
            </span>
            <span className="recipe__info-text">minutes</span>
          </div>
          <RecipeServings
            recipeDetails={recipeDetails}
            setRecipeDetails={setRecipeDetails}
          ></RecipeServings>
        </div>
        <div className="recipe__ingredients">
          <h2 className="recipe__heading">Ingredients</h2>
          <div className="recipe__ingredients-container">
            <ul className="recipe__ingredient-list">
              <RecipeIngredients ingredients={recipeDetails.ingredients} />
            </ul>
          </div>
        </div>
        <div className="recipe__directions">
          <h2 className="recipe__heading">How to cook it</h2>
          <p className="recipe__directions-text">
            This recipe was carefully designed and tested by{" "}
            <span className="recipe__publisher">
              <a
                className="recipe__directions-link"
                href={recipeDetails.detail_url}
                target="blank"
              >
                {recipeDetails.publisher}
              </a>
            </span>
            . Please check out directions at their website.
          </p>
        </div>
        <div className="recipe__tags">
          <h2 className="recipe__heading">Tags</h2>
          <div className="recipe__tags-container">
            {recipeDetails.tags.map((tag, index) => {
              return (
                <div
                  className="recipe__tags-tag"
                  key={tag}
                  onClick={() => {
                    setSearchQuery(tag);
                  }}
                >
                  #{tag}{" "}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {isRecipeDeleteMessageModalOpen && (
        <div>
          <div className="upload_result_modal">
            {recipeDeleteMessage}
            <div
              className="close_upload_result_modal_btn"
              onClick={handleRecipeDeleteMessageModalClose}
            >
              OK
            </div>
          </div>
          <div
            className="upload_result_modal-overlay"
            onClick={handleRecipeDeleteMessageModalClose}
          ></div>
        </div>
      )}
    </>
  ) : (
    <div className="message">
      {isSmallMobile ? (
        <p>What argh we gonna cook today?</p>
      ) : (
        <div className="message-start">
          <p>Start by looking for a recipe or an ingredient.&nbsp;</p>
          <img src={iconSmile} className="message-start-img"></img>
        </div>
      )}
    </div>
  );
};

export default RecipeDetails;
