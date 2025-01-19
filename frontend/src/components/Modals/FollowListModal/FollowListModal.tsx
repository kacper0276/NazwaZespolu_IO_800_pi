import React, { useState, useEffect, useMemo } from "react";
import styles from "./FollowListModal.module.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { UserType } from "../../../types/IUser";

interface FollowListModalProps {
  isOpen: boolean;
  onClose: () => void;
  listType: "followers" | "following"; // Określa typ listy
  users: {
    followers: UserType[];
    following: UserType[];
  };
}

const FollowListModal: React.FC<FollowListModalProps> = ({
  isOpen,
  onClose,
  listType,
  users,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);

  const userList = useMemo(
    () => (listType === "followers" ? users.followers : users.following),
    [listType, users]
  );

  useEffect(() => {
    setFilteredUsers(
      userList.filter((user) =>
        user.firstname?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, userList]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
      setSearchTerm(""); // Resetuje wyszukiwanie po zamknięciu modala
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.title}>
            {listType === "followers" ? "Obserwujący" : "Obserwowani"}
          </h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>
        <div className={styles.modalBody}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Wyszukaj użytkownika..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {filteredUsers.length === 0 ? (
            <p className={styles.noResults}>Nie znaleziono użytkowników.</p>
          ) : (
            <ul className={styles.userList}>
              {filteredUsers.map((user) => (
                <li key={user._id} className={styles.userItem}>
                  <img
                    src={`/profileImages/${user.profileImage}`}
                    alt="Avatar"
                    className={styles.avatar}
                  />
                  {user.firstname} {user.lastname}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowListModal;
