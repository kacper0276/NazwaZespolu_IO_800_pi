import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const NoAuthenticatedRoute: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const userData = useUser().user;

  if (!userData) {
    return <>{children}</>;
  } else {
    return <Navigate to={"/"} />;
  }
};

export default NoAuthenticatedRoute;
