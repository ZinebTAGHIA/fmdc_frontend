import React from "react";
import logo from "../logos/logo-ensaj.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = (props) => {
  const navigate = useNavigate();
  const handleClickProfile = (e) => {
    const profile = document.querySelector("nav .profile");
    const dropdownProfile = profile.querySelector(".profile-link");
    dropdownProfile.classList.toggle("show");
  };
  const handleToggleSidebarClick = () => {
    const allSideDivider = document.querySelectorAll("#sidebar .divider");
    if (props.isSidebarHiden == false) {
      allSideDivider.forEach((item) => {
        item.textContent = "-";
      });
    } else {
      allSideDivider.forEach((item) => {
        item.textContent = item.dataset.text;
      });
    }
    props.onHidenSidebarChange(!props.isSidebarHiden);
    document.querySelectorAll(".side-dropdown").forEach((dropdown) => {
      dropdown.classList.remove("show");
    });
  };

  const onLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload();
  };
  return (
    <nav>
      <i
        className="bx bx-menu toggle-sidebar"
        onClick={handleToggleSidebarClick}
      />
      <div className="titleContainer">
        <img src={logo} alt="logo ensaj" />
      </div>

      <span className="divider" />
      <div className="profile">
        <img
          src={
            props.photo
              ? props.photo
              : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          }
          alt="Photo"
          onClick={handleClickProfile}
        />
        <ul className="profile-link">
          {props.user.role === "PROFESSOR" && (
            <>
              <li>
                <Link to="/profil">
                  <i className="bx bxs-user-circle icon" /> Profil
                </Link>
              </li>
            </>
          )}
          <li>
            <a href="#" onClick={onLogout}>
              <i className="bx bxs-log-out-circle" /> Déconnexion
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
