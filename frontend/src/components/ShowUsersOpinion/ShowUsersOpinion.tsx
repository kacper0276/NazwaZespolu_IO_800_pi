import { FC, useEffect, useState } from "react";
import styles from "./ShowUsersOpinion.module.scss";
import { Opinion } from "../../types/IOpinion";
import { useApiJson } from "../../config/api";
import { ApiResponse } from "../../types/api.types";
import Spinner from "../Spinner/Spinner";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const ShowUsersOpinion: FC = () => {
  const api = useApiJson();
  const { t } = useTranslation();
  const [opinions, setOpinions] = useState<Opinion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchOpinions = () => {
      setLoading(true);
      api
        .get<ApiResponse<Opinion[]>>("opinions/all-active")
        .then((res) => {
          setOpinions(res.data.data ?? []);
        })
        .catch((_err) => {
          toast.error(t("error-fetching-users"));
        })
        .finally(() => {
          setLoading(false);
        });
    };

    fetchOpinions();
  }, []);

  const handleCloseOpinion = (opinionId: string) => {
    setLoading(true);
    api
      .put<ApiResponse<null>>(`opinions/close/${opinionId}`, {})
      .then(() => {
        toast.success(t("opinion-closed"));
        setOpinions((prevOpinions) =>
          prevOpinions.map((opinion) =>
            opinion._id === opinionId ? { ...opinion, closed: true } : opinion
          )
        );
      })
      .catch(() => toast.error(t("error-closing-opinion")))
      .finally(() => setLoading(false));
  };

  const handleDeleteOpinion = (opinionId: string) => {
    setLoading(true);
    api
      .delete<ApiResponse<null>>(`opinions/${opinionId}`)
      .then(() => {
        toast.success(t("opinion-deleted"));
        setOpinions((prevOpinions) =>
          prevOpinions.filter((opinion) => opinion._id !== opinionId)
        );
      })
      .catch(() => toast.error(t("error-deleting-opinion")))
      .finally(() => setLoading(false));
  };

  return (
    <div className={styles.mainContainer}>
      {loading && <Spinner />}

      <h2>{t("users-opinions")}</h2>

      {!loading && opinions.length === 0 && (
        <p>{t("no-opinions-to-display")}.</p>
      )}

      {!loading && opinions.length > 0 && (
        <table className={styles.opinionsTable}>
          <thead>
            <tr>
              <th>{t("email")}</th>
              <th>{t("role")}</th>
              <th>{t("rating")}</th>
              <th>{t("opinion")}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {opinions.map((opinion, index) => (
              <tr key={index}>
                <td>{opinion.user.email}</td>
                <td>{opinion.user.role}</td>
                <td>{opinion.rating}</td>
                <td>{opinion.opinion}</td>
                <td>
                  <div>
                    <label>
                      <input
                        type="checkbox"
                        checked={opinion.closed}
                        onChange={() => handleCloseOpinion(opinion._id)}
                      />
                      {t("close-opinion")}
                    </label>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDeleteOpinion(opinion._id)}
                    >
                      {t("delete-opinion")}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ShowUsersOpinion;
