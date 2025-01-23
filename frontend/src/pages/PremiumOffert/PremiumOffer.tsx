import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./PremiumOffer.module.scss";
import PaymentModal from '../../components/Modals/PaymentModal/PaymentModal';

const PremiumOffer: React.FC = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className={styles.formContainer}>
      <div className={`container ${styles.offerContainer}`}>
        <h1 className={`text-center ${styles.title}`}>{t("title")}</h1>
        <div className="row">
          {/* Standard Plan */}
          <div className={`col-md-6 ${styles.cardWrapper}`}>
            <div className={styles.card}>
              <h3 className={styles.planTitle}>{t("plans.standard.name")}</h3>
              <p className={styles.price}>{t("plans.standard.price")}</p>
              <ul className={styles.features}>
                <li>{t("plans.standard.features.0")}</li>
                <li>{t("plans.standard.features.1")}</li>
                <li>{t("plans.standard.features.2")}</li>
                <li>{t("plans.standard.features.3")}</li>
              </ul>
            </div>
          </div>
          {/* Premium Plan */}
          <div className={`col-md-6 ${styles.cardWrapper}`}>
            <div className={`${styles.card} ${styles.premiumCard}`}>
              <h3 className={styles.planTitle}>{t("plans.premium.name")}</h3>
              <p className={styles.price}>{t("plans.premium.price")}</p>
              <ul className={styles.features}>
                <li>{t("plans.premium.features.0")}</li>
                <li>{t("plans.premium.features.1")}</li>
                <li>{t("plans.premium.features.2")}</li>
                <li>{t("plans.premium.features.3")}</li>
                <li>{t("plans.premium.features.4")}</li>
                <li>{t("plans.premium.features.5")}</li>
              </ul>
              <button
                className={styles.purchaseButton}
                onClick={() => setIsModalOpen(true)}
              >
                {t("plans.premium.purchaseButton")}
              </button>
            </div>
          </div>
        </div>
      </div>
      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default PremiumOffer;