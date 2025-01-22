import React, { useEffect, useState } from "react";
import styles from "./CommentsModal.module.scss";
import { CommentType } from "../../../types/IComment";
import { useApiJson } from "../../../config/api";
import { useUser } from "../../../context/UserContext";
import { ApiResponse } from "../../../types/api.types";
import { toast } from "react-toastify";
import { t } from "i18next";

interface CommentsModalProps {
  show: boolean;
  onClose: () => void;
  postId: string;
  commentsIds: string[]; // Przekazujemy tablicę ID komentarzy
  allowComments: boolean;
}

const CommentsModal: React.FC<CommentsModalProps> = ({
  show,
  onClose,
  postId,
  commentsIds,
  allowComments,
}) => {
  const api = useApiJson();
  const userHook = useUser();
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchComments = async () => {
      const fetchedComments: CommentType[] = [];

      for (const commentId of commentsIds) {
        try {
          const commentResponse = await api.get<ApiResponse<CommentType>>(
            `comments/${commentId}`
          );
          const comment = commentResponse.data.data;
          if (comment) {
            fetchedComments.push(comment);
          }
        } catch (error: any) {
          console.error(`Error fetching comment with ID ${commentId}:`, error);
        }
      }

      setComments(fetchedComments);
    };

    if (show) {
      document.body.style.overflow = "hidden";
      fetchComments();
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [show, commentsIds, api]);

  const handleAddComment = async () => {
    if (newComment.trim() === "") {
      setError(t("comment-cannot-be-empty"));
      return;
    }

    const commentData = {
      userId: userHook.user?._id ?? "",
      value: newComment,
    };

    try {
      const response = await api.post<ApiResponse<CommentType>>(
        `/comments/${postId}`,
        commentData
      );
      if (response.status === 200 && response.data.data) {
        const newCommentData = response.data.data;
        newCommentData.userId = `${userHook.user?.firstname} ${userHook.user?.lastname}`;
        setComments((prevComments) => [newCommentData, ...prevComments]);
        toast.success(t("comment-added-successfully"));
        setNewComment("");
        setError("");
      } else {
        toast.error(t("error-adding-comment"));
      }
    } catch (error: any) {
      toast.error(t("error-adding-comment"));
      console.error("Error adding comment:", error);
    }
  };

  if (!show) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
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
        {allowComments && (
          <div className={styles.newCommentSection}>
            {error && <div className={styles.errorMessage}>{error}</div>}
            <textarea
              className={styles.newCommentInput}
              placeholder={t("write-your-comment")}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button className={styles.addCommentButton} onClick={handleAddComment}>
              {t("add-comment")}
            </button>
          </div>
        )}
        <div className={styles.modalBody}>
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
