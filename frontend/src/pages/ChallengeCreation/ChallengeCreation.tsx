import React, { useState, useEffect } from "react";
import styles from "./ChallengeCreation.module.scss";

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
}

const ChallengeCreation: React.FC = () => {
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
  });

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
      const differenceInDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
  
    const stripTime = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
    const selectedDate = stripTime(new Date(value));
    const todayDate = stripTime(today);
  
    if (name === "startDate" && selectedDate < todayDate) return; 
    if (name === "endDate" && selectedDate > stripTime(maxEndDate)) return; 
  
    setChallenge({ ...challenge, [name]: value });
  };
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setChallenge({ ...challenge, [name]: checked });
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChallenge({ ...challenge, visibility: e.target.value as "public" | "private" });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setChallenge({ ...challenge, image: e.target.files[0] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(challenge);
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
            id="postToProfile"
            name="postToProfile"
            className={`${styles.checkbox}`}
            checked={challenge.postToProfile}
            onChange={handleCheckboxChange}
          />
          <label htmlFor="postToProfile" className={styles.checkboxLabel}>
            Post to Profile
          </label>
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

        <button type="submit" className={`${styles.submitButton}`}>
          Create Challenge
        </button>
      </form>
    </div>
  );
};

export default ChallengeCreation;
