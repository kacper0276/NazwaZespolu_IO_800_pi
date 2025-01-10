import React, { useEffect, useState } from "react";
import styles from "./PostDetailsModal.module.scss";
import { GoalType } from "../../../types/IGoal";
import { useUser } from "../../../context/UserContext";
import { useApiJson } from "../../../config/api";
import { ApiResponse } from "../../../types/api.types";
import { CommentType } from "../../../types/IComment";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

interface Comment {
  author: string;
  text: string;
}

interface Post {
  id: number;
  images: string[];
  title: string;
  likes: number;
  comments: number;
  author: string;
}

// Array.from({ length: 15 }, (_, index) => ({
//   author: `User ${index + 1}`,
//   text: `This is a sample comment #${index + 1}`,
// }));

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
  const [liked, setLiked] = useState(false);
  const [bouncing, setBouncing] = useState(false);

  const MAX_DESCRIPTION_LENGTH = 150;

  const hardcodedDescription = `
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin ut massa eget lectus consequat faucibus. 
    Vivamus id velit vitae purus tincidunt consectetur nec eget sapien. Aliquam feugiat turpis vel nisi gravida, 
    non tincidunt libero vehicula. Aenean nec eros lectus. Suspendisse potenti. Pellentesque habitant morbi tristique 
    senectus et netus et malesuada fames ac turpis egestas. Sed condimentum mattis lorem, non vulputate odio tincidunt non.
  `;

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % post.images.length);
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? post.images.length - 1 : prevIndex - 1
    );
  };

  const handleAddComment = () => {
    if (newCommentText.trim() === "") {
      setError("Comment cannot be empty.");
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
      })
      .catch((_error: any) => {
        toast.error(t("error-adding-comment"));
      });

    setNewCommentText("");
    setError("");
  };

  const handleLike = () => {
    if (!liked) {
      setLikes(likes + 1);
    } else {
      setLikes(likes - 1);
    }
    setLiked(!liked);

    setBouncing(true);
    setTimeout(() => setBouncing(false), 400);
  };

  useEffect(() => {
    post.commentsIds.forEach(async (commentId) => {
      const comments = await api.get<ApiResponse<CommentType[]>>(
        `comments/${commentId}`
      );
      setComments(comments.data.data ?? []);
    });
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
              hardcodedDescription.length <= MAX_DESCRIPTION_LENGTH
                ? hardcodedDescription
                : `${hardcodedDescription.slice(0, MAX_DESCRIPTION_LENGTH)}...`}
              {hardcodedDescription.length > MAX_DESCRIPTION_LENGTH && (
                <span
                  className={styles.toggleDescriptionText}
                  onClick={() =>
                    setIsDescriptionExpanded(!isDescriptionExpanded)
                  }
                >
                  {isDescriptionExpanded ? " Show less" : " Read more"}
                </span>
              )}
            </div>

            <div className={styles.commentsSection}>
              <h3 className={styles.commentsHeader}>Comments</h3>
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
                <p className={styles.noComments}>
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>

            <div
              className={`d-flex align-items-start flex-row ${styles.newCommentSection}`}
            >
              <div className={styles.commentInputWrapper}>
                <textarea
                  className={styles.newCommentInput}
                  placeholder="Write your comment..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                ></textarea>
                <button
                  className={styles.addCommentButton}
                  onClick={handleAddComment}
                >
                  Add Comment
                </button>
                {error && <p className={styles.errorMessage}>{error}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailModal;
