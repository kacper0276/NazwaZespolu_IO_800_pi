import React from 'react';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import styles from './WelcomePage.module.scss';

const WelcomePage: React.FC = () => {
    return (
        <div className={styles.container}>
            <div className={styles.overlay}></div>
            <div className={`${styles.loginBox} shadow-lg`}>
                <div className={styles.left}>
                    <h2 className="text-secondary mb-4">Sign In</h2>
                    <form>
                        <label htmlFor="username" className={styles.label}>Username</label>
                        <input type="text" id="username" placeholder="Username" className={`${styles.input} form-control`} />
                        
                        <label htmlFor="password" className={styles.label}>Password</label>
                        <input type="password" id="password" placeholder="Password" className={`${styles.input} form-control`} />
                        
                        <div className={`mt-3 d-flex flex-row `}>
                            <input type="checkbox" id="remember" className={`${styles.check} form-check`} />
                            <label htmlFor="remember" className="form-check-label">Remember Me</label>
                        </div>
                        
                        <button type="submit" className={`${styles.signInButton} mt-5`}>Sign In</button>
                    </form>
                    <a href="#" className={`${styles.link} d-block mt-3`}>Forgot Password?</a>
                </div>
                <div className={`${styles.right} shadow-sm`}>
                    <h2 className="mb-3">Welcome to login</h2>
                    <p>Don't have an account?</p>
                    <a href="#" className={`${styles.signUpButton} mt-3`}>Sign Up</a>
                </div>
            </div>
        </div>
    );
};

export default WelcomePage;
