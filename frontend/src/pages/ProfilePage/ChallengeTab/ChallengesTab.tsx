import React, { useState, useEffect } from "react";
import styles from "./ChallengesTab.module.scss";

type Challenge = {
  title: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  description: string;
  percentage: number;
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
  const [images, setImages] = useState<string[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  useEffect(() => {
    const loadImages = async () => {
      const loadedImages = await Promise.all(
        Array.from({ length: 10 }, (_, i) =>
          import(`../../../assets/images/Trees/${i + 1}p.png`).then((module) => module.default)
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
        percentage: calculatePercentage("2024-12-25", "2025-01-10"),
      },
      {
        title: "Zdrowe odżywianie",
        startDate: "2025-01-01",
        endDate: "2025-01-31",
        description: "Codziennie przygotuj zdrowy posiłek.",
        percentage: calculatePercentage("2025-01-01", "2025-01-31"),
      },
      {
        title: "Ucz się codziennie",
        startDate: "2024-12-20",
        endDate: "2025-01-20",
        description: "Spędzaj 1 godzinę dziennie na nauce.",
        percentage: calculatePercentage("2024-12-20", "2025-01-20"),
      },
      {
        title: "Spaceruj więcej",
        startDate: "2025-01-05",
        endDate: "2025-02-05",
        description: "Spaceruj 5 km każdego dnia.",
        percentage: calculatePercentage("2025-01-05", "2025-02-05"),
      },
      {
        title: "Poranne medytacje",
        startDate: "2025-01-02",
        endDate: "2025-01-15",
        description: "Rozpocznij dzień 10-minutową medytacją.",
        percentage: calculatePercentage("2025-01-02", "2025-01-15"),
      },
      {
        title: "Przeczytaj książkę",
        startDate: "2024-12-15",
        endDate: "2025-01-15",
        description: "Przeczytaj przynajmniej jedną książkę w miesiąc.",
        percentage: calculatePercentage("2024-12-15", "2025-01-15"),
      },
      {
        title: "Codzienne ćwiczenia",
        startDate: "2025-01-03",
        endDate: "2025-01-30",
        description: "Ćwicz codziennie przez 20 minut.",
        percentage: calculatePercentage("2025-01-03", "2025-01-30"),
      },
      {
        title: "Zacznij pisać dziennik",
        startDate: "2024-12-28",
        endDate: "2025-01-12",
        description: "Codziennie zapisuj swoje przemyślenia.",
        percentage: calculatePercentage("2024-12-28", "2025-01-12"),
      },
      {
        title: "Poznaj nową umiejętność",
        startDate: "2025-01-01",
        endDate: "2025-03-01",
        description: "Codziennie ucz się nowej umiejętności przez 30 minut.",
        percentage: calculatePercentage("2025-01-01", "2025-03-01"),
      },
      {
        title: "Oszczędzaj pieniądze",
        startDate: "2025-01-01",
        endDate: "2025-06-01",
        description: "Codziennie odkładaj drobną kwotę na oszczędności.",
        percentage: calculatePercentage("2025-01-01", "2025-06-01"),
      },

    ];
    

    setChallenges(exampleChallenges);
  }, []);

  const getImageForPercentage = (percentage: number) => {
    const index = Math.min(Math.floor(percentage / 10), 9);
    return images[index];
  };

  return (
    <div className={styles.challengesContainer}>
      <h2 className={styles.heading}>Wyzwania</h2>
      <div className={styles.challengeList}>
        {challenges.map((challenge, index) => (
          <div key={index} className={styles.challengeItem}>
            <h3 className={styles.title}>{challenge.title}</h3>
            {images.length > 0 && (
              <img
                src={getImageForPercentage(challenge.percentage)}
                alt={`Tree progress ${challenge.percentage}%`}
                className={styles.image}
              />
            )}
            <div className={styles.dates}>
              <p>
                <span className={styles.dateLabel}>Start:</span>{" "}
                {challenge.startDate}
              </p>
              <p>
                <span className={styles.dateLabel}>Koniec:</span>{" "}
                {challenge.endDate}
              </p>
            </div>
            <p className={styles.description}>{challenge.description}</p>
            <p className={styles.progress}>Postęp: {challenge.percentage}%</p>
            <button className={styles.button}>Zobacz szczegóły</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChallengesTab;
