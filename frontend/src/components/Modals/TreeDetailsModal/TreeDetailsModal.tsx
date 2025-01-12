import React, { useState, useEffect } from "react";
import styles from "./TreeDetailsModal.module.scss";
import ImageModal from "../ImageModal/ImageModal";
import PlaceholderPhoto from "../../../assets/images/MeadowBG/MeadowBG.png";

//Placeholders for updates
interface Update {
  id: string;
  date: string;
  content: string;
  author: string;
  imageUrl?: string;
}

interface Challenge {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  difficulty: string;
  treeSkin: string;
  progress: number;
}

interface TreeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenge: Challenge | null;
  getTreeImage: (difficulty: string, treeSkin: string) => string;
}

const TreeDetailModal: React.FC<TreeDetailModalProps> = ({
  isOpen,
  onClose,
  challenge,
  getTreeImage,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleImageClick = (imageUrl: string | undefined) => {
    if (imageUrl) {
      setSelectedImage(imageUrl);
    }
  };

  if (!isOpen || !challenge) {
    return null;
  }

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
                    style={{ width: `${challenge.progress}%` }}
                  ></div>
                </div>
                <span className={styles.progressText}>
                  {challenge.progress}% Complete
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
                  {staticUpdates.map((update) => (
                    <div key={update.id} className={styles.updateItem}>
                      <div className={styles.updateHeader}>
                        <span className={styles.updateAuthor}>
                          {update.author}
                        </span>
                        <span className={styles.updateDate}>
                          {new Date(update.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className={styles.updateContent}>{update.content}</p>
                      {update.imageUrl && (
                        <div className={styles.updateImageContainer}>
                          <img
                            src={update.imageUrl}
                            alt="Update"
                            className={styles.updateImage}
                            onClick={() => handleImageClick(update.imageUrl)}
                          />
                        </div>
                      )}
                    </div>
                  ))}
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
