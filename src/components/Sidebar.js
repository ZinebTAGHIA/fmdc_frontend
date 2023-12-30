import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = (props) => {
  const handleMouseEnter = () => {
    const allSideDivider = document.querySelectorAll("#sidebar .divider");

    if (props.isSidebarHiden) {
      const activeLinks = document.querySelector(".side-menu a.active");
      if (activeLinks) {
      }

      allSideDivider.forEach((item) => {
        item.textContent = item.dataset.text;
      });
    }
  };

  const handleMouseLeave = () => {
    const allSideDivider = document.querySelectorAll("#sidebar .divider");

    if (props.isSidebarHiden) {
      document.querySelectorAll(".side-menu li a").forEach((a) => {});

      allSideDivider.forEach((item) => {
        item.textContent = "-";
      });
    }
  };

  return (
    <section id="sidebar" className={props.isSidebarHiden ? "hide" : ""}>
      <img
        id="user"
        src={
          props.photo
            ? props.photo
            : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
        }
        alt="Photo"
      />

      <h5 id="role" style={{ color: "grey" }}>
        {props.user.role}
      </h5>
      <ul className="side-menu">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <i className="bx bxs-dashboard icon" /> Accueil
          </NavLink>
        </li>
        {props.user.role === "PROFESSOR" && (
          <>
            <li>
              <NavLink
                to="/profil"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <i className="bx bxs-user icon" />
                Profil
              </NavLink>
            </li>
          </>
        )}
        {props.user.role === "ADMIN" && (
          <>
            <li className="divider" data-text="Professeurs">
              {props.isSidebarHiden ? "-" : "Professeurs"}
            </li>
            <li>
              <NavLink
                to="/add-prof"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <i className="bx bx-plus icon" />
                Ajouter un professeur
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/professors-list"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <i className="bx bx-table icon" />
                Liste des professeurs
              </NavLink>
            </li>
          </>
        )}
        {props.user.role === "PROFESSOR" && (
          <>
            <li className="divider" data-text="Groupes">
              {props.isSidebarHiden ? "-" : "Groupes"}
            </li>
            <li>
              <NavLink
                to="/add-group"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <i className="bx bx-plus icon" />
                Ajouter un groupe
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/groups-list"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <i className="bx bx-table icon" />
                Liste des groupes
              </NavLink>
            </li>
            <li className="divider" data-text="étudiants">
              {props.isSidebarHiden ? "-" : "étudiants"}
            </li>
            <li>
              <NavLink
                to="/add-etud"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <i className="bx bxs-user-plus icon" />
                Ajouter un étudiant
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/etuds-list"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <i className="bx bx-group icon" />
                Liste des étudiants
              </NavLink>
            </li>
            <li className="divider" data-text="Dents">
              {props.isSidebarHiden ? "-" : "Dents"}
            </li>
            <li>
              <NavLink
                to="/add-tooth"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <i className="bx bx-plus icon" />
                Ajouter une dent
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/teeth-list"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <i className="bx bx-table icon" />
                Liste des dents
              </NavLink>
            </li>
            <li className="divider" data-text="TPs">
              {props.isSidebarHiden ? "-" : "TPs"}
            </li>
            <li>
              <NavLink
                to="/add-pw"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <i className="bx bx-plus icon" />
                Ajouter un TP
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/pws-list"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <i className="bx bx-table icon" />
                Liste des TPs
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </section>
  );
};

export default Sidebar;
