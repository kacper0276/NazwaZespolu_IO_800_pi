import { FC, useState } from "react";
import styles from "./ContactSupportForm.module.scss";
import { useUser } from "../../context/UserContext";
import { useApiJson } from "../../config/api";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { ApiResponse } from "../../types/api.types";
import { Opinion } from "../../types/IOpinion";
import useWebsiteTitle from "../../hooks/useWebsiteTitle";

const ContactSupportForm: FC = () => {
  const { t } = useTranslation();
  useWebsiteTitle(t("send-opinion"));
  const user = useUser();
  const api = useApiJson();
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [opinion, setOpinion] = useState<string>("");

  const handleRatingClick = (value: number) => {
    setRating(value);
  };

  const handleMouseEnter = (value: number) => {
    setHoverRating(value);
  };

  const handleMouseLeave = () => {
    setHoverRating(null);
  };

  const renderTrees = () => {
    const trees = [];
    for (let i = 1; i <= 5; i++) {
      const isActive = hoverRating ? i <= hoverRating : i <= rating;
      trees.push(
        <svg
          key={i}
          className={`${styles.tree} ${
            isActive ? styles.activeTree : styles.inactiveTree
          }`}
          onClick={() => handleRatingClick(i)}
          onMouseEnter={() => handleMouseEnter(i)}
          onMouseLeave={handleMouseLeave}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="32"
          height="32"
          fill={isActive ? "#2e7d32" : "#000"}
        >
          <path d="M12 2C10.343 2 9 3.343 9 5c0 .535.12 1.045.337 1.5H7.5C6.12 6.5 5 7.62 5 9s1.12 2.5 2.5 2.5H8v1H6.5C5.12 12.5 4 13.62 4 15s1.12 2.5 2.5 2.5H8v2h2v-2h4v2h2v-2h1.5c1.38 0 2.5-1.12 2.5-2.5s-1.12-2.5-2.5-2.5H16v-1h.5c1.38 0 2.5-1.12 2.5-2.5s-1.12-2.5-2.5-2.5h-1.837c.217-.455.337-.965.337-1.5 0-1.657-1.343-3-3-3z" />
        </svg>
      );
    }
    return trees;
  };

  const sendOpinion = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = {
      rating,
      opinion,
      user: user.user,
    };

    api
      .post<ApiResponse<Opinion>>("opinions", data)
      .then((res) => {
        toast.success(t(res.data.message));
      })
      .catch((err) => {
        toast.error(t(err.response?.data.message || err.message));
      });
  };

  return (
    <div className={styles.formContainer}>
      <h2>{t("send-us-your-opinion")}</h2>

      <form onSubmit={sendOpinion}>
        <textarea
          placeholder={`${t("share-your-thoughts")}...`}
          className={styles.textArea}
          onChange={(e) => setOpinion(e.target.value)}
        ></textarea>

        <div className={styles.ratingContainer}>{renderTrees()}</div>

        <button type="submit" className={styles.submitButton}>
          {t("send-opinion")}
        </button>
      </form>
    </div>
  );
};

export default ContactSupportForm;
