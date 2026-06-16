import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const Doctorpri = ({ children }) => {
  const token = Cookies.get("emstoken");

  if (!token) {
    return <Navigate to="/" />;
  }

  return children;
};

export default Doctorpri;