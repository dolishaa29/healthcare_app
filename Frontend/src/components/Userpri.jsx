import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const Userpri = ({ children }) => {
  const token = Cookies.get("emtoken");

  if (!token) {
    return <>
     
    <Navigate to="/Adminlogin"/>
    </>
  }

  return children;
};

export default Userpri;