import { FC } from "react";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import styles from "./WelcomePage.module.scss";
import { useTranslation } from "react-i18next";
import useWebsiteTitle from "../../hooks/useWebsiteTitle";

const WelcomePage: FC = () => {
  const { t } = useTranslation();
  useWebsiteTitle(t("sign-in"));

  return (
    <div className={styles.container}>
      <div className={styles.overlay}></div>
      <div className={`${styles.loginBox} shadow-lg`}>
        <div className={styles.left}>
          <h2 className="text-secondary mb-4">{t("sign-in")}</h2>
          <form>
            <label htmlFor="username" className={styles.label}>
              {t("username")}
            </label>
            <input
              type="text"
              id="username"
              placeholder={t("username")}
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

            <div className={`mt-3 d-flex flex-row `}>
              <input
                type="checkbox"
                id="remember"
                className={`${styles.check} form-check`}
              />
              <label htmlFor="remember" className="form-check-label">
                {t("remember-me")}
              </label>
            </div>

            <button type="submit" className={`${styles.signInButton} mt-5`}>
              {t("sign-in")}
            </button>
          </form>
          <a href="#" className={`${styles.link} d-block mt-3`}>
            {t("forgot-password")}?
          </a>
        </div>
        <div className={`${styles.right} shadow-sm`}>
          <h2 className="mb-3">{t("welcome-to-login")}</h2>
          <p>{t("dontt-have-an-account")}?</p>
          <a href="#" className={`${styles.signUpButton} mt-3`}>
            {t("sign-up")}
          </a>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
