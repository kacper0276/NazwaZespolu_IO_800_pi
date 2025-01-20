import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FollowListModal from "../../components/Modals/FollowListModal/FollowListModal";
import PostDetailModal from "../../components/Modals/PostDetailsModal/PostDetailsModal";
import ProfilePicPlaceholder from "../../assets/images/ProfilePic.jpg";
import BackgroundPicPlaceholder from "../../assets/images/bgplaceholder.jpg";
// import ProfileEditModal from "../../components/Modals/ProfileEditModal/ProfileEditModal";
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
import { useUser } from "../../context/UserContext";

const ProfilePage: React.FC = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  useWebsiteTitle(t("posts"));
  const api = useApiJson();
  const userHook = useUser();
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
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [localFollowersCount, setLocalFollowersCount] = useState<number>(0);
  const [followersAndFollowing, setFollowersAndFollowing] = useState<{
    followers: UserType[];
    following: UserType[];
  }>({
    followers: [],
    following: [],
  });
  const [description, setDescription] = useState<string>("");

  const startChat = (user: UserType) => {
    navigate(`/messages?useremail=${encodeURIComponent(user.email)}`);
  };

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

  const followAction = async () => {
    if (!userHook.user || !profileData) return;

    // Zapisujemy poprzednie wartości na wypadek błędu
    const previousIsFollowing = isFollowing;
    const previousFollowersCount = localFollowersCount;

    try {
      // Aktualizujemy stan lokalny natychmiast
      setIsFollowing(!isFollowing);
      setLocalFollowersCount((prev) => (isFollowing ? prev - 1 : prev + 1));

      // Wysyłamy zmianę do bazy danych w tle
      await api.patch<ApiResponse<null>>(
        `profiles/follow?follower=${userHook.user.profileId}&followee=${profileData._id}`
      );

      toast.success(
        t(previousIsFollowing ? "unfollow-success" : "follow-success")
      );
    } catch (err) {
      // W przypadku błędu przywracamy poprzedni stan
      setIsFollowing(previousIsFollowing);
      setLocalFollowersCount(previousFollowersCount);
      toast.error(t("error-follow-action"));
    }
  };

  const fetchFollowingFollowersData = async () => {
    if (!profileId) return;

    setLoading(true);

    try {
      const response = await api.get<
        ApiResponse<{
          followers: UserType[];
          following: UserType[];
        }>
      >(`profiles/followers-following-list/${profileId}`);

      setFollowersAndFollowing({
        followers: response.data.data?.followers ?? [],
        following: response.data.data?.following ?? [],
      });
    } catch (_err) {
      toast.error(t("error-fetching-profile"));
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    if (!profileId) return;

    setLoading(true);

    try {
      const profileResponse = await api.get<ApiResponse<ProfileType>>(
        `profiles/${profileId}`
      );
      setProfileData(profileResponse.data.data);
      setLocalFollowersCount(profileResponse.data.data?.followers.length ?? 0);

      const profileUser = await api.get<ApiResponse<ProfileType>>(
        `profiles/${userHook.user?.profileId}`
      );

      setIsFollowing(
        profileUser.data.data?.following.includes(profileId) ?? false
      );

      const userResponse = await api.get<ApiResponse<UserType>>(
        `users/search-by-userId/${profileResponse.data.data?.userId}`
      );

      const posts = await api.get<ApiResponse<GoalType[]>>(
        `goals/find-posts-by-profile/${userResponse.data.data?.profileId}`
      );
      setPosts(posts.data?.data ?? []);

      setUserData(userResponse.data.data);

      setDescription(profileUser.data.data?.description ?? "");
    } catch (_err) {
      toast.error(t("error-fetching-profile"));
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDescription = async () => {
    if (!userHook.user || !userData) return;

    try {
      await api.patch<ApiResponse<ProfileType>>(
        `profiles/change-profile-description`,
        { description, profileId }
      );

      toast.success(t("description-updated"));
      setIsEditModalOpen(false);
    } catch (err) {
      toast.error(t("error-updating-description"));
    }
  };

  useEffect(() => {
    fetchProfile()
      .then(() => fetchFollowingFollowersData())
      .then(() => closeModal());
  }, [profileId, userHook.user]);

  return (
    <div className={styles.pageBg}>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className={styles.profilePage}>
            <div className={styles.profileHeader}>
              <div
                className={styles.profileBackground}
                style={{
                  backgroundImage: `url(${
                    userData?.backgroundImage
                      ? `/backgroundImages/${userData?.backgroundImage}`
                      : BackgroundPicPlaceholder
                  })`,
                }}
              ></div>
              <div className={styles.infoContainer}>
                <div className={styles.avatarContainer}>
                  <div className={styles.avatar}>
                    <img
                      src={
                        userHook.user?.profileImage
                          ? `/profileImages/${userData?.profileImage} `
                          : ProfilePicPlaceholder
                      }
                    />
                  </div>
                </div>
                <h1 className={styles.username}>
                  {`${userData?.firstname} ${userData?.lastname}`}
                </h1>
                {userHook.user?.email === userData?.email ? (
                  <div className={styles.profileEditSection}>
                    <p className={styles.description}>
                      {isEditModalOpen ? (
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className={styles.descriptionTextarea}
                        />
                      ) : (
                        <>
                          {description || ""}
                          <button
                            onClick={() => setIsEditModalOpen(true)}
                            className={styles.editIconButton}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                        </>
                      )}
                    </p>

                    {isEditModalOpen && (
                      <div className={styles.editModalActions}>
                        <button
                          onClick={() => setIsEditModalOpen(false)}
                          className={styles.cancelEditButton}
                        >
                          Anuluj
                        </button>
                        <button
                          onClick={handleSaveDescription}
                          className={styles.saveDescriptionButton}
                        >
                          Zapisz zmiany
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={styles.actionButtons}>
                    <button
                      onClick={followAction}
                      className={styles.followButton}
                    >
                      {isFollowing ? "Przestań obserwować" : "Obserwuj"}
                    </button>
                    <button
                      onClick={() => userData && startChat(userData)}
                      className={styles.chatButton}
                    >
                      <i className="bi bi-chat-dots"></i> Wyślij wiadomość
                    </button>
                  </div>
                )}

                {/* {userData?.description && (
                  <p className={styles.description}>
                    {userData?.description ? userData.description : "Posty Tomka"}
                  </p>
                  )} */}
                <p className={styles.stats}>
                  <span>
                    <strong>{posts.length}</strong> posty
                  </span>
                  <span
                    onClick={() => openModal("followers")}
                    role="button"
                    className={styles.linkText}
                  >
                    <strong>{localFollowersCount}</strong> obserwujących
                  </span>
                  <span
                    onClick={() => openModal("following")}
                    role="button"
                    className={styles.linkText}
                  >
                    <strong>{profileData?.following.length}</strong> obserwowani
                  </span>
                </p>
              </div>
            </div>

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

            <div className={styles.tabContent}>{renderTabContent()}</div>
            <PostDetailModal
              isOpen={isPostModalOpen}
              onClose={closePostModal}
              post={selectedPost}
            />
          </div>

          <FollowListModal
            isOpen={isModalOpen}
            onClose={closeModal}
            listType={currentListType}
            users={followersAndFollowing}
          />
          {/* <ProfileEditModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            //currentDescription={userData?.description || ''}
            currentProfileImage={userData?.profileImage}
            currentBackgroundImage={userData?.backgroundImage}
            currentDescription={""}
          /> */}
        </>
      )}
    </div>
  );
};

export default ProfilePage;
