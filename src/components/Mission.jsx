import './Mission.css';

const Mission = () => {
    return (
        <section className="mission section" id="mission">
            <div className="container">
                <div className="mission-content">
                    <div className="mission-image">
                        <img
                            src="/mission-visual.png"
                            alt="Arovia mission - connecting patients with specialists"
                        />
                    </div>

                    <div className="mission-text">
                        <h2>Our Mission</h2>
                        <p className="mission-motto">
                            <strong>Empowering patients with chronic diseases to find the right specialist care, when they need it most.</strong>
                        </p>

                        <p className="mission-description">
                            Living with a chronic disease shouldn't mean struggling to find the right doctor.
                            At Arovia, we believe every patient deserves access to specialists who truly understand
                            their condition and can provide personalized, compassionate care.
                        </p>

                        <div className="mission-values">
                            <div className="value-card">
                                <div className="value-icon">🤝</div>
                                <h4>Trust</h4>
                                <p>Every specialist is thoroughly verified and credentialed</p>
                            </div>

                            <div className="value-card">
                                <div className="value-icon">🎯</div>
                                <h4>Expertise</h4>
                                <p>Specialists with proven experience in chronic disease management</p>
                            </div>

                            <div className="value-card">
                                <div className="value-icon">🌐</div>
                                <h4>Accessibility</h4>
                                <p>Easy access to care through our platform, anytime, anywhere</p>
                            </div>

                            <div className="value-card">
                                <div className="value-icon">❤️</div>
                                <h4>Care</h4>
                                <p>Patient-centered approach focused on your unique needs</p>
                            </div>
                        </div>

                        <div className="mission-aim">
                            <h3>What We Aim to Provide</h3>
                            <ul className="aim-list">
                                <li>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span><strong>Personalized Matching:</strong> AI-powered recommendations based on your specific chronic condition</span>
                                </li>
                                <li>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span><strong>Comprehensive Profiles:</strong> Detailed information about each specialist's expertise and experience</span>
                                </li>
                                <li>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span><strong>Seamless Booking:</strong> Schedule appointments with just a few clicks</span>
                                </li>
                                <li>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span><strong>Ongoing Support:</strong> Telemedicine options and continuous care coordination</span>
                                </li>
                                <li>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span><strong>Health Records:</strong> Secure management of your medical history and treatment plans</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Mission;
