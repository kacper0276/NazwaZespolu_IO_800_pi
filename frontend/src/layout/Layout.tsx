import React, { ReactNode } from "react";
import styles from "./Layout.module.css";

interface LayoutProps {
  header: ReactNode;
  content: ReactNode;
  footer: ReactNode;
}

const Layout: React.FC<LayoutProps> = (props) => {
  return (
    <>
      <header className={`${styles.header}`}>{props.header}</header>
      <>{props.content}</>
      <footer className={`${styles.footer}`}>{props.footer}</footer>
    </>
  );
};

export default Layout;
