import React from "react";
import { Navigate } from "react-router-dom";

import CurrentUserContext from "../contexts/CurrentUserContext";

const ProtectedRoute = (props) => {
  const { children } = props;

  const currentUser = React.useContext(CurrentUserContext);

  if (!currentUser) {
    return <Navigate replace to="/sign-in" />;
  }

  return children;
};

export default ProtectedRoute;
