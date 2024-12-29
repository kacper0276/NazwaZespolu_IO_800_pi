import React, { useState } from "react";
import useWebsiteTitle from "../../hooks/useWebsiteTitle";
import { useTranslation } from "react-i18next";
import styles from "./Settings.module.scss";
import AccountForm from "../../components/AccountForm/AccountForm";
import PrivacyForm from "../../components/PrivacyForm/PrivacyForm";
import ContactSupportForm from "../../components/ContactSupportForm/ContactSupportForm";

const Settings: React.FC = () => {
  const { t } = useTranslation();
  useWebsiteTitle(t("settings"));
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  const renderForm = () => {
    switch (activeSection) {
      case "account":
        return <AccountForm />;
      case "privacy":
        return <PrivacyForm />;
      case "contact":
        return <ContactSupportForm />;
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
