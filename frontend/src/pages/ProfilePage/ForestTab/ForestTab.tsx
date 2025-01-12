import { useState } from "react";
import styles from "./ForestTab.module.scss";
import smallTreeStandard from "../../../assets/images/Trees/SmallTree/10.png";
import mediumTreeStandard from "../../../assets/images/Trees/MediumTree/10.png";
import bigTreeStandard from "../../../assets/images/Trees/BigTree/10.png";
import smallTreePremium from "../../../assets/images/Trees/SmallTreePremium/10p.png";
import mediumTreePremium from "../../../assets/images/Trees/MediumTreePremium/10p.png";
import bigTreePremium from "../../../assets/images/Trees/BigTreePremium/10p.png";
import TreeDetailModal from "../../../components/Modals/TreeDetailsModal/TreeDetailsModal";

type Challenge = {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  difficulty: string;
  treeSkin: string;
  progress: number;
};

const ForestTab = () => {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const exampleChallenges: Challenge[] = [
    {
      id: "1",
      name: "Codzienne bieganie",
      description: "Biegaj codziennie przez 30 minut!",
      startDate: "2025-01-01",
      endDate: "2025-02-01",
      difficulty: "krzew",
      treeSkin: "StandardSkin",
      progress: 100,
    },
    {
      id: "2",
      name: "Zdrowe odżywianie",
      description: "Jedz zdrowo każdego dnia",
      startDate: "2025-01-01",
      endDate: "2025-02-01",
      difficulty: "średnie drzewo",
      treeSkin: "PremiumSkin",
      progress: 100,
    },
    {
      id: "3",
      name: "Medytacja",
      description: "Codzienna medytacja przez 15 minut",
      startDate: "2025-01-01",
      endDate: "2025-02-01",
      difficulty: "duże drzewo",
      treeSkin: "StandardSkin",
      progress: 100,
    },
    {
      id: "4",
      name: "Nauka języka",
      description: "30 minut nauki języka dziennie",
      startDate: "2025-01-01",
      endDate: "2025-02-01",
      difficulty: "średnie drzewo",
      treeSkin: "StandardSkin",
      progress: 100,
    },
    {
      id: "5",
      name: "Czytanie książek",
      description: "Przeczytaj 20 stron dziennie",
      startDate: "2025-01-01",
      endDate: "2025-02-01",
      difficulty: "krzew",
      treeSkin: "PremiumSkin",
      progress: 100,
    },
    {
      id: "6",
      name: "Rowerowa przejażdżka",
      description: "Jeździj rowerem przez 10 km dziennie",
      startDate: "2025-01-01",
      endDate: "2025-02-01",
      difficulty: "średnie drzewo",
      treeSkin: "StandardSkin",
      progress: 100,
    },
    {
      id: "7",
      name: "Picie wody",
      description: "Pij 2 litry wody codziennie",
      startDate: "2025-01-01",
      endDate: "2025-02-01",
      difficulty: "krzew",
      treeSkin: "PremiumSkin",
      progress: 100,
    },
    {
      id: "8",
      name: "Pisanie dziennika",
      description: "Zapisz przemyślenia każdego dnia",
      startDate: "2025-01-01",
      endDate: "2025-02-01",
      difficulty: "średnie drzewo",
      treeSkin: "StandardSkin",
      progress: 100,
    },
    {
      id: "9",
      name: "Spacer po lesie",
      description: "Spędź 30 minut na spacerze na świeżym powietrzu",
      startDate: "2025-01-01",
      endDate: "2025-02-15",
      difficulty: "duże drzewo",
      treeSkin: "PremiumSkin",
      progress: 100,
    },
    {
      id: "10",
      name: "Gotowanie w domu",
      description: "Przygotuj zdrowy posiłek codziennie",
      startDate: "2025-01-01",
      endDate: "2025-02-01",
      difficulty: "krzew",
      treeSkin: "StandardSkin",
      progress: 100,
    },
    {
      id: "11",
      name: "Codzienne bieganie",
      description: "Biegaj codziennie przez 30 minut!",
      startDate: "2025-01-01",
      endDate: "2025-02-01",
      difficulty: "krzew",
      treeSkin: "StandardSkin",
      progress: 100,
    },
    {
      id: "12",
      name: "Zdrowe odżywianie",
      description: "Jedz zdrowo każdego dnia",
      startDate: "2025-01-01",
      endDate: "2025-02-01",
      difficulty: "średnie drzewo",
      treeSkin: "PremiumSkin",
      progress: 100,
    },
    {
      id: "13",
      name: "Medytacja",
      description:
        "Codziennanutfdsfds medytacja przez 15 mifdsfCodziennanutCodziennanutfdsfds medytacja przez 15 mifdsfCodziennanutCodziennanutfdsfds medytacja przez 15 mifdsfCodziennanutCodziennanutfdsfds medytacja przez 15 mifdsfCodziennanutCodziennanutfdsfds medytacja przez 15 mifdsfCodziennanutCodziennanutfdsfds medytacja przez 15 mifdsfCodziennanutCodziennanutfdsfds medytacja przez 15 mifdsfCodziennanutCodziennanutfdsfds medytacja przez 15 mifdsfCodziennanutCodziennanutfdsfds medytacja przez 15 mifdsfCodziennanutCodziennanutfdsfds medytacja przez 15 mifdsfCodziennanutCodziennanutfdsfds medytacja przez 15 mifdsfCodziennanutCodziennanutfdsfds medytacja przez 15 mifdsfCodziennanutCodziennanutfdsfds medytacja przez 15 mifdsfCodziennanutCodziennanutfdsfds medytacja przez 15 mifdsfCodziennanutCodziennanutfdsfds medytacja przez 15 mifdsfCodziennanutCodziennanutfdsfds medytacja przez 15 mifdsfCodziennanutCodziennanutfdsfds medytacja przez 15 mifdsfCodziennanutCodziennanutfdsfds medytacja przez 15 mifdsfCodziennanutCodziennanutfdsfds medytacja przez 15 mifdsfCodziennanutfdsfds medytacja przez 15 mifdsfCodziennanutfdsfds medytacja przez 15 mifdsfCodziennanutfdsfds medytacja przez 15 mifdsfCodziennanutfdsfds medytacja przez 15 mifdsfCodziennanutfdsfds medytacja przez 15 mifdsfCodziennanutfdsfds medytacja przez 15 mifdsfCodziennanutfdsfds medytacja przez 15 mifdsf",
      startDate: "2025-01-01",
      endDate: "2025-02-01",
      difficulty: "duże drzewo",
      treeSkin: "StandardSkin",
      progress: 100,
    },
    {
      id: "14",
      name: "Nauka języka",
      description: "30 minut nauki języka dziennie",
      startDate: "2025-01-01",
      endDate: "2025-02-01",
      difficulty: "średnie drzewo",
      treeSkin: "StandardSkin",
      progress: 100,
    },
    {
      id: "15",
      name: "Czytanie książek",
      description: "Przeczytaj 20 stron dziennie",
      startDate: "2025-01-01",
      endDate: "2025-02-01",
      difficulty: "krzew",
      treeSkin: "PremiumSkin",
      progress: 100,
    },
    {
      id: "16",
      name: "Rowerowa przejażdżka",
      description: "Jeździj rowerem przez 10 km dziennie",
      startDate: "2025-01-01",
      endDate: "2025-02-11",
      difficulty: "średnie drzewo",
      treeSkin: "StandardSkin",
      progress: 100,
    },
    {
      id: "17",
      name: "Picie wody",
      description: "Pij 2 litry wody codziennie",
      startDate: "2025-01-01",
      endDate: "2025-02-04",
      difficulty: "krzew",
      treeSkin: "PremiumSkin",
      progress: 100,
    },
    {
      id: "18",
      name: "Pisanie dziennika",
      description: "Zapisz przemyślenia każdego dnia",
      startDate: "2025-01-01",
      endDate: "2025-02-04",
      difficulty: "średnie drzewo",
      treeSkin: "StandardSkin",
      progress: 100,
    },
    {
      id: "19",
      name: "Spacer po lesie",
      description: "Spędź 30 minut na spacerze na świeżym powietrzu",
      startDate: "2025-01-01",
      endDate: "2025-05-01",
      difficulty: "duże drzewo",
      treeSkin: "PremiumSkin",
      progress: 100,
    },
    {
      id: "20",
      name: "Gotowanie w domu",
      description: "Przygotuj zdrowy posiłek codziennie",
      startDate: "2025-01-01",
      endDate: "2025-04-01",
      difficulty: "krzew",
      treeSkin: "StandardSkin",
      progress: 100,
    },
  ];

  const getChallengeDurationInDays = (
    startDate: string,
    endDate: string
  ): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    return duration;
  };

  const getTreeImage = (difficulty: string, treeSkin: string): string => {
    const isPremium = treeSkin === "PremiumSkin";

    switch (difficulty.toLowerCase()) {
      case "krzew":
        return isPremium ? smallTreePremium : smallTreeStandard;
      case "średnie drzewo":
        return isPremium ? mediumTreePremium : mediumTreeStandard;
      case "duże drzewo":
      default:
        return isPremium ? bigTreePremium : bigTreeStandard;
    }
  };

  const getTreeSize = (difficulty: string): string => {
    switch (difficulty.toLowerCase()) {
      case "krzew":
        return styles.small;
      case "średnie drzewo":
        return styles.medium;
      case "duże drzewo":
        return styles.large;
      default:
        return styles.medium;
    }
  };

  const handleTreeClick = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedChallenge(null);
  };

  return (
    <div className={styles.forestContainer}>
      <div className={styles.treePositions}>
        {exampleChallenges.map((challenge) => (
          <div
            key={challenge.id}
            className={styles.treeWrapper}
            onClick={() => handleTreeClick(challenge)}
          >
            <img
              src={getTreeImage(challenge.difficulty, challenge.treeSkin)}
              alt={challenge.name}
              className={`${styles.treeImage} ${getTreeSize(
                challenge.difficulty
              )}`}
            />
            <div className={styles.treeInfo}>
              <h3>{challenge.name}</h3>
              <p>{`${getChallengeDurationInDays(
                challenge.startDate,
                challenge.endDate
              )} dni`}</p>
            </div>
          </div>
        ))}
      </div>

      <TreeDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        challenge={selectedChallenge}
        getTreeImage={getTreeImage}
      />
    </div>
  );
};
export default ForestTab;
