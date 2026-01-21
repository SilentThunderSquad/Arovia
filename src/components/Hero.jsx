import './Hero.css';

const Hero = () => {
    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="hero" id="home">
            <div className="hero-background">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
                <div className="gradient-orb orb-3"></div>

                {/* 3D Floating Medical Icons */}
                <div className="floating-medical-icon icon-1">🏥</div>
                <div className="floating-medical-icon icon-2">💊</div>
                <div className="floating-medical-icon icon-3">❤️</div>
                <div className="floating-medical-icon icon-4">🩺</div>
                <div className="floating-medical-icon icon-5">💉</div>
                <div className="floating-medical-icon icon-6">⚕️</div>

                {/* Medical Particles */}
                <div className="medical-particle"></div>
                <div className="medical-particle"></div>
                <div className="medical-particle"></div>
                <div className="medical-particle"></div>
                <div className="medical-particle"></div>
                <div className="medical-particle"></div>
                <div className="medical-particle"></div>
                <div className="medical-particle"></div>
                <div className="medical-particle"></div>
            </div>

            <div className="container">
                <div className="hero-content">
                    <div className="hero-text">
                        <div className="hero-badge">
                            <span className="badge-dot"></span>
                            Specialized Care for Chronic Conditions
                        </div>

                        <h1 className="hero-title">
                            Find the Right <span className="text-gradient">Specialist</span> for Your Chronic Disease
                        </h1>

                        <p className="hero-description">
                            Arovia connects you with verified specialist doctors who understand chronic diseases.
                            Get personalized recommendations, expert care, and seamless appointment booking—all in one place.
                        </p>

                        <div className="hero-cta">
                            <button className="btn btn-primary btn-large" onClick={() => scrollToSection('features')}>
                                Find Your Specialist
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            <button className="btn btn-secondary btn-large" onClick={() => scrollToSection('mission')}>
                                Learn More
                            </button>
                        </div>

                        <div className="hero-stats">
                            <div className="stat">
                                <div className="stat-number">10,000+</div>
                                <div className="stat-label">Verified Specialists</div>
                            </div>
                            <div className="stat">
                                <div className="stat-number">50,000+</div>
                                <div className="stat-label">Patients Helped</div>
                            </div>
                            <div className="stat">
                                <div className="stat-number">95%</div>
                                <div className="stat-label">Satisfaction Rate</div>
                            </div>
                        </div>
                    </div>

                    <div className="hero-image">
                        <div className="image-wrapper">
                            <img
                                src="/hero-medical.png"
                                alt="Healthcare professionals providing specialist care"
                                className="animate-float"
                            />
                            <div className="floating-card card-1">
                                <div className="card-icon">💊</div>
                                <div className="card-text">Chronic Disease Experts</div>
                            </div>
                            <div className="floating-card card-2">
                                <div className="card-icon">⚕️</div>
                                <div className="card-text">Verified Credentials</div>
                            </div>
                            <div className="floating-card card-3">
                                <div className="card-icon">📅</div>
                                <div className="card-text">Easy Booking</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
