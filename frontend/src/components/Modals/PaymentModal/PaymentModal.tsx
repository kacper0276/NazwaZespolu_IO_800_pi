import React, { useState } from "react";
import styles from "./PaymentModal.module.scss";
import { useUser } from "../../../context/UserContext";
import { useApiJson } from "../../../config/api";
import { ApiResponse } from "../../../types/api.types";
import { PaymentType } from "../../../types/IPayment";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose }) => {
  const userHook = useUser();
  const api = useApiJson();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<string>("");

  if (!isOpen) return null;

  const payForPremiumAccount = async (event: React.FormEvent) => {
    event.preventDefault();

    const data = {
      profileId: userHook.user?.profileId,
      amount: 15,
      paymentStatus: "new",
      paymentMethod,
    };

    api
      .post<ApiResponse<PaymentType>>("payments", data)
      .then((res) => {
        toast.success(t(res.data.message));
        navigate("/");
      })
      .catch((_err) => {
        toast.error(t("error"));
      });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Select Payment Method</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.paymentOptions}>
          <div className={styles.paymentMethod}>
            <input
              type="radio"
              id="card"
              name="payment"
              value="card"
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <label htmlFor="card">
              <i className="bi bi-credit-card"></i>
              Credit/Debit Card
            </label>
          </div>

          <div className={styles.paymentMethod}>
            <input
              type="radio"
              id="paypal"
              name="payment"
              value="paypal"
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <label htmlFor="paypal">
              <i className="bi bi-paypal"></i>
              PayPal
            </label>
          </div>

          <div className={styles.paymentMethod}>
            <input
              type="radio"
              id="bank"
              name="payment"
              value="bank"
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <label htmlFor="bank">
              <i className="bi bi-bank"></i>
              Bank Transfer
            </label>
          </div>
        </div>

        <div className={styles.paymentDetails}>
          <div className={styles.formGroup}>
            <label>Card Number</label>
            <input type="text" placeholder="XXXX XXXX XXXX XXXX" />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Expiry Date</label>
              <input type="text" placeholder="MM/YY" />
            </div>
            <div className={styles.formGroup}>
              <label>CVV</label>
              <input type="text" placeholder="XXX" />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Cardholder Name</label>
            <input type="text" placeholder="Full Name" />
          </div>
        </div>

        <div className={styles.summary}>
          <div className={styles.summaryItem}>
            <span>Premium Plan (Monthly)</span>
            <span>$15.00</span>
          </div>
          <div className={`${styles.summaryItem} ${styles.total}`}>
            <span>Total</span>
            <span>$15.00</span>
          </div>
        </div>

        <button className={styles.payButton} onClick={payForPremiumAccount}>
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;
