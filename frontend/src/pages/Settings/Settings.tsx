import React, { useState } from "react";
import useWebsiteTitle from "../../hooks/useWebsiteTitle";
import { useTranslation } from "react-i18next";
import styles from "./Settings.module.scss";
import AccountForm from "../../components/AccountForm/AccountForm";
import PrivacyForm from "../../components/PrivacyForm/PrivacyForm";
import ContactSupportForm from "../../components/ContactSupportForm/ContactSupportForm";
import { useUser } from "../../context/UserContext";
import ShowUsersOpinion from "../../components/ShowUsersOpinion/ShowUsersOpinion";
import ChangeUserData from "../../components/ChangeUserData/ChangeUserData";
import LocalStorageService from "../../services/localStorage.service";
import LanguageSection from "../../components/LanguageSection/LanguageSection";
import { useNavigate } from "react-router-dom";
import { Lang } from "../../enums/lang.enum";

const Settings: React.FC = () => {
  const { t, i18n } = useTranslation();
  const user = useUser();
  const navigate = useNavigate();
  useWebsiteTitle(t("settings"));
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isAdminSettingsExpanded, setIsAdminSettingsExpanded] = useState<boolean>(false);

  const logout = () => {
    user.logout();
    LocalStorageService.clear();
    navigate("/welcome-page");
  };

  const setLang = (lang: Lang) => {
    i18n.changeLanguage(lang);
  };

  const renderForm = () => {
    switch (activeSection) {
      case "account":
        return <AccountForm />;
      case "privacy":
        return <PrivacyForm />;
      case "contact":
        return <ContactSupportForm />;
      case "change-user-data":
        return <ChangeUserData />;
      case "show-users-opinion":
        return <ShowUsersOpinion />;
      case "admin-option-3":
        return <p>{t("admin_option_3_content")}</p>;
        case "language":
          return <LanguageSection />;
      default:
        return <p>{t("select_option")}</p>;
    }
  };

  return (
    <div className={styles.mainContainer}>
      <div
        className={`${styles.sidebar} ${
          isSidebarCollapsed ? styles.sidebarCollapsed : ""
        }`}
      >
        <button
          className={styles.collapseButton}
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        >
          {isSidebarCollapsed ? ">" : "<"}
        </button>
        {!isSidebarCollapsed && (
          <>
            <button
              className={styles.settingsButton}
              onClick={() => setActiveSection("account")}
            >
              {t("your_account")}
            </button>
            <button
              className={styles.settingsButton}
              onClick={() => setActiveSection("privacy")}
            >
              {t("privacy_and_safety")}
            </button>
            <button
              className={styles.settingsButton}
              onClick={() => setActiveSection("contact")}
            >
              {t("contact_support")}
            </button>
            <button
              className={styles.settingsButton}
              onClick={() => setActiveSection("language")}
            >
              {t("language")}
            </button>
            <button
              className={styles.settingsButton}
              onClick={logout}
            >
              {t("logout")}
            </button>

            {user.user?.role === "admin" && (
              <div className={styles.adminSection}>
                <button
                  className={styles.settingsButton}
                  onClick={() =>
                    setIsAdminSettingsExpanded(!isAdminSettingsExpanded)
                  }
                >
                  {t("admin_settings")}{" "}
                  <span className={styles.arrowIcon}>
                    {isAdminSettingsExpanded ? "▲" : "▼"}
                  </span>
                </button>
                <div
                  className={`${styles.adminSuboptions} ${
                    isAdminSettingsExpanded ? styles.expanded : styles.collapsed
                  }`}
                >
                  <button
                    className={styles.settingsButton}
                    onClick={() => setActiveSection("change-user-data")}
                  >
                    {t("change-user-data")}
                  </button>
                  <button
                    className={styles.settingsButton}
                    onClick={() => setActiveSection("show-users-opinion")}
                  >
                    {t("show-users-opinion")}
                  </button>
                  <button
                    className={styles.settingsButton}
                    onClick={() => setActiveSection("admin-option-3")}
                  >
                    {t("admin_option_3")}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <div
        className={`${styles.content} ${
          isSidebarCollapsed ? styles.contentExpanded : ""
        }`}
      >
        {renderForm()}
      </div>
    </div>
  );
};

export default Settings;