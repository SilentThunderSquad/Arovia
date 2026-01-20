import { Link } from 'react-router-dom';
import './Auth.css';

const AuthLayout = ({ children, title, subtitle, type }) => {
    return (
        <div className="auth-page">
            <div className="auth-background">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
                <div className="gradient-orb orb-3"></div>
            </div>

            <div className="auth-container">
                <div className="auth-branding">
                    <Link to="/" className="auth-logo">
                        <span className="logo-icon">🏥</span>
                        <span className="logo-text">Arovia</span>
                    </Link>

                    <div className="branding-content">
                        <h1>Find the Right Specialist for Your Chronic Disease</h1>
                        <p>Join thousands of patients who found expert care through our platform</p>

                        <div className="branding-features">
                            <div className="feature-item">
                                <div className="feature-icon">✓</div>
                                <span>10,000+ Verified Specialists</span>
                            </div>
                            <div className="feature-item">
                                <div className="feature-icon">✓</div>
                                <span>AI-Powered Matching</span>
                            </div>
                            <div className="feature-item">
                                <div className="feature-icon">✓</div>
                                <span>Secure & Confidential</span>
                            </div>
                            <div className="feature-item">
                                <div className="feature-icon">✓</div>
                                <span>24/7 Support</span>
                            </div>
                        </div>

                        <div className="branding-illustration">
                            <div className="floating-card">
                                <div className="card-icon">💊</div>
                                <div className="card-text">Expert Care</div>
                            </div>
                            <div className="floating-card">
                                <div className="card-icon">📅</div>
                                <div className="card-text">Easy Booking</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="auth-form-section">
                    <div className="auth-form-container">
                        <div className="auth-header">
                            <h2>{title}</h2>
                            <p>{subtitle}</p>
                        </div>

                        {children}

                        <div className="auth-divider">
                            <span>or continue with</span>
                        </div>

                        <div className="social-auth">
                            <button className="social-btn google">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M19.8 10.2273C19.8 9.51818 19.7364 8.83636 19.6182 8.18182H10V12.05H15.4818C15.2364 13.3 14.5273 14.3591 13.4727 15.0682V17.5773H16.7636C18.7182 15.8364 19.8 13.2727 19.8 10.2273Z" fill="#4285F4" />
                                    <path d="M10 20C12.7 20 14.9636 19.1045 16.7636 17.5773L13.4727 15.0682C12.5727 15.6682 11.4182 16.0227 10 16.0227C7.39545 16.0227 5.19091 14.2636 4.40455 11.9H0.995455V14.4909C2.78636 18.0591 6.10909 20 10 20Z" fill="#34A853" />
                                    <path d="M4.40455 11.9C4.19545 11.3 4.07727 10.6591 4.07727 10C4.07727 9.34091 4.19545 8.7 4.40455 8.1V5.50909H0.995455C0.363636 6.77273 0 8.18182 0 9.65909C0 11.1364 0.363636 12.5455 0.995455 13.8091L4.40455 11.9Z" fill="#FBBC04" />
                                    <path d="M10 3.97727C11.5545 3.97727 12.9409 4.48182 14.0273 5.51818L16.9409 2.60455C15.1636 0.954545 12.8909 0 10 0C6.10909 0 2.78636 1.94091 0.995455 5.50909L4.40455 8.1C5.19091 5.73636 7.39545 3.97727 10 3.97727Z" fill="#EA4335" />
                                </svg>
                                Google
                            </button>
                            <button className="social-btn facebook">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" />
                                </svg>
                                Facebook
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
