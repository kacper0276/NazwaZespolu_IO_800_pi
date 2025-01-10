import { FC, useEffect, useState } from "react";
import styles from "./ChangeUserData.module.scss";
import { UserType } from "../../types/IUser";
import { useApiMultipart } from "../../config/api";
import { ApiResponse } from "../../types/api.types";
import Spinner from "../Spinner/Spinner";
import Modal from "../Modals/Modal/Modal";
import UserEditForm from "../UserEditForm/UserEditForm";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const ChangeUserData: FC = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);

  const api = useApiMultipart();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);

      api
        .get<ApiResponse<UserType[]>>("users/all")
        .then((res) => {
          setUsers(res.data.data ?? []);
        })
        .catch((_err) => {
          toast.error(t("error-fetching-users"));
        })
        .finally(() => {
          setLoading(false);
        });
    };

    fetchUsers();
  }, []);

  const handleEdit = (user: UserType) => {
    setEditingUser(user);
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
  };

  const handleSave = async (
    updatedUser: UserType,
    profileImage?: File,
    backgroundImage?: File
  ) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("email", updatedUser.email);
      formData.append("firstname", updatedUser.firstname ?? "");
      formData.append("lastname", updatedUser.lastname ?? "");
      formData.append("role", updatedUser.role);
      if (profileImage) formData.append("profileImage", profileImage);
      if (backgroundImage) formData.append("backgroundImage", backgroundImage);

      const response = await api.put<ApiResponse<UserType>>(
        `users/${updatedUser._id}`,
        formData
      );

      setUsers((prev) =>
        prev
          .map((user) =>
            user._id === updatedUser._id ? response.data.data : user
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
      <h1 className={styles.header}>Users Management</h1>
      {loading && <Spinner />}

      <table className={styles.table}>
        <thead className={styles.tableHead}>
          <tr className={styles.tableRow}>
            <th className={styles.tableHeader}>Email</th>
            <th className={styles.tableHeader}>First Name</th>
            <th className={styles.tableHeader}>Last Name</th>
            <th className={styles.tableHeader}>Role</th>
            <th className={styles.tableHeader}>Actions</th>
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
                  Edit
                </button>
                <button
                  className={`${styles.button} ${styles.deleteButton}`}
                  onClick={() => handleDelete(user._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && editingUser && (
        <Modal onClose={handleModalClose}>
          <UserEditForm
            user={editingUser}
            onSave={handleSave}
            onCancel={handleModalClose}
          />
        </Modal>
      )}
    </div>
  );
};

export default ChangeUserData;
