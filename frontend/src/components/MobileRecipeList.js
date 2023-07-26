import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import iconSad from "../img/icon-sad.png";

const MobileRecipeList = ({
  recipes,
  setRecipeDetails,
  currentPage,
  setCurrentPage,
  isQueryResultsEmpty,
  isRecipeListOpen,
  setIsRecipeListOpen,
  isRecipeListLoading,
  isSmallMobile,
  resultsType,
}) => {
  const navigate = useNavigate();

  const handleClick = async (event, id) => {
    setRecipeDetails("");
    setIsRecipeListOpen(false);
    // Change the URL without reloading the page
    navigate(`#${id}`);
  };

  const mobileRecipeListRef = useRef(null);

  // Function to handle clicks outside the component
  const handleClickOutside = (event) => {
    const isBookmarkIcon = event.target.closest(".bookmarks");
    const isInsideSearchForm = event.target.closest(".search_form");

    // If the click is on a bookmark icon or inside the search form, do nothing
    if (isBookmarkIcon || isInsideSearchForm) return;

    if (
      mobileRecipeListRef.current &&
      !mobileRecipeListRef.current.contains(event.target)
    ) {
      // If the click is outside the mobileRecipeListRef, close the recipe list
      setIsRecipeListOpen(false);
    }
  };
  // Attach a click event listener when the recipe list is open
  useEffect(() => {
    if (isRecipeListOpen) {
      document.addEventListener("click", handleClickOutside);
    }
    // Remove the click event listener when the recipe list is closed
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isRecipeListOpen]);

  if (isRecipeListOpen)
    return (
      <div ref={mobileRecipeListRef}>
        <div className="mobile_results_list">
          <div className="results_type">{resultsType}</div>
          {isRecipeListLoading &&
            Array.from({ length: 3 }).map((_, index) => (
              <li className="preview skeleton-loading" key={index}>
                <div className="skeleton-placeholder">
                  <div className="shimmerBG skeleton-fig"></div>
                  <div className="skeleton-data">
                    <div className="shimmerBG skeleton-data--name"></div>
                    {!isSmallMobile && (
                      <div className="shimmerBG skeleton-data--publisher"></div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          {!isQueryResultsEmpty ? (
            recipes.map((recipe) => {
              return (
                <li className="preview" key={recipe.id}>
                  <div
                    className="preview__link"
                    id={recipe.id}
                    onClick={(event) => handleClick(event, recipe.id)}
                  >
                    <div className="preview__fig">
                      {recipe.image_url ? (
                        <img src={recipe.image_url} alt="recipe_img" />
                      ) : (
                        <img
                          src={`${process.env.PUBLIC_URL}/no_recipe_img_placeholder.png`}
                          alt="recipe_img"
                        />
                      )}
                    </div>
                    <div className="preview__data">
                      <h4 className="preview__name">{recipe.title}</h4>
                      {!isSmallMobile && (
                        <p className="preview__publisher">{recipe.publisher}</p>
                      )}
                    </div>
                  </div>
                </li>
              );
            })
          ) : (
            <div className="no_results_message-mobile">
              <p>We couldn't find any matching recipe</p>
              <img src={iconSad}></img>
            </div>
          )}
        </div>
      </div>
    );
};

export default MobileRecipeList;
