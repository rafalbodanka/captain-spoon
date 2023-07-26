import React, { useState } from "react";
import axios from "axios";

import bookmark_icon_added from "../img/bookmarks_icon-added.png";
import bookmark_icon_notadded from "../img/bookmarks_icon-notadded.png";

const AddBookmark = ({
  recipeDetails,
  isBookmarked,
  setIsBookmarked,
  setUserBookmarks,
  setBookmarksIdList,
}) => {
  const [isBookmarkResultModalOpen, setIsBookmarkResultModalOpen] =
    useState(false);
  const [bookmarkResultMessage, setBookmarkResultMessage] = useState("");

  const openBookmarkResultModal = () => {
    setIsBookmarkResultModalOpen(true);
  };

  const closeBookmarkResultModal = () => {
    setIsBookmarkResultModalOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const recipeId = Number(recipeDetails.id);

    //adding bookmark
    if (!isBookmarked) {
      axios
        .post(
          `http://localhost:8000/bookmarks/add/`,
          {
            recipe_id: recipeId,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          setBookmarkResultMessage("Bookmark added successfully!");
          openBookmarkResultModal();
          setIsBookmarked(true);
          setUserBookmarks(response.data.bookmarks);
          const bookmarksId = [];
          response.data.bookmarks.forEach((bookmark) => {
            bookmarksId.push(bookmark.id);
          });
          setBookmarksIdList(bookmarksId);
        })
        .catch((error) => {
          if (error.response.status === 401) {
            const resultMsg = (
              <span>
                You are not logged in{" "}
                <span>
                  <a href="/login">Log in</a>
                </span>{" "}
                or{" "}
                <span>
                  <a href="/register">Sign up</a>
                </span>
              </span>
            );
            setBookmarkResultMessage(resultMsg);
          } else {
            setBookmarkResultMessage(`Something went wrong, try again!`);
          }
          openBookmarkResultModal();
        });
    }

    // deleting bookmark
    if (isBookmarked) {
      axios
        .delete(`http://localhost:8000/bookmarks/delete/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
          data: {
            recipe_id: recipeId,
          },
        })
        .then((response) => {
          setBookmarkResultMessage("Bookmark deleted successfully!");
          openBookmarkResultModal();
          setIsBookmarked(false);
          setUserBookmarks(response.data.bookmarks);
          const bookmarksId = [];
          response.data.bookmarks.forEach((bookmark) => {
            bookmarksId.push(bookmark.id);
          });
          setBookmarksIdList(bookmarksId);
        })
        .catch((error) => {
          setBookmarkResultMessage(`Something went wrong, try again! ${error}`);
          openBookmarkResultModal();
        });
    }
  };

  return (
    <>
      <div className="bookmark_icon" onClick={handleSubmit}>
        {isBookmarked ? (
          <img className="bookmark_added" src={bookmark_icon_added}></img>
        ) : (
          <img
            className="bookmark_not-added"
            src={bookmark_icon_notadded}
          ></img>
        )}
      </div>
      {isBookmarkResultModalOpen && (
        <div
          className="bookmark_result_modal_overlay"
          onClick={closeBookmarkResultModal}
        >
          <div className="bookmark_result_modal">{bookmarkResultMessage}</div>
        </div>
      )}
    </>
  );
};

export default AddBookmark;
