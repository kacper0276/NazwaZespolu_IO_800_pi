import React, { useState } from "react";
import useWebsiteTitle from "../../hooks/useWebsiteTitle";
import { useTranslation } from "react-i18next";
import styles from "./Settings.module.scss";
import AccountForm from "../../components/AccountForm/AccountForm";
import PrivacyForm from "../../components/PrivacyForm/PrivacyForm";
import ContactSupportForm from "../../components/ContactSupportForm/ContactSupportForm";
import { useUser } from "../../context/UserContext";

const Settings: React.FC = () => {
  const { t } = useTranslation();
  const user = useUser();
  useWebsiteTitle(t("settings"));
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isAdminSettingsExpanded, setIsAdminSettingsExpanded] =
    useState<boolean>(false);

  const renderForm = () => {
    switch (activeSection) {
      case "account":
        return <AccountForm />;
      case "privacy":
        return <PrivacyForm />;
      case "contact":
        return <ContactSupportForm />;
      case "admin-option-1":
        return <p>{t("admin_option_1_content")}</p>;
      case "admin-option-2":
        return <p>{t("admin_option_2_content")}</p>;
      case "admin-option-3":
        return <p>{t("admin_option_3_content")}</p>;
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
                    onClick={() => setActiveSection("admin-option-1")}
                  >
                    {t("admin_option_1")}
                  </button>
                  <button
                    className={styles.settingsButton}
                    onClick={() => setActiveSection("admin-option-2")}
                  >
                    {t("admin_option_2")}
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
