import React, { useState } from "react";
import FollowListModal from "../../components/Modals/FollowListModal/FollowListModal";
import styles from "./ProfilePage.module.scss";

const photos = [
  {
    id: 1,
    src: "https://media.istockphoto.com/id/1317857006/pl/zdj%C4%99cie/pi%C4%99kny-zach%C3%B3d-s%C5%82o%C5%84ca-nad-morzem.webp?s=2048x2048&w=is&k=20&c=M4fsl8qGCgyYv_Y0LmkEao1iNMVS9Qqb0z2sgRLJ8W0=",
    alt: "Post 1",
  },
  {
    id: 2,
    src: "https://media.istockphoto.com/id/1255493335/pl/zdj%C4%99cie/nogi-kobiety-rozpryskiwaj%C4%85-wod%C4%99-na-pla%C5%BCy.jpg?s=2048x2048&w=is&k=20&c=LKYjEDw-llbgZQQYj4oFv4vvj-kW5AlBF2UMoZK4Nxw=",
    alt: "Post 2",
  },
  {
    id: 3,
    src: "https://plus.unsplash.com/premium_photo-1683865776032-07bf70b0add1?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Post 3",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1587691592099-24045742c181?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Post 4",
  },
];

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("posty");
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentListType, setCurrentListType] = useState<"followers" | "following">("followers");

  const openModal = (type: "followers" | "following") => {
    setCurrentListType(type);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const renderTabContent = () => {
    switch (activeTab) {
      case "posty":
        return (
          <div className={styles.photoGrid}>
            {photos.map((photo) => (
              <div key={photo.id} className={styles.photoItem}>
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className={styles.postImage}
                />
              </div>
            ))}
          </div>
        );
      case "wyzwania":
        return <div className={styles.placeholder}>Placeholder dla Wyzwań</div>;
      case "las":
        return <div className={styles.placeholder}>Placeholder dla Lasu</div>;
      default:
        return null;
    }
  };

  return (
    <div className={styles.pageBg}>
      <div className={styles.profilePage}>
        {/* Header Section */}
        <div className={styles.profileHeader}>
          <div className={styles.profileBackground}></div>
          <div className={styles.infoContainer}>
            <div className={styles.avatarContainer}>
              <div className={styles.avatar}>
                <img
                  src="https://media.istockphoto.com/id/1327592506/pl/wektor/domy%C5%9Blna-ikona-symbolu-zast%C4%99pczego-zdj%C4%99cia-awatara-szare-zdj%C4%99cie-profilowe-cz%C5%82owiek-biznesu.webp?s=2048x2048&w=is&k=20&c=QzrDx-OsmsBkP3pB68zVo53u1cyxI5jeq2R5W4sV3fQ="
                  alt="User Avatar"
                />
              </div>
            </div>
            <h1 className={styles.username}>Tomasz Milanowski</h1>
            <p className={styles.stats}>
              <span>
                <strong>845</strong> posty
              </span>
              <span
                onClick={() => openModal("followers")}
                role="button"
                className={styles.linkText}
              >
                <strong>70,8 tys.</strong> obserwujących
              </span>
              <span
                onClick={() => openModal("following")}
                role="button"
                className={styles.linkText}
              >
                <strong>21</strong> obserwowani
              </span>
            </p>
            <p className={styles.description}>
              Posty Tomka <br />
              Bardzo ładne
            </p>
          </div>
        </div>

        {/* Navigation */}
        <ul className={`nav nav-tabs ${styles.navTabs}`}>
          <li
            className={`nav-item d-flex justify-content-center ${styles.navItem}`}
            onClick={() => setActiveTab("posty")}
          >
            <a
              className={`nav-link ${styles.navLink} ${
                activeTab === "posty" ? styles.active : ""
              }`}
              href="#"
            >
              <i className={`bi bi-grid ${styles.icon}`}></i> Posty
            </a>
          </li>
          <li
            className={`nav-item d-flex justify-content-center ${styles.navItem}`}
            onClick={() => setActiveTab("wyzwania")}
          >
            <a
              className={`nav-link ${styles.navLink} ${
                activeTab === "wyzwania" ? styles.active : ""
              }`}
              href="#"
            >
              <i className={`${styles.icon} bi bi-trophy`}></i> Wyzwania
            </a>
          </li>
          <li
            className={`nav-item d-flex justify-content-center ${styles.navItem}`}
            onClick={() => setActiveTab("las")}
          >
            <a
              className={`nav-link ${styles.navLink} ${
                activeTab === "las" ? styles.active : ""
              }`}
              href="#"
            >
              <i className={`bi bi-tree ${styles.icon}`}></i> Las
            </a>
          </li>
        </ul>

        {/* Content Section */}
        <div className={styles.tabContent}>{renderTabContent()}</div>
      </div>

      {/* Modal */}
      <FollowListModal
        isOpen={isModalOpen}
        onClose={closeModal}
        listType={currentListType}
      />
    </div>
  );
};

export default ProfilePage;
