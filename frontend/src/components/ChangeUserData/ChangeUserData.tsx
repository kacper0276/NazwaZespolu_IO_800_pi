import { FC, useEffect, useState, useRef } from "react";
import styles from "./ChangeUserData.module.scss";
import { UserType } from "../../types/IUser";
import { useApiMultipart } from "../../config/api";
import { ApiResponse } from "../../types/api.types";
import Spinner from "../Spinner/Spinner";
import Modal from "../Modals/Modal/Modal";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const ChangeUserData: FC = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);

  // Image cropping states
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

  // Form states
  const [formData, setFormData] = useState({
    email: "",
    firstname: "",
    lastname: "",
    role: "",
  });

  const api = useApiMultipart();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await api.get<ApiResponse<UserType[]>>("users/all");
        setUsers(res.data.data ?? []);
      } catch (_err) {
        toast.error(t("error-fetching-users"));
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

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

    const x = (width - cropWidth) / 2;
    const y = (height - cropHeight) / 2;

    setBackgroundCrop({
      unit: "px",
      width: cropWidth,
      height: cropHeight,
      x,
      y,
    });

    backgroundImageRef.current = e.currentTarget;
  };

  const handleEdit = (user: UserType) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      firstname: user.firstname || "",
      lastname: user.lastname || "",
      role: user.role,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (userId: string) => {
    setLoading(true);
    try {
      const response = await api.delete<ApiResponse<null>>(`users/${userId}`);
      toast.success(t(response.data.message));
      setUsers((prev) => prev.filter((user) => user._id !== userId));
    } catch (err: any) {
      toast.error(t(err.response?.data.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setProfileImage(null);
    setBackgroundImage(null);
    setFormData({
      email: "",
      firstname: "",
      lastname: "",
      role: "",
    });
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "profile" | "background"
  ) => {
    if (e.target.files?.[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        if (type === "profile") {
          setProfileImage(reader.result as string);
        } else {
          setBackgroundImage(reader.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const getCroppedProfileImage = (): Promise<Blob | null> => {
    if (
      !completedProfileCrop ||
      !profileImageRef.current ||
      !profilePreviewCanvasRef.current
    )
      return Promise.resolve(null);

    const canvas = document.createElement("canvas");
    const image = profileImageRef.current;
    const crop = completedProfileCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = 150;
    canvas.height = 150;

    const ctx = canvas.getContext("2d");
    if (!ctx) return Promise.resolve(null);

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

  const getCroppedBackgroundImage = (): Promise<Blob | null> => {
    if (
      !completedBackgroundCrop ||
      !backgroundImageRef.current ||
      !backgroundPreviewCanvasRef.current
    )
      return Promise.resolve(null);

    const canvas = document.createElement("canvas");
    const image = backgroundImageRef.current;
    const crop = completedBackgroundCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = 1140;
    canvas.height = 200;

    const ctx = canvas.getContext("2d");
    if (!ctx) return Promise.resolve(null);

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

  const handleSave = async () => {
    if (!editingUser) return;

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("email", formData.email);
      formDataToSend.append("firstname", formData.firstname);
      formDataToSend.append("lastname", formData.lastname);
      formDataToSend.append("role", formData.role);

      if (profileImage) {
        const profileBlob = await getCroppedProfileImage();
        if (profileBlob) {
          formDataToSend.append("profileImage", profileBlob);
        }
      }

      if (backgroundImage) {
        const backgroundBlob = await getCroppedBackgroundImage();
        if (backgroundBlob) {
          formDataToSend.append("backgroundImage", backgroundBlob);
        }
      }

      const response = await api.put<ApiResponse<UserType>>(
        `users/${editingUser._id}`,
        formDataToSend
      );

      setUsers((prev) =>
        prev
          .map((user) =>
            user._id === editingUser._id ? response.data.data : user
          )
          .filter((user): user is UserType => user !== undefined)
      );

      toast.success(t(response.data.message));
      handleModalClose();
    } catch (err: any) {
      toast.error(t(err.response?.data.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.mainContainer}>
      <h1 className={styles.header}>{t("users-management")}</h1>
      {loading && <Spinner />}

      <table className={styles.table}>
        <thead className={styles.tableHead}>
          <tr className={styles.tableRow}>
            <th className={styles.tableHeader}>{t("email")}</th>
            <th className={styles.tableHeader}>{t("first-name")}</th>
            <th className={styles.tableHeader}>{t("last-name")}</th>
            <th className={styles.tableHeader}>{t("role")}</th>
            <th className={styles.tableHeader}>{t("actions")}</th>
          </tr>
        </thead>
        <tbody className={styles.tableBody}>
          {users.map((user) => (
            <tr key={user._id} className={styles.tableRow}>
              <td className={styles.tableCell}>{user.email}</td>
              <td className={styles.tableCell}>{user.firstname}</td>
              <td className={styles.tableCell}>{user.lastname}</td>
              <td className={styles.tableCell}>{user.role}</td>
              <td className={styles.tableActions}>
                <button
                  className={`${styles.button} ${styles.editButton}`}
                  onClick={() => handleEdit(user)}
                >
                  {t("edit")}
                </button>
                <button
                  className={`${styles.button} ${styles.deleteButton}`}
                  onClick={() => handleDelete(user._id)}
                >
                  {t("delete")}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && editingUser && (
        <Modal onClose={handleModalClose}>
          <div className={styles.modalContainer}>
            <h2 className={styles.modalTitle}>{t("edit-user")}</h2>
            <form className={styles.form}>
              <div className={styles.formGroup}>
                <label>{t("email")}</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div className={styles.formGroup}>
                <label>{t("first-name")}</label>
                <input
                  type="text"
                  value={formData.firstname}
                  onChange={(e) =>
                    setFormData({ ...formData, firstname: e.target.value })
                  }
                />
              </div>

              <div className={styles.formGroup}>
                <label>{t("last-name")}</label>
                <input
                  type="text"
                  value={formData.lastname}
                  onChange={(e) =>setFormData({ ...formData, lastname: e.target.value })
                }
              />
            </div>

            <div className={styles.formGroup}>
              <label>{t("role")}</label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              />
            </div>

            <div className={styles.formGroup}>
              <label>{t("profile-image")}</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "profile")}
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
                onChange={(e) => handleFileChange(e, "background")}
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
                onClick={handleModalClose}
                className={styles.cancelButton}
              >
                {t("cancel")}
              </button>
              <button
                type="button"
                onClick={handleSave}
                className={styles.saveButton}
              >
                {t("save-changes")}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    )}
  </div>
);
};

export default ChangeUserData;