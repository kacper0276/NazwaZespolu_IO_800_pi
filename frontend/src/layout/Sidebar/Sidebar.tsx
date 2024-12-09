import React, { useState } from 'react';
import styles from './Sidebar.module.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  user: {
    name: string;
    profilePicture: string;
    profileLink: string;
  };
}

const Sidebar: React.FC<SidebarProps> = ({ user }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [activePanel, setActivePanel] = useState<"search" | "notifications" | null>(null);

  const togglePanel = (panel: "search" | "notifications") => {
    if (activePanel === panel) {
      setActivePanel(null); // Zamknij panel
    } else {
      setActivePanel(panel); // Otwórz nowy panel
    }
    setIsMinimized(!activePanel || activePanel !== panel); // Zminimalizuj sidebar
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className={`${styles.sidebar} ${isMinimized ? styles.minimized : ''}`}>
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
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className={styles.navSection}>
          {/* Search */}
          <div
            className={`${styles.navButton} ${activePanel === "search" ? "active" : ""}`}
            onClick={() => togglePanel("search")}
          >
            <i className="bi bi-search"></i>
            {!isMinimized && <span className={styles.navSpan}>Search</span>}
          </div>

          {/* Notifications */}
          <div
            className={`${styles.navButton} ${activePanel === "notifications" ? "active" : ""}`}
            onClick={() => togglePanel("notifications")}
          >
            <i className="bi bi-bell"></i>
            {!isMinimized && <span className={styles.navSpan}>Notifications</span>}
          </div>

          {/* Home */}
          <NavLink
            to="/home"
            className={({ isActive }) =>
              isActive ? `${styles.navButton} active` : styles.navButton
            }
          >
            <i className="bi bi-house"></i>
            {!isMinimized && <span className={styles.navSpan}>Home</span>}
          </NavLink>

          {/* Premium */}
          <NavLink
            to="/premium"
            className={({ isActive }) =>
              isActive ? `${styles.navButton} active` : styles.navButton
            }
          >
            <i className="bi bi-star"></i>
            {!isMinimized && <span className={styles.navSpan}>Premium</span>}
          </NavLink>

          {/* Messages */}
          <NavLink
            to="/messages"
            className={({ isActive }) =>
              isActive ? `${styles.navButton} active` : styles.navButton
            }
          >
            <i className="bi bi-chat-dots"></i>
            {!isMinimized && <span className={styles.navSpan}>Messages</span>}
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
        }`}
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
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
