import React, { ReactNode } from "react";
import styles from "./Layout.module.css";

interface LayoutProps {
  header: ReactNode;
  content: ReactNode;
  footer: ReactNode;
  sidebar: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ header, content, footer, sidebar }) => {
  return (
    <div>
      <header>{header}</header>
      <div className="d-flex">
        <aside >{sidebar}</aside>
        <main >{content}</main>
      </div>
      <footer >{footer}</footer>
    </div>
  );
};

export default Layout;
