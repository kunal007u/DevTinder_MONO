import { Navigate, Outlet } from "react-router";

export const PrivateRoute = () => {
  const isAuthenticated = true; 

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If logged in, render the child route component seamlessly
  return <Outlet />;
};
