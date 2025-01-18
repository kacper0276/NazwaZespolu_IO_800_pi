import React, { useEffect, useState } from "react";
import FollowListModal from "../../components/Modals/FollowListModal/FollowListModal";
import PostDetailModal from "../../components/Modals/PostDetailsModal/PostDetailsModal";
import ChallengesTab from "./ChallengeTab/ChallengesTab";
import PostsTab from "./PostsTab/PostsTab";
import ForestTab from "./ForestTab/ForestTab";
import styles from "./ProfilePage.module.scss";
import { ProfileType } from "../../types/IProfile";
import { useApiJson } from "../../config/api";
import { ApiResponse } from "../../types/api.types";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import Spinner from "../../components/Spinner/Spinner";
import { UserType } from "../../types/IUser";
import { GoalType } from "../../types/IGoal";
import { useParams } from "react-router-dom";
import useWebsiteTitle from "../../hooks/useWebsiteTitle";

const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  useWebsiteTitle(t("posts"));
  const api = useApiJson();
  const { profileId } = useParams();
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
        return <ForestTab />;
      default:
        return null;
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);

      try {
        const profileResponse = await api.get<ApiResponse<ProfileType>>(
          `profiles/${profileId}`
        );
        setProfileData(profileResponse.data.data);

        const userResponse = await api.get<ApiResponse<UserType>>(
          `users/search-by-userId/${profileResponse.data.data?.userId}`
        );

        const posts = await api.get<ApiResponse<GoalType[]>>(
          `goals/find-posts-by-profile/${userResponse.data.data?.profileId}`
        );
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
                >{`${userData?.firstname} ${userData?.lastname}`}</h1>
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
