import { FC, ReactNode } from "react";
import styles from "./Modal.module.scss";

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
}

const Modal: FC<ModalProps> = ({ onClose, children }) => {
  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
