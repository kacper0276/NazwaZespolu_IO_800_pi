import { FC, useState } from "react";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import styles from "./WelcomePage.module.scss";
import { useTranslation } from "react-i18next";
import useWebsiteTitle from "../../hooks/useWebsiteTitle";
import { Link, useNavigate } from "react-router-dom";
import { Lang } from "../../enums/lang.enum";
import { UserLoginData } from "../../types/IUser";
import { toast } from "react-toastify";
import { apiJson } from "../../config/api";
import { ApiResponse } from "../../types/api.types";
import { useUser } from "../../context/UserContext";
import localStorageService from "../../services/localStorage.service";

const WelcomePage: FC = () => {
  const { t, i18n } = useTranslation();
  const userContext = useUser();
  const navigate = useNavigate();
  useWebsiteTitle(t("sign-in"));
  const [loginData, setLoginData] = useState<UserLoginData>({
    email: "",
    password: "",
  });

  const setLang = (lang: Lang) => {
    i18n.changeLanguage(lang);
  };

  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await apiJson.post<ApiResponse>("users/login", loginData);

      const userData = res.data.data;

      localStorageService.setItem("user", userData);

      userContext.login(userData);

      toast.success(t(res.data.message));

      navigate("/");
    } catch (err: any) {
      toast.error(t(err.response?.data.message || err.message));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.languageBox}>
        <button
          onClick={() => setLang(Lang.PL)}
          className={styles.languageButton}
        >
          <img
            src="src/assets/images/polandFlag.png"
            alt="Poland flag"
            style={{ width: "100%", height: "100%", borderRadius: "50%" }}
          />
        </button>
        <button
          onClick={() => setLang(Lang.EN)}
          className={styles.languageButton}
        >
          <img
            src="src/assets/images/greatBritainFlag.png"
            alt="UK flag"
            style={{ width: "100%", height: "100%", borderRadius: "50%" }}
          />
        </button>
        <button
          onClick={() => setLang(Lang.JP)}
          className={styles.languageButton}
        >
          <img
            src="src/assets/images/japanFlag.jpg"
            alt="Japan flag"
            style={{ width: "100%", height: "100%", borderRadius: "50%" }}
          />
        </button>
      </div>
      <div className={styles.overlay}></div>
      <div className={`${styles.loginBox} shadow-lg`}>
        <div className={styles.left}>
          <h2 className="text-secondary mb-4">{t("sign-in")}</h2>
          <form onSubmit={login}>
            <label htmlFor="username" className={styles.label}>
              {t("username")}
            </label>
            <input
              type="text"
              id="username"
              placeholder={t("username")}
              className={`${styles.input} form-control`}
              onChange={(e) =>
                setLoginData({ ...loginData, email: e.target.value })
              }
            />

            <label htmlFor="password" className={styles.label}>
              {t("password")}
            </label>
            <input
              type="password"
              id="password"
              placeholder={t("password")}
              className={`${styles.input} form-control`}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
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
          <Link to="/register-page" className={`${styles.signUpButton} mt-3`}>
            {t("sign-up")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
