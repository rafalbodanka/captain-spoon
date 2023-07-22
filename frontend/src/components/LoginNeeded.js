import React from "react";
import { Link } from "react-router-dom";

const LoginNeeded = ({ isOpen, onRequestClose }) => {
  return (
    <>
      {isOpen ? (
        <>
          <div
            className="login_needed-modal-overlay"
            onClick={onRequestClose}
          >
            <div className="login_needed-modal">
              Only logged in users can add recipes.{" "}
              <p className="authentication_links">
              <Link to="/login">Log in</Link> or{" "}
              <Link to="/register">Sign up</Link>
              </p>
            </div>
          </div>
        </>
      ) : (
        ""
      )}
    </>
  );
};

export default LoginNeeded;
