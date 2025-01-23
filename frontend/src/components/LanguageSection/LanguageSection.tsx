import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Lang } from "../../enums/lang.enum";
import styles from "./LanguageSection.module.scss";
import useWebsiteTitle from "../../hooks/useWebsiteTitle";
import { useApiJson } from "../../config/api";
import { useUser } from "../../context/UserContext";
import { toast } from "react-toastify";

const LanguageSection: React.FC = () => {
  const { t, i18n } = useTranslation();
  useWebsiteTitle(t("language-settings"));
  const api = useApiJson();
  const userHook = useUser();

  const setLang = (lang: Lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("appLanguage", lang);

    api
      .post("settings", {
        userId: userHook.user?._id,
        type: "json",
        data: { lang },
      })
      .then((_res) => {
        console.log(lang);

        localStorage.setItem("appLanguage", lang);
      })
      .catch((_err) => {
        toast.error(t("error"));
      });
  };

  useEffect(() => {
    const savedLang = localStorage.getItem("appLanguage") as Lang;
    if (savedLang) {
      i18n.changeLanguage(savedLang);
    }
  }, []);
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
