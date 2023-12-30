import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const SharedLayout = (props) => {
  const [isSidebarHiden, setIsSidebarHiden] = useState(true);

  const handleHidenChange = (isHiden) => {
    setIsSidebarHiden(isHiden);
  };

  return (
    <>
      <Sidebar
        photo={props.photo}
        user={props.user}
        isSidebarHiden={isSidebarHiden}
      />
      <section id="content">
        <Navbar
          photo={props.photo}
          user={props.user}
          isSidebarHiden={isSidebarHiden}
          onHidenSidebarChange={handleHidenChange}
        />
        <Outlet />
      </section>
    </>
  );
};

export default SharedLayout;
