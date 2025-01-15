import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ChallengesTab.module.scss";
import ChallengeDetailsModal from "../../../components/Modals/ChallengeDetailsModal/ChallengeDetailsModal";
import { useApiJson } from "../../../config/api";
import { useUser } from "../../../context/UserContext";
import useWebsiteTitle from "../../../hooks/useWebsiteTitle";
import { useTranslation } from "react-i18next";
import { ApiResponse } from "../../../types/api.types";
import { GoalType } from "../../../types/IGoal";
import { toast } from "react-toastify";
import { convertIsoToLocal } from "../../../helpers/convertDate";

const getTreeType = (difficulty: string) => {
  switch (difficulty) {
    case "krzew":
      return "SmallTree";
    case "średnie drzewo":
      return "MediumTree";
    case "duże drzewo":
      return "BigTree";
    default:
      return "BigTree";
  }
};

const getTreePath = (difficulty: string, treeSkin: string) => {
  const treeType = getTreeType(difficulty.toLowerCase());
  const isPremium = treeSkin === "PremiumSkin";

  if (isPremium) {
    return (index: number) =>
      import(
        `../../../assets/images/Trees/${treeType}Premium/${index + 1}p.png`
      );
  }

  return (index: number) =>
    import(`../../../assets/images/Trees/${treeType}/${index + 1}.png`);
};

const calculatePercentage = (start: string, end: string): number => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const today = new Date();

  if (today < startDate) return 0;
  if (today > endDate) return 100;

  const totalTime = endDate.getTime() - startDate.getTime();
  const elapsed = today.getTime() - startDate.getTime();

  return Math.floor((elapsed / totalTime) * 100);
};

const ChallengesTab: React.FC = () => {
  const { t } = useTranslation();
  useWebsiteTitle(t("challenges"));

  const api = useApiJson();
  const userHook = useUser();
  const [treeImages, setTreeImages] = useState<Map<string, string[]>>(
    new Map()
  );
  const [challenges, setChallenges] = useState<GoalType[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<GoalType | null>(
    null
  );

  useEffect(() => {
    const loadImagesForChallenge = async (challenge: GoalType) => {
      const importPath = getTreePath(challenge.difficulty, challenge.treeSkin);
      const loadedImages = await Promise.all(
        Array.from({ length: 10 }, (_, i) =>
          importPath(i).then((module) => module.default)
        )
      );
      return loadedImages;
    };

    const loadAllImages = async () => {
      const newTreeImages = new Map<string, string[]>();

      for (const challenge of challenges) {
        const challengeKey = `${challenge.difficulty}-${challenge.treeSkin}`;
        if (!newTreeImages.has(challengeKey)) {
          const images = await loadImagesForChallenge(challenge);
          newTreeImages.set(challengeKey, images);
        }
      }

      setTreeImages(newTreeImages);
    };

    if (challenges.length > 0) {
      loadAllImages();
    }
  }, [challenges]);

  useEffect(() => {
    api
      .get<ApiResponse<GoalType[]>>(
        `goals/find-by-profile/${userHook.user?.profileId}`
      )
      .then((res) => {
        setChallenges(res.data?.data ?? []);
      })
      .catch((_err) => {
        toast.error("error-fetching-challenges");
      });
  }, []);

  const getChallengePercentage = (challenge: GoalType) => {
    return calculatePercentage(
      challenge.startDate + "",
      challenge.endDate + ""
    );
  };

  const getImageForChallenge = (challenge: GoalType, percentage: number) => {
    const challengeKey = `${challenge.difficulty}-${challenge.treeSkin}`;
    const images = treeImages.get(challengeKey) || [];
    const index = Math.min(Math.floor(percentage / 10), 9);
    return images[index];
  };

  const navigate = useNavigate();

  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<number>>(
    new Set()
  );

  const toggleDescription = (index: number) => {
    setExpandedDescriptions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <div className={styles.challengesContainer}>
      <h2 className={styles.heading}>Wyzwania</h2>
      <div
        className={`d-flex justify-content-center ${styles.createButtonWrapper}`}
      >
        <button
          onClick={() => navigate("/create-challenge")}
          className={styles.createButton}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Stwórz nowe wyzwanie
        </button>
      </div>
      <div className={styles.challengeList}>
        {challenges.map((challenge, index) => {
          const percentage = getChallengePercentage(challenge);
          const treeImage = getImageForChallenge(challenge, percentage);
          const isExpanded = expandedDescriptions.has(index);

          return (
            <div key={index} className={styles.challengeItem}>
              <h3 className={styles.title}>{challenge.name}</h3>
              {treeImage && (
                <img
                  src={treeImage}
                  alt={`${challenge.difficulty} progress ${percentage}%`}
                  className={styles.image}
                />
              )}
              <div className={styles.dates}>
                <p>
                  <span className={styles.dateLabel}>Start:</span>{" "}
                  {convertIsoToLocal(challenge.startDate + "")}
                </p>
                <p>
                  <span className={styles.dateLabel}>Koniec:</span>{" "}
                  {convertIsoToLocal(challenge.endDate + "")}
                </p>
              </div>
              <p className={`${styles.description} overflow-auto`}>
                {challenge.description}
              </p>
              <p className={styles.progress}>Postęp: {percentage}%</p>
              <button
                className={styles.button}
                onClick={() => setSelectedChallenge(challenge)}
              >
                Zobacz szczegóły
              </button>
            </div>
          );
        })}
      </div>
      {selectedChallenge && (
        <ChallengeDetailsModal
          challenge={selectedChallenge}
          onClose={() => setSelectedChallenge(null)}
        />
      )}
    </div>
  );
};

export default ChallengesTab;
