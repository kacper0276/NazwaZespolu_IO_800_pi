import React, { useState } from "react";
import styles from "./ChallengeNote.module.scss";
import { useTranslation } from "react-i18next";
import useWebsiteTitle from "../../hooks/useWebsiteTitle";
import { useApiMultipart } from "../../config/api";
import { useNavigate, useParams } from "react-router-dom";
import { ApiResponse } from "../../types/api.types";
import { toast } from "react-toastify";

interface ChallengeNote {
  text: string;
  image?: File | null;
}

const ChallengeNote: React.FC = () => {
  const { t } = useTranslation();
  useWebsiteTitle(t("add-note"));
  const api = useApiMultipart();
  const { goalId } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState<ChallengeNote>({ text: "", image: null });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote({ ...note, text: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setNote({ ...note, image: e.target.files[0] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("message", note.text);

    if (goalId) formData.append("goalId", goalId);

    if (note.image) formData.append("image", note.image);

    api
      .post<ApiResponse<null>>(`goal-updates`, formData)
      .then((res) => {
        if (res.status === 201) {
          toast.success(t(res.data.message));
          navigate(-1);
        }
      })
      .catch((_err) => {
        toast.error(t("error-adding-note"));
      });
  };

  return (
    <div className={styles.formContainer}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Dodaj aktualizację wyzwania</h2>

        <div className={styles.inputGroup}>
          <label htmlFor="text" className={styles.label}>
            Treść aktualizacji
          </label>
          <textarea
            id="text"
            className={styles.textarea}
            value={note.text}
            onChange={handleChange}
            required
            placeholder="Opisz swój postęp w wyzwaniu..."
            rows={4}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="image" className={styles.label}>
            Dodaj zdjęcie (opcjonalne)
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            className={styles.input}
            onChange={handleImageChange}
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          Dodaj aktualizację
        </button>
      </form>
    </div>
  );
};

export default ChallengeNote;
