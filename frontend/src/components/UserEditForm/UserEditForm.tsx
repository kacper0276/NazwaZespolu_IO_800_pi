import { FC, useState } from "react";
import { UserType } from "../../types/IUser";
import styles from "./UserEditForm.module.scss";
import { useTranslation } from "react-i18next";
import useWebsiteTitle from "../../hooks/useWebsiteTitle";

interface UserFormProps {
  user: UserType;
  onSave: (user: UserType, profileImage?: File, backgroundImage?: File) => void;
  onCancel: () => void;
}

const UserEditForm: FC<UserFormProps> = ({ user, onSave, onCancel }) => {
  const { t } = useTranslation();
  useWebsiteTitle(t("edit-user-data"));
  const [formData, setFormData] = useState<UserType>({ ...user, password: "" });
  const [profileImage, setProfileImage] = useState<File | undefined>(undefined);
  const [backgroundImage, setBackgroundImage] = useState<File | undefined>(
    undefined
  );

  const handleInputChange = (
    field: keyof UserType,
    value: string | boolean | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "profile" | "background"
  ) => {
    if (event.target.files) {
      const file = event.target.files[0];
      if (type === "profile") {
        setProfileImage(file);
      } else if (type === "background") {
        setBackgroundImage(file);
      }
    }
  };

  const handleSubmit = () => {
    onSave(formData, profileImage, backgroundImage);
  };

  return (
    <form className={styles.form}>
      <label className={styles.label}>
        {t("email")}:
        <input
          className={styles.input}
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
        />
      </label>
      <label className={styles.label}>
        {t("password")}:
        <input
          className={styles.input}
          type="text"
          value={formData.password}
          onChange={(e) => handleInputChange("password", e.target.value)}
        />
      </label>
      <label className={styles.label}>
        {t("name")}:
        <input
          className={styles.input}
          type="text"
          value={formData.firstname ?? ""}
          onChange={(e) => handleInputChange("firstname", e.target.value)}
        />
      </label>
      <label className={styles.label}>
        {t("last-name")}:
        <input
          className={styles.input}
          type="text"
          value={formData.lastname ?? ""}
          onChange={(e) => handleInputChange("lastname", e.target.value)}
        />
      </label>
      <label className={styles.label}>
        {t("role")}:
        <select
          className={styles.select}
          value={formData.role}
          onChange={(e) => handleInputChange("role", e.target.value)}
        >
          <option value="admin">{t("admin")}</option>
          <option value="user">{t("user")}</option>
          <option value="moderator">{t("moderator")}</option>
        </select>
      </label>
      <label className={styles.label}>
        {t("is-activated")}:
        <input
          className={styles.checkbox}
          type="checkbox"
          checked={formData.isActivated}
          onChange={(e) => handleInputChange("isActivated", e.target.checked)}
        />
      </label>
      <label className={styles.label}>
        {t("profile-image")}:
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e, "profile")}
        />
      </label>
      <label className={styles.label}>
        {t("background-image")}:
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e, "background")}
        />
      </label>
      <div className={styles.formActions}>
        <button
          className={`${styles.button} ${styles.saveButton}`}
          type="button"
          onClick={handleSubmit}
        >
          {t("save-changes")}
        </button>
        <button
          className={`${styles.button} ${styles.cancelButton}`}
          type="button"
          onClick={onCancel}
        >
          {t("cancel")}
        </button>
      </div>
    </form>
  );
};

export default UserEditForm;
