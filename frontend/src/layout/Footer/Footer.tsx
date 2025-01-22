import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="container-fluid bg-light py-3">
      <div className="container d-flex justify-content-center align-items-center">
        <p className="m-0">
          <Link to="#">{t("statute")}</Link> &middot;{" "}
          <Link to="#">{t("contact")}</Link>{" "}
          <Link to="#">{t("privacy-policy")}</Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
