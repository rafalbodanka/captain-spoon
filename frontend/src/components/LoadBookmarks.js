import React, { useEffect } from "react";
import axios from "axios";
import { USER_BOOKMARKS_URL } from "../config";

const FetchUserBookmarks = ({
  isLoggedIn,
  userBookmarks,
  setUserBookmarks,
  isUserBookmarksEmpty,
  setIsUserBookmarksEmpty,
  setBookmarksIdList,
}) => {
  const fillBookmarksIdList = (bookmarks) => {
    const bookmarksId = [];
    bookmarks.forEach((bookmark) => {
      bookmarksId.push(bookmark.id);
    });
    setBookmarksIdList(bookmarksId);
  };

  useEffect(() => {
    if (isLoggedIn) {
      const getUserBookmarks = async () => {
        try {
          const data = await axios.get(USER_BOOKMARKS_URL, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          });
          if (!data.data.bookmarks) {
            setIsUserBookmarksEmpty(true);
          } else {
            setUserBookmarks(data.data.bookmarks);
            fillBookmarksIdList(data.data.bookmarks);
            setIsUserBookmarksEmpty(false);
          }
        } catch (error) {}
      };
      getUserBookmarks();
    }
  }, [isLoggedIn, setIsUserBookmarksEmpty, setUserBookmarks]);
};
export default FetchUserBookmarks;
