import React, { ReactNode } from "react";
import styles from "./Layout.module.css";

interface LayoutProps {
  header: ReactNode;
  content: ReactNode;
  footer: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ header, content, footer }) => {
  return (
    <>
      <header className={`${styles.header}`}>{header}</header>
      {content}
      <footer className={`${styles.footer}`}>{footer}</footer>
    </>
  );
};

export default Layout;
