import './HowItWorks.css';

const HowItWorks = () => {
    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const steps = [
        {
            number: '01',
            title: 'Tell Us About Your Condition',
            description: 'Share details about your chronic disease, symptoms, and what you\'re looking for in a specialist.',
            icon: '📝'
        },
        {
            number: '02',
            title: 'Get Matched with Specialists',
            description: 'Our AI analyzes your needs and recommends verified specialists with expertise in your condition.',
            icon: '🎯'
        },
        {
            number: '03',
            title: 'Review Doctor Profiles',
            description: 'Explore detailed profiles, credentials, patient reviews, and availability to find your perfect match.',
            icon: '👨‍⚕️'
        },
        {
            number: '04',
            title: 'Book Your Appointment',
            description: 'Schedule your consultation with just a few clicks and start your journey to better health.',
            icon: '✨'
        }
    ];

    return (
        <section className="how-it-works section" id="how-it-works">
            <div className="container">
                <div className="section-header text-center">
                    <h2>How <span className="text-gradient">Arovia</span> Works</h2>
                    <p className="section-description">
                        Finding the right specialist for your chronic disease is simple with our streamlined process
                    </p>
                </div>

                <div className="steps-container">
                    {steps.map((step, index) => (
                        <div key={index} className="step-card">
                            <div className="step-number">{step.number}</div>
                            <div className="step-icon">{step.icon}</div>
                            <h3>{step.title}</h3>
                            <p>{step.description}</p>
                            {index < steps.length - 1 && (
                                <div className="step-connector">
                                    <svg width="100%" height="2" viewBox="0 0 100 2" preserveAspectRatio="none">
                                        <line x1="0" y1="1" x2="100" y2="1" stroke="url(#gradient)" strokeWidth="2" strokeDasharray="5,5" />
                                        <defs>
                                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="var(--primary-blue)" />
                                                <stop offset="100%" stopColor="var(--accent-purple)" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="cta-section">
                    <button className="btn btn-primary btn-large" onClick={() => scrollToSection('home')}>
                        Get Started Now
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
