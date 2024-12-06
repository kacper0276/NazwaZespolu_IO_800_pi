import React from "react";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import styles from "./RegisterPage.module.scss";
import { useTranslation } from "react-i18next";

const RegisterPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <div className={styles.overlay}></div>
      <div className={`${styles.registerBox} shadow-lg`}>
        <div className={`${styles.left} shadow-sm`}>
          <h2 className="mb-3">{t("welcome-to-register")}</h2>
          <p>{t("start-your-journey-today")}!</p>
          <h3 className="mb-3">
            {t("join-others-on-their-way-to-improvement")}
          </h3>
        </div>
        <div className={styles.right}>
          <h2 className="text-secondary mb-2">{t("register")}</h2>
          <form>
            <label className={styles.label}>{t("email")}</label>
            <input
              type="email"
              id="email"
              placeholder={t("email")}
              className={`${styles.input} form-control`}
            />

            <label htmlFor="password" className={styles.label}>
              {t("password")}
            </label>
            <input
              type="password"
              id="password"
              placeholder={t("password")}
              className={`${styles.input} form-control`}
            />

            <label className={styles.label}>{t("confirm-password")}</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder={t("confirm-password")}
              className={`${styles.input} form-control`}
            />

            <label className={styles.label}>{t("name")}</label>
            <input
              type="text"
              id="confirmPassword"
              placeholder={t("name")}
              className={`${styles.input} form-control`}
            />

            <label className={styles.label}>{`${t("last-name")}(${t(
              "not-required"
            )})`}</label>
            <input
              type="text"
              id="confirmPassword"
              placeholder={t("last-name")}
              className={`${styles.input} form-control`}
            />

            <button type="submit" className={`${styles.signUpButton} mt-4`}>
              {t("register")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
