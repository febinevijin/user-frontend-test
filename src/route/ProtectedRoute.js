import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { userInfo } = useContext(AuthContext);

  // If adminInfo is not present, redirect to login page
  if (!userInfo) {
    return <Navigate to="/auth-login" replace />;
  }

  // If adminInfo exists, render the protected page
  return children;
};

export default ProtectedRoute;
