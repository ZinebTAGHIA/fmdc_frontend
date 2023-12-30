import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, user }) => {
  if (!localStorage.getItem("auth_token")) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default ProtectedRoute;
