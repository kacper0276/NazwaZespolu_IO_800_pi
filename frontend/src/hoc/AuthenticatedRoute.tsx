import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

const AuthenticatedRoute: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  if (true) {
    return <>{children}</>;
  } else {
    return <Navigate to={"/"} />;
  }
};

export default AuthenticatedRoute;
