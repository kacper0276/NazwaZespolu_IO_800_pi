import React, { useState, useEffect } from "react";
import styles from "./TreeDetailsModal.module.scss";
import ImageModal from "../ImageModal/ImageModal";
import PlaceholderPhoto from "../../../assets/images/MeadowBG/MeadowBG.png";
import { GoalType } from "../../../types/IGoal";
import { calculatePercentage } from "../../../helpers/calculatePercentage";
import { GoalUpdateType } from "../../../types/IGoalUpdate";
import { useApiJson } from "../../../config/api";
import { ApiResponse } from "../../../types/api.types";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import Spinner from "../../Spinner/Spinner";

//Placeholders for updates
interface Update {
  id: string;
  date: string;
  content: string;
  author: string;
  imageUrl?: string;
}

interface TreeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenge: GoalType | null;
  getTreeImage: (difficulty: string, treeSkin: string) => string;
}

const TreeDetailModal: React.FC<TreeDetailModalProps> = ({
  isOpen,
  onClose,
  challenge,
  getTreeImage,
}) => {
  const { t } = useTranslation();
  const api = useApiJson();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [goalUpdates, setGoalUpdates] = useState<GoalUpdateType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getDurationInDays = () => {
    const start = new Date(challenge?.startDate ?? "");
    const end = new Date(challenge?.endDate ?? "");
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const staticUpdates: Update[] = [
    {
      id: "1",
      date: "2024-01-10",
      content: "Challenge kickoff! Here's what you're working towards.",
      author: "Challenge Team",
      imageUrl: PlaceholderPhoto,
    },
    {
      id: "2",
      date: "2024-01-11",
      content: "First milestone reached! Keep up the great work.",
      author: "Challenge Team",
    },
    {
      id: "3",
      date: "2024-01-12",
      content: "Halfway point celebration - check out the progress!",
      author: "Challenge Team",
      imageUrl: PlaceholderPhoto,
    },
  ];

  const handleImageClick = (imageUrl: string | undefined) => {
    if (imageUrl) {
      setSelectedImage(imageUrl);
    }
  };

  if (!isOpen || !challenge) {
    return null;
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

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

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // useEffect(() => {
  //   console.log(challenge);

  // }, []);
  return (
    <>
      <div className={styles.modalOverlay} onClick={onClose}>
        <div
          className={styles.modalContainer}
          onClick={(e) => e.stopPropagation()}
        >
          <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>

          <div className={styles.modalBody}>
            <div className={styles.imageSection}>
              <img
                src={getTreeImage(challenge.difficulty, challenge.treeSkin)}
                alt={challenge.name}
                className={styles.treeImage}
              />
            </div>

            <div className={styles.challengeDetails}>
              <h2 className={styles.challengeTitle}>{challenge.name}</h2>
              <div className={styles.challengeDurationInfo}>
                <p className={styles.challengeDuration}>
                  {new Date(challenge.startDate).toLocaleDateString()} -{" "}
                  {new Date(challenge.endDate).toLocaleDateString()}
                </p>
                <p className={styles.durationDays}>
                  Duration: {getDurationInDays()} days
                </p>
              </div>

              <div className={styles.challengeTypeInfo}>
                <span className={styles.difficultyBadge}>
                  {challenge.difficulty}
                </span>
                <span className={styles.skinBadge}>
                  {challenge.treeSkin === "StandardSkin"
                    ? "Standard"
                    : "Premium"}{" "}
                  Tree
                </span>
              </div>

              <div className={styles.progressSection}>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{
                      width: `${calculatePercentage(
                        challenge.startDate + "",
                        challenge.endDate + ""
                      )}%`,
                    }}
                  ></div>
                </div>
                <span className={styles.progressText}>
                  {calculatePercentage(
                    challenge.startDate + "",
                    challenge.endDate + ""
                  )}
                  % Complete
                </span>
              </div>

              <div
                className={`${styles.challengeDescription} ${
                  challenge.description.length <= 150 ? styles.short : ""
                }`}
              >
                {challenge.description}
              </div>

              <div className={styles.updatesSection}>
                <h3 className={styles.updatesHeader}>Challenge Updates</h3>
                <div className={styles.updatesList}>
                  {loading ? (
                    <Spinner />
                  ) : (
                    goalUpdates.map((update, index) => (
                      <div key={index} className={styles.updateItem}>
                        <div className={styles.updateHeader}>
                          <span className={styles.updateDate}>
                            {new Date(update.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className={styles.updateContent}>{update.message}</p>
                        {update.filename && (
                          <div className={styles.updateImageContainer}>
                            <img
                              src={`/goalsUpdateImg/${update.filename}`}
                              alt="Update"
                              className={styles.updateImage}
                              onClick={() =>
                                handleImageClick(
                                  `/goalsUpdateImg/${update.filename}`
                                )
                              }
                            />
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
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

export default TreeDetailModal;
