import React, { useState } from "react";
import styles from "./PostDetailsModal.module.scss";

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

interface PostDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post | null;
}

const PostDetailModal: React.FC<PostDetailModalProps> = ({
  isOpen,
  onClose,
  post,
}) => {
  if (!isOpen || !post) {
    return null;
  }

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [comments, setComments] = useState<Comment[]>(
    Array.from({ length: post.comments }, (_, index) => ({
      author: `User ${index + 1}`,
      text: `This is a sample comment #${index + 1}`,
    }))
  );
  const [newCommentText, setNewCommentText] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [likes, setLikes] = useState(post.likes);
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

    setComments((prevComments) => [
      ...prevComments,
      {
        author: "Current User",
        text: newCommentText,
      },
    ]);
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
            <button
              className={styles.navButton}
              onClick={handlePreviousImage}
              aria-label="Previous image"
            >
              &#8249;
            </button>
            <img
              src={post.images[currentImageIndex]}
              alt={`Image ${currentImageIndex + 1}`}
              className={styles.carouselImage}
            />
            <button
              className={styles.navButton}
              onClick={handleNextImage}
              aria-label="Next image"
            >
              &#8250;
            </button>
          </div>

          <div className={styles.postDetails}>
            <h2 className={styles.postTitle}>{post.title}</h2>
            <p className={styles.postAuthor}>By {post.author}</p>

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
                        <strong>{comment.author}</strong>
                        <p>{comment.text}</p>
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
