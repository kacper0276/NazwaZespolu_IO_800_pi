import React, { useEffect, useState } from "react";
import styles from "./PostDetailsModal.module.scss";
import { GoalType } from "../../../types/IGoal";
import { useUser } from "../../../context/UserContext";
import { useApiJson } from "../../../config/api";
import { ApiResponse } from "../../../types/api.types";
import { CommentType } from "../../../types/IComment";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import localStorageService from "../../../services/localStorage.service";

interface PostDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: GoalType | null;
}

const PostDetailModal: React.FC<PostDetailModalProps> = ({
  isOpen,
  onClose,
  post,
}) => {
  if (!isOpen || !post) {
    return null;
  }

  const { t } = useTranslation();
  const api = useApiJson();
  const userHook = useUser();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newCommentText, setNewCommentText] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [likes, setLikes] = useState(post.reactions);
  const [liked, setLiked] = useState<boolean>(false);
  const [bouncing, setBouncing] = useState(false);

  const MAX_DESCRIPTION_LENGTH = 150;

  // TODO: W przyszłości slider dla zdjęć
  // const handleNextImage = () => {
  //   setCurrentImageIndex((prevIndex) => (prevIndex + 1) % post.images.length);
  // };

  // const handlePreviousImage = () => {
  //   setCurrentImageIndex((prevIndex) =>
  //     prevIndex === 0 ? post.images.length - 1 : prevIndex - 1
  //   );
  // };

  const handleAddComment = () => {
    if (newCommentText.trim() === "") {
      setError(t("comment-cannot-be-empty"));
      return;
    }

    const commentData = {
      userId: userHook.user?._id ?? "",
      value: newCommentText,
    };

    api
      .post<ApiResponse<CommentType>>(`comments/${post._id}`, commentData)
      .then((res) => {
        toast.success(t(res.data.message));

        const newComment = res.data.data;
        if (newComment) {
          newComment.userId = `${userHook.user?.firstname} ${userHook.user?.lastname}`;
          setComments((prevComments) => [...prevComments, newComment]);
        }
      })
      .catch((_error: any) => {
        toast.error(t("error-adding-comment"));
      });

    setNewCommentText("");
    setError("");
  };

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
    post.commentsIds.forEach(async (commentId) => {
      const commentResponse = await api.get<ApiResponse<CommentType>>(
        `comments/${commentId}`
      );

      const comment = commentResponse.data.data;
      if (comment) {
        setComments((prevComments) => [...prevComments, comment]);
      }
    });

    setLiked(userHook.user?.likedPost.includes(post._id) ?? false);
  }, [post]);

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>

        <div className={styles.modalBody}>
          <div className={styles.imageSection}>
            {/* <button
              className={styles.navButton}
              onClick={handlePreviousImage}
              aria-label="Previous image"
            >
              &#8249;
            </button> */}
            <img
              src={`/goalsImg/${post.image}`}
              alt={`Image ${currentImageIndex + 1}`}
              className={styles.carouselImage}
            />
            {/* <button
              className={styles.navButton}
              onClick={handleNextImage}
              aria-label="Next image"
            >
              &#8250;
            </button> */}
          </div>

          <div className={styles.postDetails}>
            <h2 className={styles.postTitle}>{post.name}</h2>
            <p className={styles.postAuthor}>By {post.name}</p>

            <div className={styles.reactionSection}>
              <span
                className={`${styles.likeButton} ${
                  bouncing ? styles.bounce : ""
                }`}
                onClick={handleLike}
              >
                <span
                  className={`${styles.icon} ${
                    liked ? styles.colored : styles.grey
                  } ${bouncing ? styles.bounce : ""}`}
                >
                  {liked ? "🌳" : "🌱"}
                </span>
                {likes} Treeactions
              </span>
            </div>

            <div
              className={`${styles.postDescription} ${
                isDescriptionExpanded ? styles.expanded : ""
              }`}
            >
              {isDescriptionExpanded ||
              post.description.length <= MAX_DESCRIPTION_LENGTH
                ? post.description
                : `${post.description.slice(0, MAX_DESCRIPTION_LENGTH)}...`}
              {post.description.length > MAX_DESCRIPTION_LENGTH && (
                <span
                  className={styles.toggleDescriptionText}
                  onClick={() =>
                    setIsDescriptionExpanded(!isDescriptionExpanded)
                  }
                >
                  {isDescriptionExpanded ? t("show-less") : t("read-more")}
                </span>
              )}
            </div>

            {post.allowComments ? (
              <>
                <div className={styles.commentsSection}>
                  <h3 className={styles.commentsHeader}>{t("comments")}</h3>
                  {comments.length > 0 ? (
                    <ul className={styles.commentsList}>
                      {comments.map((comment, index) => (
                        <li key={index} className={styles.commentItem}>
                          <div className={styles.profilePicture}></div>
                          <div>
                            <strong>{comment.userId}</strong>
                            <p>{comment.value}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className={styles.noComments}>{t("no-comments-yet")}</p>
                  )}
                </div>

                <div
                  className={`d-flex align-items-start flex-row ${styles.newCommentSection}`}
                >
                  <div className={styles.commentInputWrapper}>
                    <textarea
                      className={styles.newCommentInput}
                      placeholder={t("write-your-comment-here")}
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                    ></textarea>
                    <button
                      className={styles.addCommentButton}
                      onClick={handleAddComment}
                    >
                      {t("add-comment")}
                    </button>
                    {error && <p className={styles.errorMessage}>{error}</p>}
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailModal;
