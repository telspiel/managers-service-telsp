import React, { useState, useEffect } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import UserSummaryReport from "./pages/UserSummaryReport";
import CreditReport from "./pages/CreditReport";
import Login from "./components/Login";
import Header from "./components/Header";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        setIsLoggedIn(true);
        // Set up a timer for session timeout (10 minutes)
        const sessionTimeout = 10 * 60 * 1000; // 10 minutes in milliseconds
        const timeoutId = setTimeout(() => {
          // Session timeout logic, e.g., redirect initial page
          setIsLoggedIn(false);
          localStorage.removeItem("authToken"); // clear the token
          // Redirect to login page
          window.location.href = "/login";
        }, sessionTimeout);
        // Clean up the timer when the component unmounts or when the user logs out
        return () => clearTimeout(timeoutId);
      }
    };
    checkAuth();
  }, []);

  const handleLogin = () => {
    // Clear existing timeout when the user logs in again
    const existingTimeout = setTimeout(() => {});
    clearTimeout(existingTimeout);
    // Set up a new timeout
    const sessionTimeout = 10 * 60 * 1000; // 10 minutes in milliseconds
    const timeoutId = setTimeout(() => {
      // Session timeout logic, e.g., redirect to the login page or perform logout
      setIsLoggedIn(false);
      localStorage.removeItem("authToken"); // clear the token
      // Redirect to login page
      window.location.href = "/login";
    }, sessionTimeout);
    // Update the state to indicate the user is logged in
    setIsLoggedIn(true);
    return () => clearTimeout(timeoutId);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
  };

  // const PrivateRoute = ({ element, ...props }) => {
  //   return isLoggedIn ? element : <Navigate to="/login" />;
  // };
  return (
    <div>
      <BrowserRouter>
        {!isLoggedIn && <Login onLogin={handleLogin} />}
        {isLoggedIn && (
          <div>
            <Header onLogout={handleLogout} />{" "}
            {/* Pass onLogout prop to Header */}
            <Sidebar>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route
                  path="/user-summary-report"
                  element={<UserSummaryReport />}
                />
                <Route path="/credit-report" element={<CreditReport />} />
                {/* <Route path="/telSpiel/login" element={<Login onLogin={handleLogin} />} /> */}
                <Route
                  path="/login"
                  element={<Login onLogin={handleLogin} />}
                />
              </Routes>
            </Sidebar>
          </div>
        )}
      </BrowserRouter>
    </div>
  );
}

export default App;
