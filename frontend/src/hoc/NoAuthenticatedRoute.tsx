import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import LocalStorageService from "../services/localStorage.service";
import { UserType } from "../types/IUser";

const NoAuthenticatedRoute: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const userContext = useUser();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthentication = () => {
      if (userContext.user) {
        setIsAuthenticated(true);
      } else {
        const storedUser = LocalStorageService.getItem<UserType>("user");
        const storedAccessToken =
          LocalStorageService.getItem<string>("accessToken");
        const storedRefreshToken =
          LocalStorageService.getItem<string>("refreshToken");

        if (storedUser && storedAccessToken && storedRefreshToken) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      }
      setIsCheckingAuth(false);
    };

    checkAuthentication();
  }, [userContext]);

  if (isCheckingAuth) {
    return <div>Ładowanie...</div>;
  }

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return <Navigate to="/" />;
};

export default NoAuthenticatedRoute;
