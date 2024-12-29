import React from "react";
import useWebsiteTitle from "../../hooks/useWebsiteTitle";
import { useTranslation } from "react-i18next";
import styles from "./Settings.module.scss";

const Settings: React.FC = () => {
  const { t } = useTranslation();
  useWebsiteTitle(t("settings"));

  return (
    <div className={styles.mainContainer}>
      <h1>Ustawienia</h1>
    </div>
  );
};

export default Settings;
