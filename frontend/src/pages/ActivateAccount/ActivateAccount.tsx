import React from "react";
import styles from "./ActivateAccount.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import { apiJson } from "../../config/api";
import { ApiResponse } from "../../types/api.types";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const ActivateAccount: React.FC = () => {
  const { t } = useTranslation();
  const params = useParams();
  const navigate = useNavigate();

  const activateAccount = async () => {
    try {
      const res = await apiJson.patch<ApiResponse>(
        `users/activate-account`,
        {},
        {
          params: {
            userEmail: params.userEmail,
          },
        }
      );

      toast.success(t(res.data.message));

      if (res.status === 200) {
        navigate("/welcome-page");
      }
    } catch (err: any) {
      toast.error(t(err.response?.data.message || err.message));
    }
  };

  return (
    <div className={styles.container}>
      <h1>Aktywuj konto</h1>
      <p>Aby aktywować konto naciśnij przycisk</p>
      <button onClick={activateAccount}>Klik</button>
    </div>
  );
};

export default ActivateAccount;
