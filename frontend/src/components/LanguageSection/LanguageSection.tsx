import React from "react";
import { useTranslation } from "react-i18next";
import { Lang } from "../../enums/lang.enum";
import styles from "./LanguageSection.module.scss";
import useWebsiteTitle from "../../hooks/useWebsiteTitle";

const LanguageSection: React.FC = () => {
  const { t, i18n } = useTranslation();
  useWebsiteTitle(t("language-settings"));

  const setLang = (lang: Lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className={styles.languageSection}>
      <h2>{t("language-settings")}</h2>
      <div className={styles.languageOptions}>
        <div className={styles.languageOption}>
          <button
            onClick={() => setLang(Lang.EN)}
            className={`${styles.languageButton} ${
              i18n.language === Lang.EN ? styles.active : ""
            }`}
          >
            <img
              src="src/assets/images/greatBritainFlag.png"
              alt="UK flag"
              className={styles.flagImage}
            />
          </button>
          <span className={styles.languageLabel}>{t("english")}</span>
        </div>
        <div className={styles.languageOption}>
          <button
            onClick={() => setLang(Lang.PL)}
            className={`${styles.languageButton} ${
              i18n.language === Lang.PL ? styles.active : ""
            }`}
          >
            <img
              src="src/assets/images/polandFlag.png"
              alt="Poland flag"
              className={styles.flagImage}
            />
          </button>
          <span className={styles.languageLabel}>{t("polish")}</span>
        </div>
        <div className={styles.languageOption}>
          <button
            onClick={() => setLang(Lang.JP)}
            className={`${styles.languageButton} ${
              i18n.language === Lang.JP ? styles.active : ""
            }`}
          >
            <img
              src="src/assets/images/japanFlag.jpg"
              alt="Japan flag"
              className={styles.flagImage}
            />
          </button>
          <span className={styles.languageLabel}>{t("jp")}</span>
        </div>
      </div>
    </div>
  );
};

export default LanguageSection;
