import React, { useEffect, useState } from "react";
import axios from "axios";

const Authenticate = ({ isLoggedIn, setIsLoggedIn, setUsername }) => {
  const [isLoading, setIsLoading] = useState(true)

  const access_token = localStorage.getItem("access_token");
  const refresh_token = localStorage.getItem("refresh_token");

  const getUserData = async (access) => {
    const config = {
      headers: {
        Authorization: `Bearer ${access}`,
      }
    };
  
    try {
      const response = await axios.get(
        "http://localhost:8000/user/",
        config,
        null
      );
  
      setIsLoggedIn(true);
      setUsername(response.data.username);
    } catch (error) {
    }
  };
  
  const refreshAccessToken = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/refresh-token/",
        {
          refresh: refresh_token,
        }
      );
      const new_access_token = response.data.access;
      localStorage.setItem("access_token", new_access_token);
      getUserData(new_access_token);
    } catch (error) {
    }
  };
  
  useEffect(() => {
    const checkJWT = async () => {
      if (!access_token && !refresh_token) {
        setIsLoggedIn(false);
        setIsLoading(false);
        return;
      }
  
      if (access_token) {
        try {
          await getUserData(access_token);
        } catch (error) {}

      if (refresh_token) {
        try {
          await refreshAccessToken();
        } catch (error) {
          setIsLoggedIn(false);
          setUsername(null);
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.reload();
        } finally {
          setIsLoading(false);
        }
        }
      }
    };
  
    checkJWT();
  }, []);

  if(isLoading) {
    return (
      <div className="spinner-overlay">
        <div className="spinner"></div>
      </div>
    )
  }

  return isLoggedIn;
};

export default Authenticate;
