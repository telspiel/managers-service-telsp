import React, { useState, useRef, useEffect } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import Endpoints from "../endpoints";

function Login({ onLogin }) {
  const userName = useRef();
  const userPassword = useRef();
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState("");

  const submitHandler = async () => {
    try {
      const response = await fetch(Endpoints.get("login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-FORWARDED-FOR": "",
        },
        body: JSON.stringify({
          username: userName.current.value,
          password: userPassword.current.value,
        }),
      });

      const data = await response.json();

      if (data.code === 0 && data.result === "SUCCESS") {
        // Login successful, perform any necessary actions
        console.log(userName.current.value);

        // Remove the "Bearer " prefix from authJwtToken
        const jwtTokenWithoutBearer = data.authJwtToken
          .replace("Bearer ", "")
          .trim();

        // Store authentication tokens
        localStorage.setItem("authToken", data.data.authToken);
        localStorage.setItem("authJwtToken", jwtTokenWithoutBearer);

        // Store additional user data
        localStorage.setItem("loggedInUser", data.data.username);
        localStorage.setItem("lastLoggedInTime", data.data.lastLoginTime);
        localStorage.setItem("lastLoggedInIp", data.data.lastLoginIp);
        localStorage.setItem("userId", data.data.userId.toString());
        localStorage.setItem("username", data.data.username);
        localStorage.setItem("role", data.data.role);

        console.log(
          "Token format after login:",
          localStorage.getItem("authJwtToken")
        );
        console.log("Login Successful");
        onLogin();
        navigate("/dashboard");
      } else {
        // Display error message from the server
        console.log("Login Failed");
        setErrorMessage(data.message || "Login failed. Please try again!");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Enter Valid Username and Password");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      submitHandler();
    }
  };

  return (
    <div>
      <div className="background-animation">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className={`small-ball ${index % 2 === 0 ? "blue" : "pink"}`}
            style={{
              left: `${(index + 1) * 20}%`,
              animationDuration: `${index + 2}s`,
            }}
          ></div>
        ))}
      </div>
      <div className="login-container">
        <form className="login-form">
          <div className="login-heading">
            <h2>Login Page</h2>
          </div>

          {errorMessage && (
            <div
              style={{
                color: "red",
                textAlign: "center",
                marginBottom: "10px",
              }}
            >
              {errorMessage}
            </div>
          )}

          <div className="form-group">
            <input
              type="text"
              id="username"
              placeholder="Enter Username"
              ref={userName}
              onKeyDown={handleKeyPress}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              id="password"
              placeholder="Enter Password"
              ref={userPassword}
              onKeyDown={handleKeyPress}
            />
          </div>

          <button type="button" onClick={submitHandler}>
            Login
          </button>
          <div className="rights">
            <p>@Powered by telSpiel Communications</p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
