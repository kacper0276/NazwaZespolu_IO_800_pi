import React from 'react';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import styles from './MainPage.module.scss';

const MainPage: React.FC = () => {
    return (
        <div className={styles.container}>
            <div className={styles.overlay}></div>
        </div>
    );
};

export default MainPage;
