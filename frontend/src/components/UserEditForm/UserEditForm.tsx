import { FC, useState } from "react";
import { UserType } from "../../types/IUser";
import styles from "./UserEditForm.module.scss";

interface UserFormProps {
  user: UserType;
  onSave: (user: UserType) => void;
  onCancel: () => void;
}

const UserEditForm: FC<UserFormProps> = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState<UserType>({ ...user });

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
      <label>
        Email:
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
        />
      </label>
      <label>
        First Name:
        <input
          type="text"
          value={formData.firstname ?? ""}
          onChange={(e) => handleInputChange("firstname", e.target.value)}
        />
      </label>
      <label>
        Last Name:
        <input
          type="text"
          value={formData.lastname ?? ""}
          onChange={(e) => handleInputChange("lastname", e.target.value)}
        />
      </label>
      <label>
        Role:
        <input
          type="text"
          value={formData.role}
          onChange={(e) => handleInputChange("role", e.target.value)}
        />
      </label>
      <label>
        Is Activated:
        <input
          type="checkbox"
          checked={formData.isActivated}
          onChange={(e) => handleInputChange("isActivated", e.target.checked)}
        />
      </label>
      <div className={styles.formActions}>
        <button type="button" onClick={handleSubmit}>
          Save
        </button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default UserEditForm;
