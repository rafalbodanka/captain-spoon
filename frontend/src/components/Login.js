import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

import logo_icon from "../img/logo_icon-no-bg.png";
import captain_spoon from "../img/captain-spoon-invisible_bg.png";

const Login = ({ isLoggedIn, setIsLoggedIn, setUsername }) => {
  const [message, setMessage] = useState("");
  const [isMessageErrorStatus, setIsMessageErrorStatus] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const data = new FormData(form);
    const username = data.get("username");
    const password = data.get("password");

    try {
      const response = await axios.post("http://localhost:8000/login/", {
        username: username,
        password: password,
      });
      const access_token = response.data.access;
      const refresh_token = response.data.refresh;
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
      setMessage("Login successful!");
      setIsLoggedIn(true);
      setUsername(username);
    } catch (error) {
      if (error.response.status === 400) {
        setMessage("Insert username and password");
      } else if (error.response.status === 401) {
        setMessage("Invalid credentials");
      }
      setIsMessageErrorStatus(true);
    }
  };

  if (isLoggedIn) {
    return <Navigate replace to="/" />;
  }

  return (
    <>
      {!isLoggedIn && (
        <div className="background">
          <div className="login_header">
            <div className="logo">
              <a href="/">
                <img src={logo_icon} className="logo_img" alt="Logo" />
              </a>
            </div>
          </div>
          <div className="login_container">
            <img
              className="captain_spoon-img"
              alt="Captain Spoon"
              src={captain_spoon}
            ></img>
            <div className="login">
              <form onSubmit={handleSubmit} className="login_form">
                <div className="login_form_item">
                  <p className="input_title">Username:</p>
                  <input type="text" id="username" name="username" />
                </div>
                <div className="login_form_item">
                  <p className="input_title">Password:</p>
                  <input type="password" id="password" name="password" />
                </div>
                {isMessageErrorStatus && (
                  <div className="login_message">{message}</div>
                )}
                <div className="login_form_btn">
                  <button type="submit">login</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
