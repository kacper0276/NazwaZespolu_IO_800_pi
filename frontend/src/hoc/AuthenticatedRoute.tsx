import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const AuthenticatedRoute: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const userData = useUser().user;

  if (userData) {
    return <>{children}</>;
  } else {
    return <Navigate to={"/welcome-page"} />;
  }
};

export default AuthenticatedRoute;
