import React, { useState, useEffect } from "react";
import styles from "./ChallengeDetailsModal.module.scss";
import ImageModal from "../../Modals/ImageModal/ImageModal";
import { useNavigate } from "react-router-dom";
import { GoalType } from "../../../types/IGoal";
import { convertIsoToLocal } from "../../../helpers/convertDate";

type ChallengeDetailsModalProps = {
  challenge: GoalType | null;
  onClose: () => void;
  onAddUpdateClick?: () => void;
};

const ChallengeDetailsModal: React.FC<ChallengeDetailsModalProps> = ({
  challenge,
  onClose,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/challenge-note");
  };

  return (
    <>
      <div className={styles.modalOverlay}>
        <div className={styles.modalContainer}>
          <button className={styles.closeBtn} onClick={onClose}>
            &times;
          </button>
          <h2 className={styles.modalTitle}>{challenge.name}</h2>
          <span className={styles.modalLabel}>Opis:</span>
          <p className={styles.modalText} style={{ maxHeight: "4.5rem", overflow: "auto" }}>
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
            {challenge.tags.join(", ")}
          </p>

          <div className={styles.updateSection}>
            <h3 className={styles.modalTitle}>Codzienne aktualizacje:</h3>
            <button className={styles.addUpdateBtn} onClick={handleButtonClick}>
              Dodaj nową aktualizację
            </button>

            <ul className={styles.updateList}>
              {challenge.updates.map((update, index) => (
                <li key={index}>
                  <div className={styles.updateContainer}>
                    <p>{update.text}</p>
                    {update.image && (
                      <div className={styles.imageWrapper}>
                        <img
                          src={update.image}
                          alt="Update visual"
                          onClick={() =>
                            update.image && setSelectedImage(update.image)
                          }
                          className={styles.modalImage}
                        />
                      </div>
                    )}
                  </div>
                </li>
              ))}
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
