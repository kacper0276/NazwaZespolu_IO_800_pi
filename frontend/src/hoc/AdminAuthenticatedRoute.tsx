import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import LocalStorageService from "../services/localStorage.service";
import { UserType } from "../types/IUser";

const AuthenticatedAdminRoute: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const userContext = useUser();

  if (
    userContext.user &&
    userContext.token &&
    userContext.refreshToken &&
    userContext.user?.role === "admin"
  ) {
    return <>{children}</>;
  } else {
    const storedUser = LocalStorageService.getItem<UserType>("user");
    const storedAccessToken =
      LocalStorageService.getItem<string>("accessToken");
    const storedRefreshToken =
      LocalStorageService.getItem<string>("refreshToken");

    if (storedUser && storedAccessToken && storedRefreshToken) {
      userContext.login(storedUser, storedAccessToken, storedRefreshToken);

      return <>{children}</>;
    }

    return <Navigate to={"/welcome-page"} />;
  }
};

export default AuthenticatedAdminRoute;
