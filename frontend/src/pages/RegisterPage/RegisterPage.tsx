import React, { useState } from "react";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import styles from "./RegisterPage.module.scss";
import { useTranslation } from "react-i18next";
import useWebsiteTitle from "../../hooks/useWebsiteTitle";
import { Lang } from "../../enums/lang.enum";
import { apiJson } from "../../config/api";
import { UserData } from "../../types/user.types";

const RegisterPage: React.FC = () => {
  const [registerData, setRegisterData] = useState<UserData>({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    repeat_password: "",
  });
  const { t, i18n } = useTranslation();
  useWebsiteTitle(t("register"));

  const setLang = (lang: Lang) => {
    i18n.changeLanguage(lang);
  };

  const register = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      console.log(registerData);

      const res = await apiJson.post("users/register", registerData);
      console.log("Response:", res.data);
    } catch (err: any) {
      console.error("Error:", err.response?.data || err.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.overlay}></div>
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
          <form onSubmit={register}>
            <label className={styles.label}>{t("email")}</label>
            <input
              type="email"
              id="email"
              placeholder={t("email")}
              className={`${styles.input} form-control`}
              onChange={(e) =>
                setRegisterData({ ...registerData, email: e.target.value })
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
                setRegisterData({ ...registerData, password: e.target.value })
              }
            />

            <label className={styles.label}>{t("confirm-password")}</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder={t("confirm-password")}
              className={`${styles.input} form-control`}
              onChange={(e) =>
                setRegisterData({
                  ...registerData,
                  repeat_password: e.target.value,
                })
              }
            />

            <label className={styles.label}>{t("name")}</label>
            <input
              type="text"
              id="firstname"
              placeholder={t("name")}
              className={`${styles.input} form-control`}
              onChange={(e) =>
                setRegisterData({ ...registerData, firstname: e.target.value })
              }
            />

            <label className={styles.label}>{`${t("last-name")}(${t(
              "not-required"
            )})`}</label>
            <input
              type="text"
              id="lastname"
              placeholder={t("last-name")}
              className={`${styles.input} form-control`}
              onChange={(e) =>
                setRegisterData({ ...registerData, lastname: e.target.value })
              }
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
