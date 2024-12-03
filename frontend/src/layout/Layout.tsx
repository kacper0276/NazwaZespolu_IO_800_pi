import React, { ReactNode } from "react";
import styles from "./Layout.module.css";

interface LayoutProps {
  header: ReactNode;
  content: ReactNode;
  footer: ReactNode;
  hideHeaderFooter?: boolean; // Nowa opcja
}

const Layout: React.FC<LayoutProps> = ({ header, content, footer, hideHeaderFooter }) => {
  return (
    <>
      {!hideHeaderFooter && <header className={`${styles.header}`}>{header}</header>}
      {content}
      {!hideHeaderFooter && <footer className={`${styles.footer}`}>{footer}</footer>}
    </>
  );
};

export default Layout;
