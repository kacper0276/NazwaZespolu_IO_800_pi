import React, { useEffect, useState } from "react";
import styles from "./CommentsModal.module.scss";
import { useTranslation } from "react-i18next";

interface Comment {
  author: string;
  text: string;
}

interface CommentsModalProps {
  show: boolean;
  onClose: () => void;
  comments: Comment[];
}

const CommentsModal: React.FC<CommentsModalProps> = ({
  show,
  onClose,
  comments: initialComments,
}) => {
  const { t } = useTranslation();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);

  const handleAddComment = () => {
    if (newComment.trim() === "") {
      setError(t("comment-cannot-be-empty"));
      return;
    }

    const newCommentObject: Comment = {
      author: t("username"), // Placeholder dla nazwy użytkownika
      text: newComment.trim(),
    };

    setComments((prevComments) => [newCommentObject, ...prevComments]); // Dodaj nowy komentarz na górę
    setNewComment("");
    setError("");
  };

  if (!show) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h5 className={styles.modalTitle}>{t("comments")}</h5>
          <button
            type="button"
            className={styles.closeButton}
            aria-label="Close"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {/* Sekcja formularza na górze */}
        <div className={styles.newCommentSection}>
          {error && <div className={styles.errorMessage}>{error}</div>}{" "}
          {/* Wyświetlanie błędu */}
          <textarea
            className={styles.newCommentInput}
            placeholder={t("write-your-comment-here")}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            className={styles.addCommentButton}
            onClick={handleAddComment}
          >
            {t("add-comment")}
          </button>
        </div>

        <div className={styles.modalBody}>
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
            <p className={styles.noComments}>{t("no-comments-yet")}</p>
          )}
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.closeFooterButton} onClick={onClose}>
            {t("close")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentsModal;
