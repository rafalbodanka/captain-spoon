import React, { useState } from "react";
import { Navigate } from "react-router-dom";

import favicon from "../img/favicon.png";
import captain_spoon from "../img/captain-spoon-invisible_bg.png";

const Register = ({ isLoggedIn }) => {
  const [message, setMessage] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [isMessageErrorStatus, setIsMessageErrorStatus] = useState(false);

  if (isLoggedIn) {
    return <Navigate replace to="/" />;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const data = new FormData(form);
    const dataObject = Object.fromEntries(data.entries());

    if (
      dataObject.username === "" ||
      dataObject.email === "" ||
      dataObject.password === ""
    ) {
      setMessage("All fields must be completed");
      setIsMessageErrorStatus(true);
      return;
    }

    const jsonData = JSON.stringify(dataObject);

    fetch("http://localhost:8000/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonData,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return response.json().then((error) => {
            throw new Error(
              error.email[0] || error.username[0] || "Registration failed"
            );
          });
        }
      })
      .then((data) => {
        setIsRegistered(true);
        setMessage(`Hello ${data.username}, welcome aboard!`);
      })
      .catch((error) => {
        setMessage(error.message);
        setIsMessageErrorStatus(true);
      });
  };

  return (
    <>
      {!isRegistered && (
        <div className="background">
          <div className="register_header">
            <div className="logo">
              <a href="/">
                <img src={favicon} className="logo_img" alt="Logo" />
              </a>
            </div>
            <div className="page_title">Join the crew, landlubber!</div>
          </div>
          <div className="register_container">
            <img
              className="captain_spoon-img"
              alt="Captain spoon"
              src={captain_spoon}
            ></img>
            <div className="register">
              <form onSubmit={handleSubmit} className="register_form">
                <div className="register_form_item">
                  <p className="register_form_title">Username:</p>
                  <input type="text" id="username" name="username" />
                </div>
                <div className="register_form_item">
                  <p className="register_form_title">Email:</p>
                  <input type="email" id="email" name="email" />
                </div>
                <div className="register_form_item">
                  <p className="register_form_title">Password:</p>
                  <input type="password" id="password" name="password" />
                </div>
                {isMessageErrorStatus && (
                  <div className="register_message">{message}</div>
                )}
                <div className="register_form_btn">
                  <button type="submit">Register</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {isRegistered && (
        <div className="register_success_container">
          <div className="register_success_message">{message}</div>
          <div className="register_message_navigate">
            <span>
              You can now{" "}
              <a className="login_link" href="http://localhost:3000/login/">
                log in
              </a>
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default Register;
