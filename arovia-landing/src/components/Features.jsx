import './Features.css';

const Features = () => {
    const features = [
        {
            icon: '🤖',
            title: 'AI-Powered Matching',
            description: 'Our intelligent algorithm analyzes your chronic condition and matches you with the most suitable specialists in your area.'
        },
        {
            icon: '💊',
            title: 'Chronic Disease Expertise',
            description: 'Access specialists with deep expertise in diabetes, heart disease, arthritis, COPD, and other chronic conditions.'
        },
        {
            icon: '✅',
            title: 'Verified Credentials',
            description: 'Every doctor is thoroughly vetted. View certifications, specializations, and patient reviews with confidence.'
        },
        {
            icon: '📅',
            title: 'Easy Appointment Booking',
            description: 'Book appointments in seconds. View real-time availability and choose times that work for your schedule.'
        },
        {
            icon: '💻',
            title: 'Telemedicine Support',
            description: 'Connect with specialists remotely through secure video consultations, perfect for follow-ups and routine check-ins.'
        },
        {
            icon: '📊',
            title: 'Health Record Management',
            description: 'Securely store and share your medical history, test results, and treatment plans with your care team.'
        }
    ];

    return (
        <section className="features section" id="features">
            <div className="container">
                <div className="section-header text-center">
                    <h2>Why Choose <span className="text-gradient">Arovia</span></h2>
                    <p className="section-description">
                        Everything you need to find and connect with the right specialist for your chronic disease management
                    </p>
                </div>

                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div key={index} className="feature-card" style={{ animationDelay: `${index * 0.1}s` }}>
                            <div className="feature-icon">{feature.icon}</div>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
