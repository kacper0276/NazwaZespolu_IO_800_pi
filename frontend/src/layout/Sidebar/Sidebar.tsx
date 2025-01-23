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
import { GoalType } from "../../types/IGoal";
import { NotificationType } from "../../types/INotification";

const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const api = useApiJson();
  const userHook = useUser();
  const navigate = useNavigate();
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
  const [filteredPosts, setFilteredPosts] = useState<GoalType[]>([]);
  const [showOptions, setShowOptions] = useState<{
    [key: string]: UserType | null;
  }>({});
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const handleClick = (user: UserType) => {
    setShowOptions((prev) => ({
      ...prev,
      [user._id]: prev[user._id] ? null : user,
    }));
  };

  const startChat = (user: UserType) => {
    setActivePanel(null);
    setTimeout(() => setIsHidden(true), 300);
    setIsMinimized(false);
    navigate(`/messages?useremail=${encodeURIComponent(user.email)}`);
  };

  const goToProfile = (user: UserType) => {
    navigate(`/profile-page/${user.profileId}`);
  };

  const toggleSearchMode = (mode: "users" | "posts") => {
    setSearchMode(mode);
  };

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<ApiResponse<UserType[]>>(
        `profiles/get-followers-notifications/${userHook.user?.profileId}`
      );
      const users = response.data.data ?? [];
      users.forEach((user, key) => {
        const notification = {
          id: key,
          text: `Użytkownik ${user.firstname} ${user.lastname} zaobserwował Cię`,
          read: false,
        };
        setNotifications((prev) => [...prev, notification]);
      });
      setResults(users);
    } catch (error) {
      toast.error(t("error-fetching-notifications"));
      setResults([]);
    } finally {
      setIsLoading(false);
    }
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

  useEffect(() => {
    if (userHook.user) {
      fetchNotifications();
    }
  }, [userHook.user, location]);

  const fetchUsers = async (query: string) => {
    setIsLoading(true);
    try {
      const response = await api.get<ApiResponse<UserType[]>>("users/search", {
        params: { query },
      });

      const users = response.data.data ?? [];
      setResults(users);
    } catch (error) {
      toast.error(t("error.fetchUsers"));
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  //Search Tab Logic
  useEffect(() => {
    const fetchPostsByTag = async () => {
      if (searchMode === "posts" && debouncedUsername.trim()) {
        try {
          const response = await api.get<ApiResponse<GoalType[]>>(
            "goals/get-posts-by-tag",
            {
              params: { tag: debouncedUsername.toLowerCase() },
            }
          );

          console.log(response);

          const posts = response.data.data ?? [];
          setFilteredPosts(posts);
        } catch (error) {
          toast.error(t("error.fetchPosts"));
          setFilteredPosts([]);
        }
      } else {
        setFilteredPosts([]);
      }
    };

    if (searchMode === "posts" && debouncedUsername.trim()) {
      fetchPostsByTag();
    }
  }, [debouncedUsername, searchMode]);
  //Search tab placeholders
  const examplePosts = [
    {
      id: 1,
      title: t("posts.firstPost.title"),
      content: t("posts.firstPost.content"),
    },
    {
      id: 2,
      title: t("posts.secondPost.title"),
      content: t("posts.secondPost.content"),
    },
    {
      id: 3,
      title: t("posts.thirdPost.title"),
      content: t("posts.thirdPost.content"),
    },
    // Duplicated posts for scrolling effect (keep as in original)
    {
      id: 1,
      title: t("posts.firstPost.title"),
      content: t("posts.firstPost.content"),
    },
    {
      id: 2,
      title: t("posts.secondPost.title"),
      content: t("posts.secondPost.content"),
    },
    {
      id: 3,
      title: t("posts.thirdPost.title"),
      content: t("posts.thirdPost.content"),
    },
    // ... (repeat for other duplicate blocks)
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
            src={
              userHook.user?.profileImage
                ? `/profileImages/${userHook.user.profileImage}`
                : ProfilePicPlaceholder
            }
            alt={t("sidebar.userProfileAlt")}
            className={`${styles.profilePicture}`}
            onError={(e) => {
              e.currentTarget.src = ProfilePicPlaceholder;
            }}
          />
          {!isMinimized && (
            <div className={styles.profileDetails}>
              <div
                className={`${styles.profileName} text-truncate`}
              >{`${userHook.user?.firstname} ${userHook.user?.lastname}`}</div>
              <a
                href={`/profile-page/${userHook.user?.profileId}`}
                className={styles.profileLink}
              >
                {t("sidebar.viewProfile")}
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
            {!isMinimized && (
              <span className={styles.navSpan}>{t("nav.search")}</span>
            )}
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
              <span className={styles.navSpan}>{t("nav.notifications")}</span>
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
            {!isMinimized && (
              <span className={styles.navSpan}>{t("nav.messages")}</span>
            )}
          </div>

          {/* Home */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? `${styles.navButton} active` : styles.navButton
            }
          >
            <i className="bi bi-house"></i>
            {!isMinimized && (
              <span className={styles.navSpan}>{t("nav.home")}</span>
            )}
          </NavLink>

          {/* Premium */}
          <NavLink
            to="/premium-offer"
            className={({ isActive }) =>
              isActive ? `${styles.navButton} active` : styles.navButton
            }
          >
            <i className="bi bi-star"></i>
            {!isMinimized && (
              <span className={styles.navSpan}>{t("nav.premium")}</span>
            )}
          </NavLink>
        </nav>

        {/* Settings */}
        <div className={styles.settingsSection}>
          <NavLink to="/settings" className={styles.settingsButton}>
            <i className="bi bi-gear"></i>
            {!isMinimized && <span>{t("nav.settings")}</span>}
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
              <h5>{t("search.title")}</h5>
              <div className={`${styles.searchModeSwitcher} mb-3`}>
                <button
                  className={`${styles.switchButton} ${
                    searchMode === "users" ? styles.active : ""
                  }`}
                  onClick={() => toggleSearchMode("users")}
                >
                  {t("search.users")}
                </button>
                <button
                  className={`${styles.switchButton} ${
                    searchMode === "posts" ? styles.active : ""
                  }`}
                  onClick={() => toggleSearchMode("posts")}
                >
                  {t("search.posts")}
                </button>
              </div>
              {searchMode === "users" && (
                <>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={t("search.searchUsers")}
                    className={styles.searchBox}
                  />
                  <div className={styles.scrollableContainer}>
                    {isLoading && <p>{t("search.loading")}</p>}
                    {isLoading && <p>{t("loading-results")}</p>}
                    {!isLoading &&
                      results.length === 0 &&
                      debouncedUsername && (
                        <p>
                          {t("search.noResults", { query: debouncedUsername })}
                        </p>
                      )}
                    <ul>
                      {results.map((user) => (
                        <li
                          key={user._id}
                          className={`${styles.resultItem} ${
                            showOptions[user._id] ? styles.showOptions : ""
                          }`}
                          onClick={() => handleClick(user)}
                        >
                          <img
                            src={ProfilePicPlaceholder}
                            className={styles.userAvatar}
                            alt={t("search.userAvatar")}
                          />
                          <strong>
                            {user.firstname} {user.lastname}
                          </strong>{" "}
                          - {user.email}
                          {showOptions[user._id] && (
                            <div className={styles.options}>
                              <button
                                className={styles.optionButton}
                                onClick={() => startChat(user)}
                              >
                                {t("search.startChat")}
                                {t("start-chat")}
                              </button>
                              <button
                                className={styles.optionButton}
                                onClick={() => goToProfile(user)}
                                disabled={user.profileId === ""}
                              >
                                {t("search.viewProfile")}
                                {t("view-profile")}
                              </button>
                            </div>
                          )}
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
                    placeholder={t("search.searchPosts")}
                    className={styles.searchBox}
                  />
                  <div className={styles.scrollableContainer}>
                    {filteredPosts.length === 0 && debouncedUsername && (
                      <p>
                        {t("search.noResults", { query: debouncedUsername })}
                      </p>
                    )}
                    <ul>
                      {filteredPosts.map((post) => (
                        <li key={post._id} className={styles.postItem}>
                          <span className={styles.postTitle}>{post.name}</span>
                          <span className={styles.postContent}>
                            {post.description}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </>
          )}
          {activePanel === "notifications" && (
            <div className={styles.notificationsPanel}>
              <h5>{t("notifications.title")}</h5>
              {notifications.length > 0 ? (
                <div className={styles.notificationsContainer}>
                  <ul className={styles.notificationsList}>
                    {notifications.map((notif) => (
                      <li
                        key={notif.id}
                        className={`${styles.notificationItem} ${
                          notif.read ? styles.read : styles.unread
                        }`}
                        onClick={() => markAsRead(notif.id)}
                      >
                        🔔 {notif.text}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className={styles.noNotifications}>
                  {t("notifications.noNew")}
                </p>
              )}
              <button
                className={styles.clearBtn}
                onClick={clearNotifications}
                disabled={notifications.length === 0}
              >
                {t("notifications.clearAll")}
              </button>
            </div>
          )}
          {activePanel === "messages" && (
            <>
              <h5>{t("messages.title")}</h5>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t("messages.searchByEmail")}
                className={styles.searchBox}
              />
              <div className={styles.scrollableContainerMessages}>
                {isLoading && <p>{t("messages.loading")}</p>}
                {!isLoading && results.length === 0 && debouncedUsername && (
                  <p>{t("messages.noResults", { query: debouncedUsername })}</p>
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
                        alt={t("messages.userAvatar")}
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
