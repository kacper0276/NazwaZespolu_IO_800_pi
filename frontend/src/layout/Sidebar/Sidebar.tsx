import React, { useState, useEffect } from "react";
import styles from "./Sidebar.module.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useApiJson } from "../../config/api";
import { ApiResponse } from "../../types/api.types";
import { UserType } from "../../types/IUser";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import ProfilePicPlaceholder from "../../assets/images/ProfilePic.jpg";
import { useUser } from "../../context/UserContext";
import LocalStorageService from "../../services/localStorage.service";
import MainPage from "../../pages/MainPage/MainPage";

interface SidebarProps {
  user: {
    name: string;
    profilePicture: string;
    profileLink: string;
  };
}

const Sidebar: React.FC<SidebarProps> = ({ user }) => {
  const { t } = useTranslation();
  const api = useApiJson();
  const userHook = useUser();
  const [isMinimized, setIsMinimized] = useState(false);
  const [activePanel, setActivePanel] = useState<
    "search" | "notifications" | "messages" | null
  >(null);
  const [isHidden, setIsHidden] = useState(true);

  const [username, setUsername] = useState<string>("");
  const [debouncedUsername, setDebouncedUsername] = useState<string>("");
  const [results, setResults] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const startChat = (user: UserType) => {
    setActivePanel(null);
    setTimeout(() => setIsHidden(true), 300);
    setIsMinimized(false);
    navigate(`/messages?useremail=${encodeURIComponent(user.email)}`);
  };

  const togglePanel = (panel: "search" | "notifications" | "messages") => {
    if (activePanel === panel) {
      setActivePanel(null);
      setTimeout(() => setIsHidden(true), 300);
    } else {
      setActivePanel(panel);
      setIsHidden(false);
    }
    setIsMinimized(!activePanel || activePanel !== panel);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedUsername(username);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [username]);

  useEffect(() => {
    if (debouncedUsername.trim()) {
      fetchUsers(debouncedUsername);
    } else {
      setResults([]);
    }
  }, [debouncedUsername]);

  const fetchUsers = async (query: string) => {
    setIsLoading(true);
    try {
      const response = await api.get<ApiResponse<UserType[]>>("users/search", {
        params: { query },
      });

      const users = response.data.data ?? [];
      setResults(users);
    } catch (error) {
      toast.error(t("error-fetching-users"));
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    userHook.logout();
    LocalStorageService.clear();
    navigate("/welcome-page");
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div
        className={`${styles.sidebar} ${isMinimized ? styles.minimized : ""}`}
      >
        {/* User Profile */}
        <div className={`mx-auto ${styles.profileSection}`}>
          <img
            src={user.profilePicture}
            alt="User Profile"
            className={`rounded-circle ${styles.profilePicture}`}
          />
          {!isMinimized && (
            <div className={styles.profileDetails}>
              <div className={styles.profileName}>{user.name}</div>
              <a href={user.profileLink} className={styles.profileLink}>
                View Profile
              </a>
              <button onClick={logout} className={styles.logoutButton}>
                Wyloguj się
              </button>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className={styles.navSection}>
          {/* Search */}
          <div
            className={`${styles.navButton} ${
              activePanel === "search" ? "active" : ""
            }`}
            onClick={() => togglePanel("search")}
          >
            <i className="bi bi-search"></i>
            {!isMinimized && <span className={styles.navSpan}>Search</span>}
          </div>

          {/* Notifications */}
          <div
            className={`${styles.navButton} ${
              activePanel === "notifications" ? "active" : ""
            }`}
            onClick={() => togglePanel("notifications")}
          >
            <i className="bi bi-bell"></i>
            {!isMinimized && (
              <span className={styles.navSpan}>Notifications</span>
            )}
          </div>

          {/* Messages */}
          <div
            className={`${styles.navButton} ${
              activePanel === "messages" ? "active" : ""
            }`}
            onClick={() => togglePanel("messages")}
          >
            <i className="bi bi-chat-dots"></i>
            {!isMinimized && <span className={styles.navSpan}>Messages</span>}
          </div>

          {/* Home */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? `${styles.navButton} active` : styles.navButton
            }
          >
            <i className="bi bi-house"></i>
            {!isMinimized && <span className={styles.navSpan}>Home</span>}
          </NavLink>

          {/* Premium */}
          <NavLink
            to="/premium-offer"
            className={({ isActive }) =>
              isActive ? `${styles.navButton} active` : styles.navButton
            }
          >
            <i className="bi bi-star"></i>
            {!isMinimized && <span className={styles.navSpan}>Premium</span>}
          </NavLink>
        </nav>

        {/* Settings */}
        <div className={styles.settingsSection}>
          <NavLink to="/settings" className={styles.settingsButton}>
            <i className="bi bi-gear"></i>
            {!isMinimized && <span className={styles.navSpan}>Settings</span>}
          </NavLink>
        </div>
      </div>

      {/* Dynamic Panel */}
      <div
        className={`${styles.dynamicPanel} ${
          activePanel ? styles.panelVisible : styles.panelHidden
        } ${isHidden ? styles.hidden : ""}`}
      >
        <div className="p-3 w-100 text-white text-wrap">
          {activePanel === "search" && (
            <>
              <h5>Search</h5>
              <input
                type="text"
                placeholder="Search..."
                className={styles.searchBox}
              />
            </>
          )}
          {activePanel === "notifications" && (
            <>
              <h5>Notifications</h5>
              <ul className="list-unstyled">
                <li>🔔 Notification 1: You have a new message.</li>
                <li>🔔 Notification 2: Your premium plan expires soon.</li>
                <li>🔔 Notification 3: Don't miss our latest updates!</li>
              </ul>
            </>
          )}
          {activePanel === "messages" && (
            <>
              <h5>Messages</h5>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Search user by email..."
                className={styles.searchBox}
              />
              <div className={styles.resultsContainer}>
                {isLoading && <p>Loading results...</p>}
                {!isLoading && results.length === 0 && debouncedUsername && (
                  <p>No results for "{debouncedUsername}"</p>
                )}
                <ul>
                  {results.map((user) => (
                    <li
                      key={user._id}
                      className={styles.resultItem}
                      onClick={() => startChat(user)} // Funkcja otwierająca chat z użytkownikiem
                    >
                      <img
                        src={ProfilePicPlaceholder}
                        className={styles.userAvatar}
                      />
                      <strong>
                        {user.firstname} {user.lastname}
                      </strong>{" "}
                      - {user.email}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
