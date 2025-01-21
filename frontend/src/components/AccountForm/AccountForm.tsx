import { FC, useState, useEffect, useRef } from "react";
import { useUser } from "../../context/UserContext";
import styles from "./AccountForm.module.scss";
import { useApiMultipart } from "../../config/api";
import { useTranslation } from "react-i18next";
import useWebsiteTitle from "../../hooks/useWebsiteTitle";
import { ApiResponse } from "../../types/api.types";
import { UserType } from "../../types/IUser";
import ReactCrop, { Crop } from "react-image-crop";
import { toast } from "react-toastify";

const AccountForm: FC = () => {
  const { t } = useTranslation();
  useWebsiteTitle(t("edit-your-data"));
  const userContext = useUser();
  const api = useApiMultipart();

  const [formData, setFormData] = useState({
    email: userContext.user?.email || "",
    password: "",
    firstname: userContext.user?.firstname || "",
    lastname: userContext.user?.lastname || "",
  });

  // Profile image states
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

  // Background image states
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
    setFormData({
      email: userContext.user?.email || "",
      password: "",
      firstname: userContext.user?.firstname || "",
      lastname: userContext.user?.lastname || "",
    });
  }, [userContext.user]);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const formDataBody = new FormData();
    formDataBody.append("email", formData.email);
    formDataBody.append("firstname", formData.firstname);
    formDataBody.append("lastname", formData.lastname);
    if (formData.password) formDataBody.append("password", formData.password);

    if (completedProfileCrop && profileImageRef.current) {
      const croppedProfileBlob = await getCroppedProfileImage();
      if (croppedProfileBlob) {
        formDataBody.append("profileImage", croppedProfileBlob as Blob);
      }
    }

    if (completedBackgroundCrop && backgroundImageRef.current) {
      const croppedBackgroundBlob = await getCroppedBackgroundImage();
      if (croppedBackgroundBlob) {
        formDataBody.append("backgroundImage", croppedBackgroundBlob as Blob);
      }
    }

    try {
      const response = await api.put<ApiResponse<UserType>>(
        `users/${userContext.user?._id}`,
        formDataBody
      );

      if (response.status === 200 && response.data.data) {
        userContext.user = response.data.data;
        toast.success(t("profile-updated"));
      }
    } catch (error) {
      toast.error(t("error-updating-profile"));
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2>{t("account-settings")}</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="email">{t("email")}:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="password">{t("new-password")}:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder={t("enter-new-password")}
            className={styles.input}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="firstname">{t("name")}:</label>
          <input
            type="text"
            id="firstname"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            className={styles.input}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="lastname">{t("last-name")}:</label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.imageGroup}>
          <label>{t("profile-image")}:</label>
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

        <div className={styles.imageGroup}>
          <label>{t("background-image")}:</label>
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

        <button type="submit" className={styles.submitButton}>
          {t("save-changes")}
        </button>
      </form>
    </div>
  );
};

export default AccountForm;
