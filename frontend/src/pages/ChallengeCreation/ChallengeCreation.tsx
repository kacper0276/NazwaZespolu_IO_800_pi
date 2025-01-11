import React, { useState, useEffect } from "react";
import styles from "./ChallengeCreation.module.scss";
import BigTreeStandardSkin from "../../assets/gifs/FormSkins/BigTree/StandardSkin.gif";
import BigTreePremiumSkin from "../../assets/gifs/FormSkins/BigTree/PremiumSkin.gif";
import MediumTreeStandardSkin from "../../assets/gifs/FormSkins/MediumTree/StandardSkin.gif";
import MediumTreePremiumSkin from "../../assets/gifs/FormSkins/MediumTree/PremiumSkin.gif";
import SmallTreeStandardSkin from "../../assets/gifs/FormSkins/SmallTree/StandardSkin.gif";
import SmallTreePremiumSkin from "../../assets/gifs/FormSkins/SmallTree/PremiumSkin.gif";

import useWebsiteTitle from "../../hooks/useWebsiteTitle";
import { useTranslation } from "react-i18next";
import { useApiMultipart } from "../../config/api";
import { toast } from "react-toastify";
import { useUser } from "../../context/UserContext";
import { ApiResponse } from "../../types/api.types";
import { GoalType } from "../../types/IGoal";

interface Challenge {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  dailyReminder: boolean;
  image: File | null;
  visibility: "public" | "private";
  postToProfile: boolean;
  allowComments: boolean;
  difficulty: "Krzew" | "Średnie drzewo" | "Duże drzewo" | "";
  tags: string[];
  treeSkin: "StandardSkin" | "PremiumSkin";
  isPost: boolean;
}

