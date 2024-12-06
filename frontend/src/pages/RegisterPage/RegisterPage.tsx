import React from 'react';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import styles from './RegisterPage.module.scss';

const RegisterPage: React.FC = () => {
    return (
        <div className={styles.container}>
            <div className={styles.overlay}></div>
            <div className={`${styles.registerBox} shadow-lg`}>
                <div className={`${styles.left} shadow-sm`}>
                    <h2 className="mb-3">Welcome to Register</h2>
                    <p>Start your journey today!</p>
                    <h3 className="mb-3">Join others on their way to improvement</h3>
                    
                </div>
                <div className={styles.right}>
                    <h2 className="text-secondary mb-2">Register</h2>
                    <form>
                        <label className={styles.label}>Email</label>
                        <input type="email" id="email" placeholder="Email" className={`${styles.input} form-control`} />

                        <label htmlFor="password" className={styles.label}>Password</label>
                        <input type="password" id="password" placeholder="Password" className={`${styles.input} form-control`} />

                        <label className={styles.label}>Confirm Password</label>
                        <input type="password" id="confirmPassword" placeholder="Confirm Password" className={`${styles.input} form-control`} />

                        <label className={styles.label}>Name</label>
                        <input type="text" id="confirmPassword" placeholder="Name" className={`${styles.input} form-control`} />

                        <label className={styles.label}>{"Last Name(Not Required)"}</label>
                        <input type="text" id="confirmPassword" placeholder="Last Name" className={`${styles.input} form-control`} />

                        <button type="submit" className={`${styles.signUpButton} mt-4`}>Register</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
