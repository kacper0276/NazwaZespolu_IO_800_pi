import { FC, useState } from "react";
import { UserType } from "../../types/IUser";
import styles from "./UserEditForm.module.scss";

interface UserFormProps {
  user: UserType;
  onSave: (user: UserType) => void;
  onCancel: () => void;
}

const UserEditForm: FC<UserFormProps> = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState<UserType>({ ...user, password: "" });

  const handleInputChange = (
    field: keyof UserType,
    value: string | boolean | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <form className={styles.form}>
      <label className={styles.label}>
        Email:
        <input
          className={styles.input}
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
        />
      </label>
      <label className={styles.label}>
        Password:
        <input
          className={styles.input}
          type="text"
          value={formData.password}
          onChange={(e) => handleInputChange("password", e.target.value)}
        />
      </label>
      <label className={styles.label}>
        First Name:
        <input
          className={styles.input}
          type="text"
          value={formData.firstname ?? ""}
          onChange={(e) => handleInputChange("firstname", e.target.value)}
        />
      </label>
      <label className={styles.label}>
        Last Name:
        <input
          className={styles.input}
          type="text"
          value={formData.lastname ?? ""}
          onChange={(e) => handleInputChange("lastname", e.target.value)}
        />
      </label>
      <label className={styles.label}>
        Role:
        <select
          className={styles.select}
          value={formData.role}
          onChange={(e) => handleInputChange("role", e.target.value)}
        >
          <option value="admin">Admin</option>
          <option value="user">User</option>
          <option value="moderator">Moderator</option>
        </select>
      </label>
      <label className={styles.label}>
        Is Activated:
        <input
          className={styles.checkbox}
          type="checkbox"
          checked={formData.isActivated}
          onChange={(e) => handleInputChange("isActivated", e.target.checked)}
        />
      </label>
      <div className={styles.formActions}>
        <button
          className={`${styles.button} ${styles.saveButton}`}
          type="button"
          onClick={handleSubmit}
        >
          Save
        </button>
        <button
          className={`${styles.button} ${styles.cancelButton}`}
          type="button"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default UserEditForm;
