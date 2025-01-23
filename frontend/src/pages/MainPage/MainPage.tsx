import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import styles from "./MainPage.module.scss";
import CommentsModal from "../../components/Modals/CommentsModal/CommentsModal";
import useWebsiteTitle from "../../hooks/useWebsiteTitle";
import { useTranslation } from "react-i18next";
import { t } from "i18next";
import { GoalType } from "../../types/IGoal";
import { useApiJson } from "../../config/api";
import { useUser } from "../../context/UserContext";
import { toast } from "react-toastify";
import { ApiResponse } from "../../types/api.types";
import Spinner from "../../components/Spinner/Spinner";
import localStorageService from "../../services/localStorage.service";

const Post: React.FC<{ post: GoalType }> = ({ post }) => {
  const { t } = useTranslation();
  const api = useApiJson();
  const userHook = useUser();
  const [likes, setLikes] = useState(post.reactions);
  const [liked, setLiked] = useState<boolean>(false);
  const [bouncing, setBouncing] = useState(false);
  const [showComments, setShowComments] = useState(false);

  console.log("Post data:", post);

  const handleLike = async () => {
    const data = {
      userId: userHook.user?._id,
      postId: post._id,
    };

    const res = await api.patch<ApiResponse<null>>(`goals/like-action`, data);

    if (res.status === 200) {
      if (!liked) {
        userHook.user?.likedPost.push(post._id);
        setLikes(likes + 1);
        setLiked(true);
      } else {
        userHook.user?.likedPost.splice(
          userHook.user.likedPost.indexOf(post._id.toString()),
          1
        );
        setLikes(likes - 1);
        setLiked(false);
      }
      localStorageService.setItem("user", userHook.user);
    }

    setBouncing(true);
    setTimeout(() => setBouncing(false), 400);
  };

  useEffect(() => {
    setLiked(userHook.user?.likedPost.includes(post._id) ?? false);
  }, [post, userHook.user?.likedPost]);

  return (
    <div className={`${styles.post} mb-4`}>
      <div className={`${styles.postCard} card`}>
        {post.images?.length > 1 ? (
          <div
            id={`carousel-${post._id}`}
            className="carousel slide"
            data-bs-ride="carousel"
          >
            <div className="carousel-inner">
              {post.images.map((image, index) => (
                <div
                  key={index}
                  className={`carousel-item ${index === 0 ? "active" : ""}`}
                >
                  <img
                    src={image}
                    className="d-block w-100"
                    alt={post.description}
                  />
                </div>
              ))}
            </div>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target={`#carousel-${post._id}`}
              data-bs-slide="prev"
            >
              <span
                className="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">{t("previous")}</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target={`#carousel-${post._id}`}
              data-bs-slide="next"
            >
              <span
                className="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">{t("next")}</span>
            </button>
          </div>
        ) : (
          <img
            src={`goalsImg/${post.image}`}
            className="card-img-top"
            alt={post.description}
          />
        )}
        <div className="card-body">
          <h5 className="card-title">{post.description}</h5>
          <p className="card-text">
            <small>
              {t("posted-by")}{" "}
              <a
                href={`/profile-page/${post.profileId}`}
                className={styles.profileLink}
              >
                {post.userName}
              </a>
            </small>
          </p>

          <div className="card-text">
            <div className={styles.reactionContainer}>
              <span className={styles["like-button"]} onClick={handleLike}>
                <span
                  className={`${styles.icon} ${bouncing ? styles.bounce : ""} ${
                    liked ? styles.colored : styles.grey
                  }`}
                >
                  {liked ? "🌳" : "🌱"}
                </span>{" "}
                {likes} {t("treeactions")}
              </span>
              <span
                className={styles.commentsContainer}
                onClick={() => setShowComments(true)}
              >
                💬 {post.commentsIds.length} {t("comments")}
              </span>
            </div>
          </div>
        </div>
      </div>
      <CommentsModal
        show={showComments}
        onClose={() => setShowComments(false)}
        postId={post._id}
        commentsIds={post.commentsIds.map(String)}
        allowComments={post.allowComments}
      />
    </div>
  );
};

const MainPage: React.FC = () => {
  const { t } = useTranslation();
  useWebsiteTitle(t("main-page"));
  const api = useApiJson();
  const userHook = useUser();
  const [posts, setPosts] = useState<GoalType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    api
      .get<ApiResponse<GoalType[]>>(
        `goals/main-page-posts/${userHook.user?.profileId}`
      )
      .then((res) => {
        setPosts(res.data.data ?? []);
      })
      .catch((_err) => {
        toast.error(t("error-fetching-posts"));
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className={`${styles.homepage} container-fluid`}>
      <div className="row justify-content-center mx-0">
        <div className="col-md-8">
          {loading ? (
            <Spinner />
          ) : (
            <div className={styles.postsContainer}>
              {posts.length === 0 ? (
                <p>{t("no-posts")}</p>
              ) : (
                posts.map((post) => (
                  <Post key={post._id} post={post} />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainPage;