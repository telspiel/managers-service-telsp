import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuilding,
  faFile,
  faFileInvoiceDollar,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import logo from "../images/logo.png";

function Sidebar({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const menuItem = [
    {
      path: "/dashboard",
      name: "Dashboard",
      icon: <FontAwesomeIcon icon={faBuilding} />,
    },
    {
      path: "/user-summary-report",
      name: "User Summary Report",
      icon: <FontAwesomeIcon icon={faFile} />,
    },
    {
      path: "/credit-report",
      name: "Credit Report",
      icon: <FontAwesomeIcon icon={faFileInvoiceDollar} />,
    },
  ];
  return (
    <div className="container">
      <div
        style={{ width: isOpen && windowWidth > 500 ? "280px" : "50px" }}
        className="sidebar"
      >
        <div className="topSection">
          <h3 style={{ display: isOpen ? "block" : "none" }} className="logo">
            <img src={logo} alt="Logo" />
          </h3>
          <div style={{ marginLeft: isOpen ? "95px" : "0px" }} className="bars">
            {windowWidth <= 500 && (
              <FontAwesomeIcon icon={faBars} style={{ display: "none" }} />
            )}
            {windowWidth > 500 && (
              <FontAwesomeIcon icon={faBars} onClick={toggle} />
            )}
          </div>
        </div>
        <div>
          {menuItem.map((item, index) => (
            <NavLink
              to={item.path}
              key={index}
              className="link"
              activeClassName="active"
            >
              <div className="icon">{item.icon}</div>
              <div
                style={{
                  display: isOpen && windowWidth > 500 ? "block" : "none",
                }}
                className="link-text"
              >
                {item.name}
              </div>
            </NavLink>
          ))}
        </div>
      </div>
      <main>{children}</main>
    </div>
  );
}

export default Sidebar;