const ChallengeCreation: React.FC = () => {
  const { t } = useTranslation();
  useWebsiteTitle(t("create-challenge"));
  const api = useApiMultipart();
  const userHook = useUser();

  const [challenge, setChallenge] = useState<Challenge>({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    dailyReminder: false,
    image: null,
    visibility: "public",
    postToProfile: false,
    allowComments: false,
    difficulty: "",
    tags: [],
    treeSkin: "StandardSkin",
    isPost: false,
  });

  const [tagInput, setTagInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const today = new Date();
  const maxEndDate = new Date();
  maxEndDate.setFullYear(today.getFullYear() + 1);

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const calculateDifficulty = () => {
    if (challenge.startDate && challenge.endDate) {
      const startDate = new Date(challenge.startDate);
      const endDate = new Date(challenge.endDate);
      const differenceInDays =
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);

      if (differenceInDays <= 14) return "Krzew";
      if (differenceInDays <= 60) return "Średnie drzewo";
      return "Duże drzewo";
    }
    return "";
  };

  useEffect(() => {
    const difficulty = calculateDifficulty();
    setChallenge((prev) => ({ ...prev, difficulty }));
  }, [challenge.startDate, challenge.endDate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setChallenge({ ...challenge, [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setChallenge({ ...challenge, [name]: checked });
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChallenge({
      ...challenge,
      visibility: e.target.value as "public" | "private",
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setChallenge({ ...challenge, image: e.target.files[0] });
    }
  };

  const handleSkinChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setChallenge({
      ...challenge,
      treeSkin: e.target.value as "StandardSkin" | "PremiumSkin",
    });
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmedTag = tagInput.trim();

      if (!trimmedTag) {
        setErrorMessage("Tag cannot be empty.");
        return;
      }

      if (trimmedTag.length > 20) {
        setErrorMessage("Tag cannot exceed 20 characters.");
        return;
      }

      if (/\d/.test(trimmedTag)) {
        setErrorMessage("Tag cannot contain numbers.");
        return;
      }

      if (challenge.tags.includes(trimmedTag)) {
        setErrorMessage("Tag cannot be duplicated.");
        return;
      }

      if (challenge.tags.length >= 5) {
        setErrorMessage("You can only add up to 5 tags.");
        return;
      }

      setChallenge((prev) => ({
        ...prev,
        tags: [...prev.tags, trimmedTag],
      }));

      setTagInput("");
      setErrorMessage("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setChallenge((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", challenge.name);
    formData.append("description", challenge.description);
    formData.append("startDate", challenge.startDate);
    formData.append("endDate", challenge.endDate);
    formData.append("dailyReminder", String(challenge.dailyReminder));
    formData.append("visibility", challenge.visibility);
    formData.append("allowComments", String(challenge.allowComments));
    formData.append("difficulty", challenge.difficulty);
    formData.append("treeSkin", challenge.treeSkin);
    formData.append("tags", JSON.stringify(challenge.tags));
    formData.append("isPost", String(challenge.isPost));
    if (challenge.image) {
      formData.append("image", challenge.image);
    }
    formData.append("profileId", userHook.user?.profileId ?? "");

    try {
      api.post<ApiResponse<GoalType>>(`goals`, formData).then((res) => {
        toast.success(t(res.data.message));
      });
    } catch (err: any) {
      toast.error(t(err.response?.data.message || err.message));
    }
  };

  return (
    <div className={styles.formContainer}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Create a Challenge</h2>

        <div className={styles.inputGroup}>
          <label htmlFor="name" className={styles.label}>
            Challenge Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className={`${styles.input}`}
            value={challenge.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="description" className={styles.label}>
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className={`${styles.textarea}`}
            value={challenge.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="tags" className={styles.label}>
            Tags
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            className={`${styles.input}`}
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder="Add a tag and press Enter"
          />
          {errorMessage && (
            <p className={`${styles.errorMessage} customErrorClass`}>
              {errorMessage}
            </p>
          )}
          <div className={styles.tagsContainer}>
            {challenge.tags.map((tag, index) => (
              <div key={index} className={styles.tag}>
                {tag}
                <button
                  type="button"
                  className={styles.removeTagButton}
                  onClick={() => handleRemoveTag(tag)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="startDate" className={styles.label}>
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            className={`${styles.input}`}
            value={challenge.startDate}
            onChange={handleChange}
            required
            min={formatDate(today)}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="endDate" className={styles.label}>
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            className={`${styles.input}`}
            value={challenge.endDate}
            onChange={handleChange}
            required
            min={challenge.startDate || formatDate(today)}
            max={formatDate(maxEndDate)}
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Challenge Difficulty</label>
          <div
            className={`${styles.difficultyDisplay} ${
              challenge.difficulty ? styles.difficultyBorder : ""
            }`}
          >
            {challenge.difficulty ? challenge.difficulty : "Select valid dates"}
          </div>
        </div>

        {(challenge.difficulty === "Krzew" ||
          challenge.difficulty === "Średnie drzewo" ||
          challenge.difficulty === "Duże drzewo") && (
          <div className={styles.inputGroup}>
            <label htmlFor="treeSkin" className={styles.label}>
              Select Tree Skin
            </label>
            <select
              id="skins"
              value={challenge.treeSkin}
              onChange={handleSkinChange}
              className={styles.select}
            >
              <option value="StandardSkin">Standard Skin</option>
              <option value="PremiumSkin">Premium Skin</option>
            </select>
            <div className={styles.skinPreview}>
              {challenge.difficulty === "Krzew" && (
                <img
                  src={
                    challenge.treeSkin === "StandardSkin"
                      ? SmallTreeStandardSkin
                      : SmallTreePremiumSkin
                  }
                  alt={`${challenge.treeSkin} for Krzew`}
                  className={styles.skinGif}
                />
              )}
              {challenge.difficulty === "Średnie drzewo" && (
                <img
                  src={
                    challenge.treeSkin === "StandardSkin"
                      ? MediumTreeStandardSkin
                      : MediumTreePremiumSkin
                  }
                  alt={`${challenge.treeSkin} for Średnie drzewo`}
                  className={styles.skinGif}
                />
              )}
              {challenge.difficulty === "Duże drzewo" && (
                <img
                  src={
                    challenge.treeSkin === "StandardSkin"
                      ? BigTreeStandardSkin
                      : BigTreePremiumSkin
                  }
                  alt={`${challenge.treeSkin} for Duże drzewo`}
                  className={styles.skinGif}
                />
              )}
            </div>
          </div>
        )}

        <div className={styles.checkboxGroup}>
          <input
            type="checkbox"
            id="dailyReminder"
            name="dailyReminder"
            className={`${styles.checkbox}`}
            checked={challenge.dailyReminder}
            onChange={handleCheckboxChange}
          />
          <label htmlFor="dailyReminder" className={styles.checkboxLabel}>
            Daily Reminder
          </label>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="image" className={styles.label}>
            Upload Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            className={`${styles.input} ${styles.imageInput}`}
            onChange={handleImageChange}
          />
        </div>

        <div className={styles.radioGroup}>
          <label className={styles.label}>Visibility:</label>
          <div>
            <input
              type="radio"
              id="visibilityPublic"
              name="visibility"
              value="public"
              className={`${styles.radio}`}
              checked={challenge.visibility === "public"}
              onChange={handleRadioChange}
            />
            <label htmlFor="visibilityPublic" className={styles.radioLabel}>
              Public
            </label>
          </div>
          <div>
            <input
              type="radio"
              id="visibilityPrivate"
              name="visibility"
              value="private"
              className={`${styles.radio}`}
              checked={challenge.visibility === "private"}
              onChange={handleRadioChange}
            />
            <label htmlFor="visibilityPrivate" className={styles.radioLabel}>
              Private
            </label>
          </div>
        </div>

        <div className={styles.checkboxGroup}>
          <input
            type="checkbox"
            id="allowComments"
            name="allowComments"
            className={`${styles.checkbox}`}
            checked={challenge.allowComments}
            onChange={handleCheckboxChange}
          />
          <label htmlFor="allowComments" className={styles.checkboxLabel}>
            Allow Comments
          </label>
        </div>

        <div className={styles.checkboxGroup}>
          <input
            type="checkbox"
            id="isPost"
            name="isPost"
            className={`${styles.checkbox}`}
            checked={challenge.isPost}
            onChange={handleCheckboxChange}
          />
          <label htmlFor="isPost" className={styles.checkboxLabel}>
            Add as post
          </label>
        </div>

        <button type="submit" className={`${styles.submitButton}`}>
          Create Challenge
        </button>
      </form>
    </div>
  );
};

export default ChallengeCreation;
