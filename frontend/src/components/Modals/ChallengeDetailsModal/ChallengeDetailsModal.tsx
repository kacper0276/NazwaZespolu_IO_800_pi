import React, { useState, useEffect } from "react";
import styles from "./ChallengeDetailsModal.module.scss";
import ImageModal from "../../Modals/ImageModal/ImageModal";
import { useNavigate } from "react-router-dom";
import { GoalType } from "../../../types/IGoal";
import { convertIsoToLocal } from "../../../helpers/convertDate";
import { GoalUpdateType } from "../../../types/IGoalUpdate";
import { useApiJson } from "../../../config/api";
import { ApiResponse } from "../../../types/api.types";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import Spinner from "../../Spinner/Spinner";

type ChallengeDetailsModalProps = {
  challenge: GoalType | null;
  onClose: () => void;
  onAddUpdateClick?: () => void;
};

const ChallengeDetailsModal: React.FC<ChallengeDetailsModalProps> = ({
  challenge,
  onClose,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const api = useApiJson();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [goalUpdates, setGoalUpdates] = useState<GoalUpdateType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Wyłączanie przewijania strony w tle
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (!challenge) return null;

  const calculateDaysLeft = (endDate: string) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculatePercentage = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();

    if (today < start) return 0;
    if (today > end) return 100;

    const totalTime = end.getTime() - start.getTime();
    const elapsedTime = today.getTime() - start.getTime();

    return Math.floor((elapsedTime / totalTime) * 100);
  };

  const handleButtonClick = () => {
    navigate(`/challenge-note/${challenge._id}`);
  };

  useEffect(() => {
    setLoading(true);
    api
      .get<ApiResponse<GoalUpdateType[]>>(`goal-updates/goal/${challenge._id}`)
      .then((res) => {
        setGoalUpdates(res.data.data ?? []);
      })
      .catch((_err) => {
        setLoading(false);
        toast.error(t("error-fetching-updates"));
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      <div className={styles.modalOverlay}>
        <div className={styles.modalContainer}>
          <button className={styles.closeBtn} onClick={onClose}>
            &times;
          </button>
          <h2 className={styles.modalTitle}>{challenge.name}</h2>
          <span className={styles.modalLabel}>Opis:</span>
          <p
            className={styles.modalText}
            style={{ maxHeight: "4.5rem", overflow: "auto" }}
          >
            {challenge.description}
          </p>

          <p className={styles.modalText}>
            <span className={styles.modalLabel}>Data rozpoczęcia:</span>{" "}
            {convertIsoToLocal(challenge.startDate + "")}
          </p>
          <p className={styles.modalText}>
            <span className={styles.modalLabel}>Data zakończenia:</span>{" "}
            {convertIsoToLocal(challenge.endDate + "")}
          </p>
          <p className={styles.modalText}>
            <span className={styles.modalLabel}>Dni do końca:</span>{" "}
            {calculateDaysLeft(challenge.endDate + "")}
          </p>
          <p className={styles.modalText}>
            <span className={styles.modalLabel}>Postęp:</span>{" "}
            {calculatePercentage(
              challenge.startDate + "",
              challenge.endDate + ""
            )}
            %
          </p>
          <p className={styles.modalText}>
          <span className={styles.modalLabel}>Tagi:</span>{" "}
          {challenge.tags.map((tag, index) => (
            <span key={index} className={styles.tag}>
              {tag}
            </span>
          ))}
        </p>

          <div className={styles.updateSection}>
            <h3 className={styles.modalTitle}>Codzienne aktualizacje:</h3>
            <button className={styles.addUpdateBtn} onClick={handleButtonClick}>
              Dodaj nową aktualizację
            </button>

            <ul className={styles.updateList}>
              {loading ? (
                <Spinner />
              ) : (
                goalUpdates.map((update, index) => (
                  <li key={index}>
                    <div className={styles.updateContainer}>
                      <p>{update.message}</p>
                      {update.filename && (
                        <div className={styles.imageWrapper}>
                          <img
                            src={`/goalsUpdateImg/${update.filename}`}
                            alt="Update visual"
                            onClick={() =>
                              update.filename &&
                              setSelectedImage(
                                `/goalsUpdateImg/${update.filename}`
                              )
                            }
                            className={styles.modalImage}
                          />
                        </div>
                      )}
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
      {selectedImage && (
        <ImageModal
          imageUrl={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </>
  );
};

export default ChallengeDetailsModal;
