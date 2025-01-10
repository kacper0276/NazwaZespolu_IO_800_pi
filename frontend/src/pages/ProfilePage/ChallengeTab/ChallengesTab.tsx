import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ChallengesTab.module.scss";
import ChallengeDetailsModal from "../../../components/Modals/ChallengeDetailsModal/ChallengeDetailsModal";
import PlaceholderImg from "../../../assets/images/greatBritainFlag.png";
import PlaceholderImg2 from "../../../assets/images/PlaceholderImages/zdrowe-salaki-przepisy-1250x833.jpg";
import { useApiJson } from "../../../config/api";
import { useUser } from "../../../context/UserContext";
import useWebsiteTitle from "../../../hooks/useWebsiteTitle";
import { useTranslation } from "react-i18next";
import { ApiResponse } from "../../../types/api.types";
import { GoalType } from "../../../types/IGoal";
import { toast } from "react-toastify";
import { convertIsoToLocal } from "../../../helpers/convertDate";

type Challenge = {
  title: string;
  startDate: string;
  endDate: string;
  description: string;
  updates: { text: string; image?: string }[];
  tags: string[];
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
  const [images, setImages] = useState<string[]>([]);
  const [challenges, setChallenges] = useState<GoalType[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<GoalType | null>(
    null
  );

  useEffect(() => {
    const loadImages = async () => {
      const loadedImages = await Promise.all(
        Array.from({ length: 10 }, (_, i) =>
          import(`../../../assets/images/Trees/${i + 1}p.png`).then(
            (module) => module.default
          )
        )
      );
      setImages(loadedImages);
    };

    loadImages();

    const exampleChallenges: Challenge[] = [
      {
        title: "Codzienne bieganie",
        startDate: "2024-12-25",
        endDate: "2025-01-10",
        description: "Biegaj codziennie przez 30 minut!",
        updates: [
          { text: "Dzień 1: Pierwszy bieg ukończony!", image: PlaceholderImg2 },
          { text: "Dzień 2: Bieg w deszczu, ale się udało." },
          {
            text: "Dzień 3: Utrzymałem tempo 6 min/km.",
            image: PlaceholderImg,
          },
        ],
        tags: ["bieganie", "sport", "zdrowie", "wyzwanie", "nawyki"],
      },
      {
        title: "Zdrowe odżywianie",
        startDate: "2025-01-01",
        endDate: "2025-01-31",
        description: "Codziennie przygotuj zdrowy posiłek.",
        updates: [
          { text: "Dzień 1: Przygotowałem pyszną sałatkę." },
          { text: "Dzień 2: Unikałem słodyczy.", image: PlaceholderImg2 },
          { text: "Dzień 3: Woda zamiast napojów gazowanych." },
        ],
        tags: ["zdrowie", "jedzenie", "nawyki", "fit", "motywacja"],
      },
      {
        title: "Poranne medytacje",
        startDate: "2025-01-02",
        endDate: "2025-01-15",
        description: "Rozpocznij dzień 10-minutową medytacją.",
        updates: [],
        tags: ["medytacja", "spokój", "skupienie", "zdrowie", "mindfulness"],
      },
      {
        title: "Spaceruj więcej",
        startDate: "2025-01-05",
        endDate: "2025-02-05",
        description: "Spaceruj 5 km każdego dnia.",
        updates: [
          {
            text: "Dzień 1: Odwiedziłem pobliski park.",
            image: PlaceholderImg,
          },
          { text: "Dzień 2: Spacer z psem - piękny dzień!" },
        ],
        tags: ["spacery", "natura", "zdrowie", "relaks", "aktywność"],
      },
      {
        title: "Ucz się codziennie",
        startDate: "2024-12-20",
        endDate: "2025-01-20",
        description: "Spędzaj 1 godzinę dziennie na nauce.",
        updates: [
          { text: "Dzień 1: Przerobiłem nowy rozdział książki o JavaScript." },
          {
            text: "Dzień 2: Obejrzałem tutorial o React.",
            image: PlaceholderImg,
          },
        ],
        tags: ["nauka", "rozwój", "umiejętności", "produktywność", "motywacja"],
      },
    ];

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

  const getImageForPercentage = (percentage: number) => {
    const index = Math.min(Math.floor(percentage / 10), 9);
    return images[index];
  };
  const navigate = useNavigate();
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
          return (
            <div key={index} className={styles.challengeItem}>
              <h3 className={styles.title}>{challenge.name}</h3>
              {images.length > 0 && (
                <img
                  src={getImageForPercentage(percentage)}
                  alt={`Tree progress ${percentage}%`}
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
              <p className={styles.description}>{challenge.description}</p>
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
