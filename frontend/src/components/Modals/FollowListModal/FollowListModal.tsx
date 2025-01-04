import React, { useState, useEffect } from "react";
import styles from "./FollowListModal.module.scss";
import "bootstrap/dist/css/bootstrap.min.css";

interface User {
  id: number;
  name: string;
  avatar: string;
}

interface FollowListModalProps {
  isOpen: boolean;
  onClose: () => void;
  listType: "followers" | "following"; // Określa typ listy
}

const FollowListModal: React.FC<FollowListModalProps> = ({
  isOpen,
  onClose,
  listType,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  const DEFAULT_AVATAR_URL =
    "https://media.istockphoto.com/id/1327592506/pl/wektor/domy%C5%9Blna-ikona-symbolu-zast%C4%99pczego-zdj%C4%99cia-awatara-szare-zdj%C4%99cie-profilowe-cz%C5%82owiek-biznesu.webp?s=2048x2048&w=is&k=20&c=QzrDx-OsmsBkP3pB68zVo53u1cyxI5jeq2R5W4sV3fQ=";

  const followers: User[] = [
    { id: 1, name: "Anna Kowalska", avatar: DEFAULT_AVATAR_URL },
    { id: 2, name: "Jan Nowak", avatar: DEFAULT_AVATAR_URL },
    { id: 3, name: "Tomasz Lewandowski", avatar: DEFAULT_AVATAR_URL },
    { id: 4, name: "Anna Kowalska", avatar: DEFAULT_AVATAR_URL },
    { id: 5, name: "Jan Nowak", avatar: DEFAULT_AVATAR_URL },
    { id: 6, name: "Tomasz Lewandowski", avatar: DEFAULT_AVATAR_URL },
    { id: 7, name: "Anna Kowalska", avatar: DEFAULT_AVATAR_URL },
    { id: 8, name: "Jan Nowak", avatar: DEFAULT_AVATAR_URL },
    { id: 9, name: "Tomasz Lewandowski", avatar: DEFAULT_AVATAR_URL },
  ];

  const following: User[] = [
    { id: 10, name: "Alicja Kwiatkowska", avatar: DEFAULT_AVATAR_URL },
    { id: 11, name: "Michał Zieliński", avatar: DEFAULT_AVATAR_URL },
    { id: 12, name: "Kasia Malinowska", avatar: DEFAULT_AVATAR_URL },
    { id: 13, name: "Alicja Kwiatkowska", avatar: DEFAULT_AVATAR_URL },
    { id: 14, name: "Michał Zieliński", avatar: DEFAULT_AVATAR_URL },
    { id: 15, name: "Kasia Malinowska", avatar: DEFAULT_AVATAR_URL },
    { id: 16, name: "Alicja Kwiatkowska", avatar: DEFAULT_AVATAR_URL },
    { id: 17, name: "Michał Zieliński", avatar: DEFAULT_AVATAR_URL },
    { id: 18, name: "Kasia Malinowska", avatar: DEFAULT_AVATAR_URL },
    
  ];

  const users = listType === "followers" ? followers : following;

  useEffect(() => {
    setFilteredUsers(
      users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, users]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
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
          <ul className={styles.userList}>
            {filteredUsers.map((user) => (
              <li key={user.id} className={styles.userItem}>
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className={styles.avatar}
                />
                {user.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FollowListModal;
