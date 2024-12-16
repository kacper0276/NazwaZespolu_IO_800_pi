import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const AuthenticatedAdminRoute: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const userData = useUser().user;

  if (userData?.role === "admin") {
    return <>{children}</>;
  } else {
    return <Navigate to={"/welcome-page"} />;
  }
};

export default AuthenticatedAdminRoute;
