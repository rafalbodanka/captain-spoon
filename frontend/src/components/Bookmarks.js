import React, { useState } from "react";

import bookmarks_icon from "../img/bookmarks_icon.png";

const Bookmarks = ({
  isMobile,
  setRecipes,
  setCurrentPage,
  username,
  userBookmarks,
  setIsRecipeListOpen,
  setIsMenuOpen,
  setResultsType,
}) => {
  const [isNoBookmarksModalOpen, setIsNoBookmarksModalOpen] = useState(false);

  const closeEmptyUserBookmarksModal = () => {
    setIsNoBookmarksModalOpen(false);
  };

  return (
    <div
      className="bookmarks"
      onClick={(event) => {
        if (event.target.className !== "empty_user_bookmarks_modal-overlay") {
          if (!userBookmarks || userBookmarks.length < 1) {
            setIsNoBookmarksModalOpen(true);
            return;
          }
          setRecipes(userBookmarks);
          setCurrentPage(1);
          setResultsType("Bookmarks");
          if (isMobile) {
            setIsMenuOpen(false);
            setIsRecipeListOpen(true);
          }
        }
      }}
    >
      <div className="bookmarks_icon">
        <img
          src={bookmarks_icon}
          className="bookmarks__icon"
          alt="Bookmarks_Icon"
        />
      </div>
      {isMobile && <span>Bookmarks</span>}
      {isNoBookmarksModalOpen && (
        <>
          <div
            className="empty_user_bookmarks_modal-overlay"
            onClick={closeEmptyUserBookmarksModal}
          >
            <div className="empty_user_bookmarks_modal">
              {username ? (
                <span>You have no bookmarks added yet.</span>
              ) : (
                <span>
                  <span>
                    {" "}
                    <a href="/login">Log in</a>
                  </span>{" "}
                  or{" "}
                  <span>
                    <a href="/login">Sign up</a>
                  </span>{" "}
                  to start adding bookmarks.
                </span>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Bookmarks;
