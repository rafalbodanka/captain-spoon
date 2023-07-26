import React, { useEffect } from "react";
import axios from "axios";
import { USER_RECIPES_URL } from "../config";

const UserRecipes = ({
  setIsMenuOpen,
  setIsRecipeListOpen,
  setRecipes,
  setCurrentPage,
  username,
  setIsUserRecipesEmpty,
  setResultsType,
}) => {
  const getUserRecipes = async () => {
    const data = await axios.get(
      USER_RECIPES_URL,
      {
        params: {
          username: username,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );
    if (data.data.length < 1) {
      setIsUserRecipesEmpty(true);
    } else {
      setRecipes(data.data);
      setCurrentPage(1);
      setIsUserRecipesEmpty(false);
      setIsMenuOpen(false);
      setIsRecipeListOpen(true);
      setResultsType("User recipes");
    }
  };

  return <li onClick={getUserRecipes}>My recipes</li>;
};

export default UserRecipes;
