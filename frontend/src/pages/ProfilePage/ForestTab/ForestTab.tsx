import { useEffect, useState } from "react";
import styles from "./ForestTab.module.scss";
import smallTreeStandard from "../../../assets/images/Trees/SmallTree/10.png";
import mediumTreeStandard from "../../../assets/images/Trees/MediumTree/10.png";
import bigTreeStandard from "../../../assets/images/Trees/BigTree/10.png";
import smallTreePremium from "../../../assets/images/Trees/SmallTreePremium/10p.png";
import mediumTreePremium from "../../../assets/images/Trees/MediumTreePremium/10p.png";
import bigTreePremium from "../../../assets/images/Trees/BigTreePremium/10p.png";
import TreeDetailModal from "../../../components/Modals/TreeDetailsModal/TreeDetailsModal";
import useWebsiteTitle from "../../../hooks/useWebsiteTitle";
import { GoalType } from "../../../types/IGoal";
import { useApiJson } from "../../../config/api";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ApiResponse } from "../../../types/api.types";
import Spinner from "../../../components/Spinner/Spinner";
import { useUser } from "../../../context/UserContext";

const ForestTab = () => {
  const { t } = useTranslation();
  useWebsiteTitle(t("forest"));
  const api = useApiJson();
  const userHook = useUser();
  const { profileId } = useParams();
  const [selectedChallenge, setSelectedChallenge] = useState<GoalType | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [challenges, setChallenges] = useState<GoalType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

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

  const handleTreeClick = (challenge: GoalType) => {
    setSelectedChallenge(challenge);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedChallenge(null);
  };

  useEffect(() => {
    setLoading(true);
    api
      .get<ApiResponse<GoalType[]>>(
        `goals/find-complete-by-profile/${profileId}`
      )
      .then((res) => {
        setChallenges(res.data.data ?? []);
      })
      .catch((_err) => {
        toast.error(t("error-fetching-data"));
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className={styles.forestContainer}>
      <div className={styles.treePositions}>
        {loading ? (
          <Spinner />
        ) : (
          challenges.map((challenge) =>
            userHook.user?.profileId === challenge.profileId ||
            challenge.visibility === "public" ? (
              <div
                key={challenge._id}
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
                    new Date(challenge.startDate).toISOString(),
                    new Date(challenge.endDate).toISOString()
                  )} dni`}</p>
                </div>
              </div>
            ) : null
          )
        )}
      </div>

      {selectedChallenge ? (
        <TreeDetailModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          challenge={selectedChallenge}
          getTreeImage={getTreeImage}
        />
      ) : null}
    </div>
  );
};
export default ForestTab;
