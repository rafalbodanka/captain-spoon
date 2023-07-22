import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "../sass/main.scss";
import logo_icon from "../img/logo_icon.png";
import user_icon from "../img/user_icon.png";
import icon_menu from "../img/icon_menu-sm.png";
import MobileRecipeList from "./MobileRecipeList";
import { getJSON } from "../helper";
import { API_SEARCH_URL } from "../config";
import AddRecipe from "./AddRecipe";
import { Link } from "react-router-dom";
import LoginNeeded from "./LoginNeeded";
import UserRecipes from "./UserRecipes";
import Bookmarks from "./Bookmarks";
import FetchUserBookmarks from "./LoadBookmarks";

const Header = ({
  isMobile,
  isSmallMobile,
  recipes,
  loadingRecipeList,
  setLoadingRecipeList,
  setRecipes,
  setCurrentPage,
  isLoggedIn,
  setIsLoggedIn,
  username,
  setIsQueryResultsEmpty,
  setRecipeDetails,
  userBookmarks,
  setUserBookmarks,
  setBookmarksIdList,
  searchQuery,
  setSearchQuery,
  setLoadingRecipeDetail,
  currentPage,
  isQueryResultsEmpty,
  resultsType,
  setResultsType,
}) => {
  const [isAddRecipeModalOpen, setIsAddRecipeModalOpen] = useState(false);
  const [isLoginNeededModalOpen, setIsLoginNeededModalOpen] = useState(false);
  const [isUserRecipesEmpty, setIsUserRecipesEmpty] = useState(false);
  const [isUserBookmarksEmpty, setIsUserBookmarksEmpty] = useState(false);
  const [userRecipesSignal, setUserRecipesSignal] = useState(false)

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isRecipeListLoading, setIsRecipeListLoading] = useState(false)
  const [isRecipeListOpen, setIsRecipeListOpen] = useState(false)

  function closeEmptyUserRecipesModal() {
    setIsUserRecipesEmpty(false);
  }

  function openAddRecipeModal() {
    setIsAddRecipeModalOpen(true);
  }

  function closeAddRecipeModal(event) {
    if (event.target === event.currentTarget) {
      setIsAddRecipeModalOpen(false);

    }
  }

  function openLoginNeededModal() {
    setIsLoginNeededModalOpen(true);
  }

  function closeLoginNeededModal(event) {
    if (event.target === event.currentTarget) {
      setIsLoginNeededModalOpen(false);
    }
  }

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // useEffect(() => {
  //   if (searchQuery !== "")
  //   {
  //     handleSearch()
  //   }
  // }, [searchQuery])

  const handleSearch = async () => {
    setRecipes([])
    setLoadingRecipeList(true)
    setIsRecipeListLoading(true)
    setIsRecipeListOpen(true)
    setIsQueryResultsEmpty(false)
    const lowerCaseSearchQuery = searchQuery.toLowerCase();
    if (lowerCaseSearchQuery === "bookmark" || lowerCaseSearchQuery === "bookmarks") {
      setSearchQuery("bookmarks");
      setRecipes(userBookmarks)
      setCurrentPage(1);
      setLoadingRecipeList(false)
      setIsRecipeListLoading(false)
      return
    }

    const data = await getJSON(API_SEARCH_URL, { searchQuery: searchQuery });
    if (data.length > 0) {
      setRecipes(data);
      setIsQueryResultsEmpty(false);
    } else {
      setRecipes([]);
      setIsQueryResultsEmpty(true);
    }
    setCurrentPage(1);
    setResultsType("Results");
    setLoadingRecipeList(false)
    setIsRecipeListLoading(false)
  };

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    handleSearch();
  }, [searchQuery])

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsLoggedIn(false);
    window.location.reload();
  };

  const navigate = useNavigate();

  const openMenu = () => {
    setIsMenuOpen(true);
  }

  const closeMenu = (event) => {
    if (event.target === event.currentTarget) {
      setIsMenuOpen(false);
    }
  }
  
  return (
    <>
      <div className="header">
        <div className="logo">
          <img
            src={logo_icon}
            className="logo_img"
            alt="Logo"
            onClick={() => {
              setRecipes([]);
              setSearchQuery("");
              document.querySelector('.search__field').value="";
              setRecipeDetails("");
              setIsQueryResultsEmpty(false);
              navigate('/');
              setResultsType("")
            }}
          />
        </div>
        <div className="header_middle">
          <div className="search_form-container">
            <div className="search_form" onClick={() => 
            {
              if (recipes.length > 1) {
                setIsRecipeListOpen(true)
              }
            }
            }>
              <input
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                className="search__field"
                placeholder={isSmallMobile ? "Search" : "What argh we gonna cook today?"}
                onKeyDown={(event) => {
                  if (event.key === "Enter") handleSearch();
                }}
              />
              <div className="search__btn" onClick={handleSearch}>
                &#128269;
              </div>
              {isMobile &&
                <MobileRecipeList
                  resultsType={resultsType}
                  setResultsType={setResultsType}
                  loadingRecipeList={loadingRecipeList}
                  recipes={recipes}
                  setLoadingRecipeDetail={setLoadingRecipeDetail}
                  setRecipeDetails={setRecipeDetails}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  isQueryResultsEmpty={isQueryResultsEmpty}
                  setIsRecipeListOpen={setIsRecipeListOpen}
                  isRecipeListOpen={isRecipeListOpen}
                  isRecipeListLoading={isRecipeListLoading}
                  setIsRecipeListLoading={setIsRecipeListLoading}
                  isSmallMobile={isSmallMobile}
                />
              }
            </div>
          </div>
        </div>
        {isMobile ?
        <div>
          {isMenuOpen && 
          <div className="menu-overlay" onClick={closeMenu}>
            <div className="menu-modal">
              <div className="menu-modal-grid">
                {isLoggedIn && (
                  <>
                    <div className="recipe_add-btn" onClick={openAddRecipeModal}>
                      + Add recipe
                    </div>
                  </>
                )}
                {!isLoggedIn && (
                    <div className="recipe_add-btn" onClick={openLoginNeededModal}>
                      + Add recipe
                    </div>
                )}
                <div
                  className="user_icon"
                  onClick={toggleDropdown}
                >
                  <img src={user_icon} className="user__icon-img" alt="User_Icon" />
                  <span>
                    {username}
                  </span>
                </div>
                  {isDropdownOpen && (
                    <div className="dropdown">
                      <ul>
                        {!username ? (
                          <>
                            <li>
                              <div className="dropdown_link">
                                <Link to="/login">Login</Link>
                              </div>
                            </li>
                            <li>
                              <div className="dropdown_link">
                                <Link to="/register">Register</Link>
                              </div>
                            </li>
                          </>
                        ) : (
                          <>
                            <UserRecipes
                              resultsType={resultsType}
                              setResultsType={setResultsType}
                              setLoadingRecipeList={setLoadingRecipeList}
                              setIsRecipeListLoading={setIsRecipeListLoading}
                              setIsMenuOpen={setIsMenuOpen}
                              setIsRecipeListOpen={setIsRecipeListOpen}
                              isMobile={isMobile}
                              setSearchQuery={setSearchQuery}
                              setRecipes={setRecipes}
                              setCurrentPage={setCurrentPage}
                              username={username}
                              setIsUserRecipesEmpty={setIsUserRecipesEmpty}
                            ></UserRecipes>
                            <li onClick={handleLogout}>Logout</li>{" "}
                          </>
                        )}
                      </ul>
                    </div>
                  )}
                <FetchUserBookmarks
                    isLoggedIn={isLoggedIn}
                    userBookmarks={userBookmarks}
                    setUserBookmarks={setUserBookmarks}
                    isUserBookmarksEmpty={isUserBookmarksEmpty}
                    setIsUserBookmarksEmpty={setIsUserBookmarksEmpty}
                    setBookmarksIdList={setBookmarksIdList}
                ></FetchUserBookmarks>
                  <Bookmarks
                    resultsType={resultsType}
                    setResultsType={setResultsType}
                    setIsMenuOpen={setIsMenuOpen}
                    setIsRecipeListOpen={setIsRecipeListOpen}
                    isMobile={isMobile}
                    setSearchQuery={setSearchQuery}
                    setRecipes={setRecipes}
                    setCurrentPage={setCurrentPage}
                    username={username}
                    setIsUserRecipesEmpty={setIsUserBookmarksEmpty}
                    userBookmarks={userBookmarks}
                    setUserBookmarks={setUserBookmarks}
                    ></Bookmarks>
              </div>
              </div>
          </div>
          }
          <img src={icon_menu} alt="icons8 icon menu" onClick={openMenu} className="icon_menu"></img>
        </div>
        :
        <div className="user_icons">
          {isLoggedIn && (
            <>
              <div className="recipe_add-btn" onClick={openAddRecipeModal}>
                +
              </div>
            </>
          )}
          {!isLoggedIn && (
              <div className="recipe_add-btn" onClick={openLoginNeededModal}>
                +
              </div>
          )}
          <div
            className="user_icon"
            onMouseEnter={toggleDropdown}
            onMouseLeave={toggleDropdown}
          >
            <img src={user_icon} className="user__icon-img" alt="User_Icon" />
            {username}
            {isDropdownOpen && (
              <div className="dropdown">
                <ul>
                  {!username ? (
                    <>
                      <li>
                        <div className="dropdown_link">
                          <Link to="/login">Login</Link>
                        </div>
                      </li>
                      <li>
                        <div className="dropdown_link">
                          <Link to="/register">Register</Link>
                        </div>
                      </li>
                    </>
                  ) : (
                    <>
                      <UserRecipes
                        resultsType={resultsType}
                        setResultsType={setResultsType}
                        setLoadingRecipeList={setLoadingRecipeList}
                        setIsRecipeListLoading={setIsRecipeListLoading}
                        setIsMenuOpen={setIsMenuOpen}
                        setIsRecipeListOpen={setIsRecipeListOpen}
                        isMobile={isMobile}
                        setSearchQuery={setSearchQuery}
                        setRecipes={setRecipes}
                        setCurrentPage={setCurrentPage}
                        username={username}
                        setIsUserRecipesEmpty={setIsUserRecipesEmpty}
                      ></UserRecipes>
                      <li onClick={handleLogout}>Logout</li>{" "}
                    </>
                  )}
                </ul>
              </div>
            )}
          </div>
          <FetchUserBookmarks
              isLoggedIn={isLoggedIn}
              userBookmarks={userBookmarks}
              setUserBookmarks={setUserBookmarks}
              isUserBookmarksEmpty={isUserBookmarksEmpty}
              setIsUserBookmarksEmpty={setIsUserBookmarksEmpty}
              setBookmarksIdList={setBookmarksIdList}
          ></FetchUserBookmarks>
          <Bookmarks
            resultsType={resultsType}
            setResultsType={setResultsType}
            setIsMenuOpen={setIsMenuOpen}
            setIsRecipeListOpen={setIsRecipeListOpen}
            isMobile={isMobile}
            setSearchQuery={setSearchQuery}
            setRecipes={setRecipes}
            setCurrentPage={setCurrentPage}
            username={username}
            setIsUserRecipesEmpty={setIsUserBookmarksEmpty}
            userBookmarks={userBookmarks}
            setUserBookmarks={setUserBookmarks}
          ></Bookmarks>
        </div>
        }
      </div>
      <AddRecipe
        isOpen={isAddRecipeModalOpen}
        onRequestClose={closeAddRecipeModal}
        className="add_recipe-modal"
        ariaHideApp={false}
      ></AddRecipe>
      <LoginNeeded
        isOpen={isLoginNeededModalOpen}
        onRequestClose={closeLoginNeededModal}
        className="login_needed-modal"
        ariaHideApp={false}
      ></LoginNeeded>
      {isUserRecipesEmpty && (
          <div
            className="empty_user_recipes_modal-overlay"
            onClick={closeEmptyUserRecipesModal}
          >
            <div className="empty_user_recipes_modal">
              You have no recipes added yet.
              <div
                className="empty_user_recipes_modal_btn"
                onClick={() => {
                  openAddRecipeModal();
                  closeEmptyUserRecipesModal();
                }}
              >
                Add first recipe
              </div>
            </div>
          </div>
      )}
    </>
  );
};

export default Header;
