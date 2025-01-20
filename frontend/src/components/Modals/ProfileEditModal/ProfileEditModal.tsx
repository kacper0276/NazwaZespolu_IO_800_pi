import React, { useState, useRef } from 'react';
import { useApiMultipart } from '../../../config/api'; 
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import styles from './ProfileEditModal.module.scss';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDescription: string;
  currentProfileImage?: string;
  currentBackgroundImage?: string;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  currentDescription,
}) => {
  const { t } = useTranslation();
  const api = useApiMultipart(); 
  const [description, setDescription] = useState(currentDescription);
  const profileImageRef = useRef<HTMLInputElement>(null);
  const backgroundImageRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('description', description);
    
    if (profileImageRef.current?.files?.[0]) {
      formData.append('profileImage', profileImageRef.current.files[0]);
    }
    if (backgroundImageRef.current?.files?.[0]) {
      formData.append('backgroundImage', backgroundImageRef.current.files[0]);
    }
    
    try {
      //patch przykladowy
      await api.patch('endpoint', formData);
      toast.success(t('profile-updated'));
      onClose();
    } catch (error) {
      toast.error(t('error-updating-profile'));
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>Edytuj profil</h2>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Opis profilu</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Napisz coś o sobie..."
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Zdjęcie profilowe</label>
            <input
              type="file"
              accept="image/*"
              ref={profileImageRef}
              className={styles.fileInput}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label>Zdjęcie w tle</label>
            <input
              type="file"
              accept="image/*"
              ref={backgroundImageRef}
              className={styles.fileInput}
            />
          </div>
          
          <div className={styles.buttonContainer}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              Anuluj
            </button>
            <button
              type="submit"
              className={styles.saveButton}
            >
              Zapisz zmiany
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditModal;