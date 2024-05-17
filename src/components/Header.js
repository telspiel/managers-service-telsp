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

  // Function to format the last login time
  const formatLastLoginTime = (timeString) => {
    if (!timeString) return "NA";
    const date = new Date(timeString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "AM" : "PM";
    hours = hours % 12 || 12; // Convert hour from 24-hour to 12-hour format
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${ampm}`;
  };

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };
  return (
    <div className="header-field">
      <div className="heading-text">
        <p>TelSpiel Communications</p>
        {/* <p>{greeting}</p> */}
      </div>
      <div className="header-end">
        <div className="login-time-details">
          <FontAwesomeIcon icon={faCalendarCheck} />
          <span>Last Login Time: {formatLastLoginTime(lastLoginTime)}</span>
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
