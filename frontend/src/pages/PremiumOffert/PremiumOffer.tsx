import React, { useState } from "react";
import styles from "./PremiumOffer.module.scss";
import PaymentModal from '../../components/Modals/PaymentModal/PaymentModal';

const PremiumOffer: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className={styles.formContainer}>
      <div className={`container ${styles.offerContainer}`}>
        <h1 className={`text-center ${styles.title}`}>Choose Your Version</h1>
        <div className="row">
          {/* Standard Plan */}
          <div className={`col-md-6 ${styles.cardWrapper}`}>
            <div className={styles.card}>
              <h3 className={styles.planTitle}>Standard</h3>
              <p className={styles.price}>Free</p>
              <ul className={styles.features}>
                <li>Basic Access to Features</li>
                <li>Access to Public Content</li>
                <li>Community Support</li>
                <li>15 Projects at once Limit</li>
              </ul>
            </div>
          </div>

          {/* Premium Plan */}
          <div className={`col-md-6 ${styles.cardWrapper}`}>
            <div className={`${styles.card} ${styles.premiumCard}`}>
              <h3 className={styles.planTitle}>Premium</h3>
              <p className={styles.price}>15$ / month</p>
              <ul className={styles.features}>
                <li>All Standard Features</li>
                <li>Special Mark in Nickname</li>
                <li>Priority Support</li>
                <li>Unlimited Projects at once</li>
                <li>Premium Skins</li>
                <li>Ads removed</li>
              </ul>
              <button 
                className={styles.purchaseButton}
                onClick={() => setIsModalOpen(true)}
              >
                Purchase Now
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