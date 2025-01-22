import React from "react";
import styles from "./ImageModal.module.scss";
import { useTranslation } from "react-i18next";

type ImageModalProps = {
  imageUrl: string;
  onClose: () => void;
};

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose }) => {
  const { t } = useTranslation();

  // Close modal when clicking outside the image
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.imageModalOverlay} onClick={handleOverlayClick}>
      <button className={styles.closeButton} onClick={onClose}>
        &times;
      </button>
      <div className={styles.imageContainer}>
        <img src={imageUrl} alt={t("full-size")} />
      </div>
    </div>
  );
};

export default ImageModal;
