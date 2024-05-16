import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignOutAlt,
  faUser,
  faCalendarCheck,
  faListSquares,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

function Header({ onLogout }) {
  const navigate = useNavigate();

  const loggedInUserName = localStorage.getItem("loggedInUser");
  const lastLoginTime = localStorage.getItem("lastLoggedInTime");
  const lastLoginIp = localStorage.getItem("lastLoggedInIp");
  const [greeting, setGreeting] = useState("");

  // Function to get the current time in ISTh
  const getCurrentISTTime = () => {
    const currentTime = new Date();
    const ISTOffset = 330; // IST offset in minutes
    const ISTTime = new Date(currentTime.getTime() + ISTOffset * 60000);
    return ISTTime;
  };

  // Function to set the greeting based on the time
  const setGreetingBasedOnTime = () => {
    const currentISTTime = getCurrentISTTime();
    const hours = currentISTTime.getHours();

    if (hours >= 0 && hours < 12) {
      setGreeting("Good Morning");
    } else {
      setGreeting("Good Afternoon");
    }
  };

  // useEffect to set the initial greeting and update it every minute
  useEffect(() => {
    setGreetingBasedOnTime();
    const interval = setInterval(() => {
      setGreetingBasedOnTime();
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };
  return (
    <div className="header-field">
      <div className="heading-text">
        <p>telSpiel</p>
        {/* <p>{greeting}</p> */}
      </div>
      <div className="header-end">
        <div className="login-time-details">
          <FontAwesomeIcon icon={faCalendarCheck} />
          <span>Last Login Time: {lastLoginTime || "NA"}</span>
        </div>
        <div className="login-time-details">
          <FontAwesomeIcon icon={faListSquares} />
          <span>Last Login IP: {lastLoginIp || "NA"}</span>
        </div>
        <div className="user-loggedin">
          <FontAwesomeIcon icon={faUser} />
          <span>{loggedInUserName}</span>
        </div>
        <div className="logout-button" onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
}

export default Header;
