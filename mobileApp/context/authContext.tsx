import React, { useContext, useEffect, useState } from "react";
import { User } from "../types/user.types";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface IAuthContextType {
  user: User | null;
  logged: boolean;
  login: (userdata: User) => Promise<void>;
  logout: () => Promise<void>;
}

type Props = {
  children?: React.ReactNode;
};

const AuthContext = React.createContext<IAuthContextType>({
  user: null,
  logged: false,
  login: async () => {},
  logout: async () => {},
});

const AuthProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [logged, setLogged] = useState(false);

  const login = async (userData: User) => {
    setUser(userData);
    setLogged(true);
    await AsyncStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = async () => {
    setUser(null);
    setLogged(false);
    await AsyncStorage.removeItem("user");
  };

  useEffect(() => {
    const loadUserData = async () => {
      const storedUserData = await AsyncStorage.getItem("user");

      // TODO: Później odkomentuj
      // if (storedUserData) {
      //   const userData: User = JSON.parse(storedUserData);
      //   setUser(userData);
      //   setLogged(true);
      // }
    };

    loadUserData();
  }, []);

  return (
    <>
      <AuthContext.Provider value={{ user, logged, login, logout }}>
        {children}
      </AuthContext.Provider>
    </>
  );
};

const useAuthContext = () => useContext<IAuthContextType>(AuthContext);

export { AuthProvider, AuthContext, useAuthContext };
