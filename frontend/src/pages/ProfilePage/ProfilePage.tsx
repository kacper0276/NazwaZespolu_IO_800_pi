import React, { useEffect, useState } from "react";
import FollowListModal from "../../components/Modals/FollowListModal/FollowListModal";
import PostDetailModal from "../../components/Modals/PostDetailsModal/PostDetailsModal";
import ChallengesTab from "./ChallengeTab/ChallengesTab";
import PostsTab from "./PostsTab/PostsTab";
import styles from "./ProfilePage.module.scss";
import { useUser } from "../../context/UserContext";
import { ProfileType } from "../../types/IProfile";
import { useApiJson } from "../../config/api";
import { ApiResponse } from "../../types/api.types";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import Spinner from "../../components/Spinner/Spinner";
import { UserType } from "../../types/IUser";
import { GoalType } from "../../types/IGoal";

const _posts = [
  {
    id: 1,
    images: ["https://via.placeholder.com/400x500"],
    title: "Friendly Fire turns 10!",
    likes: 924,
    comments: 27,
    author: "John Doe",
  },
  {
    id: 2,
    images: [
      "https://media.istockphoto.com/id/1327592506/pl/wektor/domy%C5%9Blna-ikona-symbolu-zast%C4%99pczego-zdj%C4%99cia-awatara-szare-zdj%C4%99cie-profilowe-cz%C5%82owiek-biznesu.webp?s=2048x2048&w=is&k=20&c=QzrDx-OsmsBkP3pB68zVo53u1cyxI5jeq2R5W4sV3fQ=",
      "https://via.placeholder.com/700x400",
    ],
    title: "Legendary Update 2.3!",
    likes: 1120,
    comments: 34,
    author: "Jane Smith",
  },
  {
    id: 3,
    images: [
      "https://via.placeholder.com/400x500",
      "https://via.placeholder.com/400x500",
      "https://via.placeholder.com/400x500",
    ],
    title: "Come and Visit us",
    likes: 169,
    comments: 10,
    author: "Alice Johnson",
  },
  {
    id: 4,
    images: ["https://via.placeholder.com/400x500"],
    title: "Hello!",
    likes: 15435345,
    comments: 2,
    author: "Bob Williams",
  },
];

const ProfilePage: React.FC = () => {
  const userHook = useUser();
  const api = useApiJson();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("posty");
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentListType, setCurrentListType] = useState<
    "followers" | "following"
  >("followers");
  const [isPostModalOpen, setPostModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [profileData, setProfileData] = useState<ProfileType>();
  const [userData, setUserData] = useState<UserType>();
  const [posts, setPosts] = useState<GoalType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handlePostClick = (post: any) => {
    setSelectedPost(post);
    setPostModalOpen(true);
  };

  const closePostModal = () => {
    setPostModalOpen(false);
    setSelectedPost(null);
  };

  const openModal = (type: "followers" | "following") => {
    setCurrentListType(type);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const renderTabContent = () => {
    switch (activeTab) {
      case "posty":
        return <PostsTab posts={posts} onPostClick={handlePostClick} />;
      case "wyzwania":
        return <ChallengesTab />;
      case "las":
        return <div className={styles.placeholder}>Placeholder dla Lasu</div>;
      default:
        return null;
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);

      try {
        const profileResponse = await api.get<ApiResponse<ProfileType>>(
          `profiles/${userHook.user?.profileId}`
        );
        setProfileData(profileResponse.data.data);

        const userResponse = await api.get<ApiResponse<UserType>>(
          `users/search-by-userId/${profileResponse.data.data?.userId}`
        );

        const posts = await api.get<ApiResponse<GoalType[]>>(
          `goals/find-posts-by-profile/${userResponse.data.data?.profileId}`
        );
        console.log(posts);
        setPosts(posts.data?.data ?? []);

        setUserData(userResponse.data.data);
      } catch (_err) {
        toast.error(t("error-fetching-profile"));
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className={styles.pageBg}>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className={styles.profilePage}>
            {/* Header Section */}
            <div className={styles.profileHeader}>
              <div
                className={styles.profileBackground}
                style={{
                  backgroundImage: `url(/backgroundImages/${userData?.backgroundImage})`,
                }}
              ></div>
              <div className={styles.infoContainer}>
                <div className={styles.avatarContainer}>
                  <div className={styles.avatar}>
                    <img src={`/profileImages/${userData?.profileImage}`} />
                  </div>
                </div>
                <h1
                  className={styles.username}
                >{`${userHook.user?.firstname} ${userHook.user?.lastname}`}</h1>
                <p className={styles.stats}>
                  <span>
                    <strong>{posts.length}</strong> posty
                  </span>
                  <span
                    onClick={() => openModal("followers")}
                    role="button"
                    className={styles.linkText}
                  >
                    <strong>{profileData?.followers.length}</strong>{" "}
                    obserwujących
                  </span>
                  <span
                    onClick={() => openModal("following")}
                    role="button"
                    className={styles.linkText}
                  >
                    <strong>{profileData?.following.length}</strong> obserwowani
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
            <PostDetailModal
              isOpen={isPostModalOpen}
              onClose={closePostModal}
              post={selectedPost}
            />
          </div>

          {/* Modal */}
          <FollowListModal
            isOpen={isModalOpen}
            onClose={closeModal}
            listType={currentListType}
          />
        </>
      )}
    </div>
  );
};

export default ProfilePage;
