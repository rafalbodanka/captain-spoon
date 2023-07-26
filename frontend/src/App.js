import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header.js";
import RecipeList from "./components/RecipeList.js";
import RecipeDetails from "./components/RecipeDetails.js";
import Register from "./components/Register.js";
import Login from "./components/Login.js";
import Authenticate from "./components/Auth.js";

const App = () => {
  const [recipes, setRecipes] = useState([]);
  const [recipeDetails, setRecipeDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingRecipeList, setLoadingRecipeList] = useState(false);
  const [loadingRecipeDetail, setLoadingRecipeDetail] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [isQueryResultsEmpty, setIsQueryResultsEmpty] = useState(false);
  const [userBookmarks, setUserBookmarks] = useState([]);
  const [bookmarksIdList, setBookmarksIdList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [resultsType, setResultsType] = useState("");

  //Responsivenss
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1000);
  const [isSmallMobile, setIsSmallMobile] = useState(window.innerWidth < 550);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1000);
      setIsSmallMobile(window.innerWidth <= 550);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <Authenticate
        isLoggedIn={isLoggedIn}
        setUsername={setUsername}
        setIsLoggedIn={setIsLoggedIn}
      ></Authenticate>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <div className="container">
                  <Header
                    resultsType={resultsType}
                    setResultsType={setResultsType}
                    isMobile={isMobile}
                    isSmallMobile={isSmallMobile}
                    recipes={recipes}
                    setLoadingRecipeDetail={setLoadingRecipeDetail}
                    setRecipes={setRecipes}
                    loadingRecipeList={loadingRecipeList}
                    setLoadingRecipeList={setLoadingRecipeList}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    isLoggedIn={isLoggedIn}
                    username={username}
                    setIsLoggedIn={setIsLoggedIn}
                    isQueryResultsEmpty={isQueryResultsEmpty}
                    setIsQueryResultsEmpty={setIsQueryResultsEmpty}
                    setRecipeDetails={setRecipeDetails}
                    userBookmarks={userBookmarks}
                    setUserBookmarks={setUserBookmarks}
                    bookmarksIdList={bookmarksIdList}
                    setBookmarksIdList={setBookmarksIdList}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                  />
                  <div className="recipes_container">
                    {!isMobile && (
                      <section className="results">
                        <RecipeList
                          resultsType={resultsType}
                          setResultsType={setResultsType}
                          loadingRecipeList={loadingRecipeList}
                          recipes={recipes}
                          setLoadingRecipeDetail={setLoadingRecipeDetail}
                          setRecipeDetails={setRecipeDetails}
                          currentPage={currentPage}
                          setCurrentPage={setCurrentPage}
                          isQueryResultsEmpty={isQueryResultsEmpty}
                        />
                      </section>
                    )}
                    <RecipeDetails
                      resultsType={resultsType}
                      setResultsType={setResultsType}
                      isMobile={isMobile}
                      isSmallMobile={isSmallMobile}
                      loading={loading}
                      loadingRecipeDetail={loadingRecipeDetail}
                      setLoadingRecipeDetail={setLoadingRecipeDetail}
                      setLoading={setLoading}
                      recipeDetails={recipeDetails}
                      setRecipeDetails={setRecipeDetails}
                      currentUser={username}
                      recipes={recipes}
                      setRecipes={setRecipes}
                      bookmarksIdList={bookmarksIdList}
                      userBookmarks={userBookmarks}
                      setUserBookmarks={setUserBookmarks}
                      setSearchQuery={setSearchQuery}
                      setBookmarksIdList={setBookmarksIdList}
                    />
                  </div>
                </div>
              </>
            }
          />
          <Route
            path="register"
            element={<Register isLoggedIn={isLoggedIn} />}
          ></Route>
          <Route
            path="login"
            element={
              <Login
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
                setUsername={setUsername}
              />
            }
          ></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
