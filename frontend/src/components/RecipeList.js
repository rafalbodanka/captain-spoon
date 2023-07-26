import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import iconSad from "../img/icon-sad.png";

const RecipeList = ({
  recipes,
  setRecipeDetails,
  currentPage,
  setCurrentPage,
  isQueryResultsEmpty,
  loadingRecipeList,
  resultsType,
  setResultsType,
}) => {
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [hashValue, setHashValue] = useState(window.location.hash);

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;

  const numOfPages = Math.ceil(recipes.length / resultsPerPage);

  const currentResults = recipes.length
    ? recipes.slice(indexOfFirstResult, indexOfLastResult)
    : [];

  const goToNextPage = function () {
    if (currentPage < numOfPages) setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = function () {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const navigate = useNavigate();

  const handleClick = async (event, id) => {
    event.preventDefault();
    setRecipeDetails("");
    // Change the URL without reloading the page
    navigate(`#${id}`);
  };

  return (
    <>
      <div className="results_type">{resultsType}</div>
      <div className="results_list">
        {loadingRecipeList && (
          <div className="spinner_container">
            <div className="spinner"></div>
          </div>
        )}
        {!isQueryResultsEmpty &&
          currentResults.map((recipe) => {
            return (
              <li className="preview" key={recipe.id}>
                <div
                  className="preview__link"
                  id={recipe.id}
                  onClick={(event) => handleClick(event, recipe.id)}
                >
                  <figure className="preview__fig">
                    {recipe.image_url ? (
                      <img src={recipe.image_url} alt="recipe_img" />
                    ) : (
                      <img
                        src={`${process.env.PUBLIC_URL}/no_recipe_img_placeholder.png`}
                        alt="recipe_img"
                      />
                    )}
                  </figure>
                  <div className="preview__data">
                    <h4 className="preview__name">{recipe.title}</h4>
                    <p className="preview__publisher">{recipe.publisher}</p>
                  </div>
                </div>
              </li>
            );
          })}
        {isQueryResultsEmpty && (
          <div className="no_results_message">
            We couldn't find any matching recipe <img src={iconSad}></img>
          </div>
        )}
      </div>
      {recipes.length > 10 ? (
        <div className="pagination">
          {currentPage > 1 ? (
            <>
              <button
                className="btn--inline pagination__btn--prev"
                onClick={goToPrevPage}
              >
                <span>Previous</span>
              </button>
            </>
          ) : (
            ""
          )}
          {currentPage < numOfPages ? (
            <>
              <button
                className="btn--inline pagination__btn--next"
                onClick={goToNextPage}
              >
                <span>Next</span>
              </button>
            </>
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default RecipeList;
