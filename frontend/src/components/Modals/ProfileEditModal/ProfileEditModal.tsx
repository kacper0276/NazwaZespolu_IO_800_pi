import React, { useState, useRef, useEffect } from "react";
import { useApiMultipart } from "../../../config/api";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import ReactCrop, { Crop } from "react-image-crop";
import styles from "./ProfileEditModal.module.scss";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDescription: string;
  currentProfileImage?: string;
  currentBackgroundImage?: string;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  currentDescription,
}) => {
  if (!isOpen) return null;

  const { t } = useTranslation();
  const api = useApiMultipart();
  const [description, setDescription] = useState(currentDescription);

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileCrop, setProfileCrop] = useState<Crop>({
    unit: "%",
    width: 100,
    x: 0,
    y: 0,
    height: 100,
  });
  const [completedProfileCrop, setCompletedProfileCrop] = useState<Crop | null>(
    null
  );
  const profileImageRef = useRef<HTMLImageElement | null>(null);
  const profilePreviewCanvasRef = useRef<HTMLCanvasElement>(null);

  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [backgroundCrop, setBackgroundCrop] = useState<Crop>({
    unit: "%",
    width: 100,
    x: 0,
    y: 0,
    height: 100,
  });
  const [completedBackgroundCrop, setCompletedBackgroundCrop] =
    useState<Crop | null>(null);
  const backgroundImageRef = useRef<HTMLImageElement | null>(null);
  const backgroundPreviewCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (
      completedProfileCrop &&
      profileImageRef.current &&
      profilePreviewCanvasRef.current
    ) {
      updateProfilePreviewCanvas(
        profileImageRef.current,
        profilePreviewCanvasRef.current,
        completedProfileCrop
      );
    }
  }, [completedProfileCrop]);

  useEffect(() => {
    if (
      completedBackgroundCrop &&
      backgroundImageRef.current &&
      backgroundPreviewCanvasRef.current
    ) {
      updateBackgroundPreviewCanvas(
        backgroundImageRef.current,
        backgroundPreviewCanvasRef.current,
        completedBackgroundCrop
      );
    }
  }, [completedBackgroundCrop]);

  const updateProfilePreviewCanvas = (
    image: HTMLImageElement,
    canvas: HTMLCanvasElement,
    crop: Crop
  ) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 150;
    canvas.width = size;
    canvas.height = size;

    ctx.clearRect(0, 0, size, size);

    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.clip();

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const cropX = crop.x * scaleX;
    const cropY = crop.y * scaleY;
    const cropWidth = crop.width * scaleX;
    const cropHeight = crop.height * scaleY;

    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(image, cropX, cropY, cropWidth, cropHeight, 0, 0, size, size);
  };

  const updateBackgroundPreviewCanvas = (
    image: HTMLImageElement,
    canvas: HTMLCanvasElement,
    crop: Crop
  ) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = 570;
    canvas.height = 100;

    ctx.imageSmoothingQuality = "high";

    const cropX = crop.x * scaleX;
    const cropY = crop.y * scaleY;
    const cropWidth = crop.width * scaleX;
    const cropHeight = crop.height * scaleY;

    ctx.drawImage(image, cropX, cropY, cropWidth, cropHeight, 0, 0, 570, 100);
  };

  const onProfileImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const cropSize = Math.min(width, height);
    const x = (width - cropSize) / 2;
    const y = (height - cropSize) / 2;

    setProfileCrop({
      unit: "px",
      width: cropSize,
      height: cropSize,
      x,
      y,
    });

    profileImageRef.current = e.currentTarget;
  };

  const onBackgroundImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;

    const targetAspect = 1140 / 200;
    let cropWidth = width;
    let cropHeight = width / targetAspect;

    if (cropHeight > height) {
      cropHeight = height;
      cropWidth = height * targetAspect;
    }

    const cropWidthInPercent = (100 * cropWidth) / width;
    const cropHeightInPercent = (100 * cropHeight) / height;

    setBackgroundCrop({
      unit: "%",
      width: cropWidthInPercent,
      height: cropHeightInPercent,
      x: (100 - cropWidthInPercent) / 2,
      y: (100 - cropHeightInPercent) / 2,
    });

    backgroundImageRef.current = e.currentTarget;
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleBackgroundImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files?.[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        setBackgroundImage(reader.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const getCroppedProfileImage = () => {
    if (
      !completedProfileCrop ||
      !profileImageRef.current ||
      !profilePreviewCanvasRef.current
    )
      return null;

    const canvas = document.createElement("canvas");
    const image = profileImageRef.current;
    const crop = completedProfileCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = 150;
    canvas.height = 150;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.beginPath();
    ctx.arc(75, 75, 75, 0, Math.PI * 2);
    ctx.clip();

    const cropX = crop.x * scaleX;
    const cropY = crop.y * scaleY;
    const cropWidth = crop.width * scaleX;
    const cropHeight = crop.height * scaleY;

    ctx.drawImage(image, cropX, cropY, cropWidth, cropHeight, 0, 0, 150, 150);

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        "image/jpeg",
        1
      );
    });
  };

  const getCroppedBackgroundImage = () => {
    if (
      !completedBackgroundCrop ||
      !backgroundImageRef.current ||
      !backgroundPreviewCanvasRef.current
    )
      return null;

    const canvas = document.createElement("canvas");
    const image = backgroundImageRef.current;
    const crop = completedBackgroundCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = 1140;
    canvas.height = 200;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const cropX = crop.x * scaleX;
    const cropY = crop.y * scaleY;
    const cropWidth = crop.width * scaleX;
    const cropHeight = crop.height * scaleY;

    ctx.drawImage(image, cropX, cropY, cropWidth, cropHeight, 0, 0, 1140, 200);

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        "image/jpeg",
        1
      );
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("description", description);

    if (completedProfileCrop && profileImageRef.current) {
      const croppedProfileBlob = await getCroppedProfileImage();
      if (croppedProfileBlob) {
        formData.append("profileImage", croppedProfileBlob as Blob);
      }
    }

    if (completedBackgroundCrop && backgroundImageRef.current) {
      const croppedBackgroundBlob = await getCroppedBackgroundImage();
      if (croppedBackgroundBlob) {
        formData.append("backgroundImage", croppedBackgroundBlob as Blob);
      }
    }

    // TODO: Szybko endpoint na aktualizację profilu
    try {
      await api.patch("endpoint", formData);
      toast.success(t("profile-updated"));
      onClose();
    } catch (error) {
      toast.error(t("error-updating-profile"));
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>{t("edit-profile")}</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>{t("profile-description")}</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("write-something-about-you")}
            />
          </div>

          <div className={styles.formGroup}>
            <label>{t("profile-image")}</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfileImageChange}
              className={styles.fileInput}
            />

            {profileImage && (
              <div className={styles.imageEditContainer}>
                <div className={styles.cropContainer}>
                  <ReactCrop
                    crop={profileCrop}
                    onChange={(percentCrop) => setProfileCrop(percentCrop)}
                    onComplete={(c) => setCompletedProfileCrop(c)}
                    circularCrop
                    aspect={1}
                  >
                    <img
                      ref={profileImageRef}
                      src={profileImage}
                      onLoad={onProfileImageLoad}
                      alt="Crop me"
                    />
                  </ReactCrop>
                </div>

                <div className={styles.previewContainer}>
                  <canvas
                    ref={profilePreviewCanvasRef}
                    className={styles.circularPreview}
                  />
                </div>
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>{t("background-image")}</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleBackgroundImageChange}
              className={styles.fileInput}
            />

            {backgroundImage && (
              <div className={styles.imageEditContainer}>
                <div className={styles.cropContainer}>
                  <ReactCrop
                    crop={backgroundCrop}
                    onChange={(percentCrop) => setBackgroundCrop(percentCrop)}
                    onComplete={(c) => setCompletedBackgroundCrop(c)}
                    aspect={1140 / 200}
                  >
                    <img
                      ref={backgroundImageRef}
                      src={backgroundImage}
                      onLoad={onBackgroundImageLoad}
                      alt="Crop me"
                    />
                  </ReactCrop>
                </div>

                <div className={styles.backgroundPreviewContainer}>
                  <canvas
                    ref={backgroundPreviewCanvasRef}
                    className={styles.backgroundPreview}
                  />
                </div>
              </div>
            )}
          </div>

          <div className={styles.buttonContainer}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              {t("cancel")}
            </button>
            <button type="submit" className={styles.saveButton}>
              {t("save-changes")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditModal;
