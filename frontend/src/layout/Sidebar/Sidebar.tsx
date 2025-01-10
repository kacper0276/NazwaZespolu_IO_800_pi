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

const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const api = useApiJson();
  const userHook = useUser();
  const [isMinimized, setIsMinimized] = useState(false);
  const [activePanel, setActivePanel] = useState<
    "search" | "notifications" | "messages" | null
  >(null);
  const [isHidden, setIsHidden] = useState(true);
  const [searchMode, setSearchMode] = useState<"users" | "posts">("users");
  const [username, setUsername] = useState<string>("");
  const [debouncedUsername, setDebouncedUsername] = useState<string>("");
  const [results, setResults] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filteredPosts, setFilteredPosts] = useState<typeof examplePosts>([]);
  const navigate = useNavigate();

  const startChat = (user: UserType) => {
    setActivePanel(null);
    setTimeout(() => setIsHidden(true), 300);
    setIsMinimized(false);
    navigate(`/messages?useremail=${encodeURIComponent(user.email)}`);
  };
  const toggleSearchMode = (mode: "users" | "posts") => {
    setSearchMode(mode);
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

//Search Tab Logic
  useEffect(() => {
    if (searchMode === "posts" && debouncedUsername.trim()) {
      const filtered = examplePosts.filter(
        (post) =>
          post.title.toLowerCase().includes(debouncedUsername.toLowerCase()) ||
          post.content.toLowerCase().includes(debouncedUsername.toLowerCase())
      );
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts([]);
    }
  }, [debouncedUsername, searchMode]);

  //Search tab placeholders
  const examplePosts = [
    { id: 1, title: "Pierwszy post", content: "Ale super post" },
    { id: 2, title: "DRUGI", content: "Ten jeszcze lepszy" },
    { id: 3, title: "TRZECI", content: "superowy" },
  ];
  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div
        className={`${styles.sidebar} ${isMinimized ? styles.minimized : ""}`}
      >
        {/* User Profile */}
        <div className={`mx-auto ${styles.profileSection}`}>
          <img
            src={"https://via.placeholder.com/80"}
            alt="User Profile"
            className={`rounded-circle ${styles.profilePicture}`}
          />
          {!isMinimized && (
            <div className={styles.profileDetails}>
              <div
                className={styles.profileName}
              >{`${userHook.user?.firstname} ${userHook.user?.lastname}`}</div>
              <a
                href={`/profile-page/${userHook.user?.profileId}`}
                className={styles.profileLink}
              >
                View Profile
              </a>
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
            <i className="bi bi-gear mr-5"></i>
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
              <div className={`${styles.searchModeSwitcher} mb-3`}>
                <button
                  className={`${styles.switchButton} ${
                    searchMode === "users" ? styles.active : ""
                  }`}
                  onClick={() => toggleSearchMode("users")}
                >
                  Users
                </button>
                <button
                  className={`${styles.switchButton} ${
                    searchMode === "posts" ? styles.active : ""
                  }`}
                  onClick={() => toggleSearchMode("posts")}
                >
                  Posts
                </button>
              </div>
              {searchMode === "users" && (
                <>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Search users..."
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
                          onClick={() => startChat(user)}
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
              {searchMode === "posts" && (
                <>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Search posts..."
                    className={styles.searchBox}
                  />
                  <div className={styles.resultsContainer}>
                    {isLoading && <p>Loading results...</p>}
                    {!isLoading && filteredPosts.length === 0 && debouncedUsername && (
                      <p>No posts found for "{debouncedUsername}"</p>
                    )}
                    <ul>
                      {filteredPosts.map((post) => (
                        <li key={post.id} className={styles.resultItem}>
                          <strong>{post.title}</strong>
                          <p>{post.content}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
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
