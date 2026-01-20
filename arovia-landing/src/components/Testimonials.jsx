import { useState } from 'react';
import './Testimonials.css';

const Testimonials = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const testimonials = [
        {
            name: 'Sarah Johnson',
            condition: 'Type 2 Diabetes',
            image: '👩‍💼',
            rating: 5,
            text: 'Arovia helped me find an endocrinologist who truly understands diabetes management. The booking process was seamless, and my doctor has been amazing in helping me control my blood sugar levels.'
        },
        {
            name: 'Michael Chen',
            condition: 'Rheumatoid Arthritis',
            image: '👨‍💻',
            rating: 5,
            text: 'Living with arthritis was challenging until I found the right rheumatologist through Arovia. The platform made it so easy to compare specialists and read real patient reviews.'
        },
        {
            name: 'Emily Rodriguez',
            condition: 'COPD',
            image: '👩‍🏫',
            rating: 5,
            text: 'As someone with COPD, finding a pulmonologist who specializes in chronic respiratory conditions was crucial. Arovia connected me with the perfect doctor within days.'
        },
        {
            name: 'David Thompson',
            condition: 'Heart Disease',
            image: '👨‍⚕️',
            rating: 5,
            text: 'After my heart attack, I needed a cardiologist quickly. Arovia\'s AI matching found me three excellent specialists. I\'m now receiving top-notch care and feeling much better.'
        }
    ];

    const nextTestimonial = () => {
        setActiveIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    return (
        <section className="testimonials section" id="testimonials">
            <div className="container">
                <div className="section-header text-center">
                    <h2>What Our <span className="text-gradient">Patients</span> Say</h2>
                    <p className="section-description">
                        Real stories from patients who found the right specialist through Arovia
                    </p>
                </div>

                <div className="testimonials-slider">
                    <button className="slider-btn prev" onClick={prevTestimonial} aria-label="Previous testimonial">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>

                    <div className="testimonial-card">
                        <div className="testimonial-header">
                            <div className="testimonial-avatar">
                                {testimonials[activeIndex].image}
                            </div>
                            <div className="testimonial-info">
                                <h4>{testimonials[activeIndex].name}</h4>
                                <p className="condition">{testimonials[activeIndex].condition}</p>
                                <div className="rating">
                                    {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                                        <span key={i} className="star">⭐</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <p className="testimonial-text">"{testimonials[activeIndex].text}"</p>
                    </div>

                    <button className="slider-btn next" onClick={nextTestimonial} aria-label="Next testimonial">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>

                <div className="testimonial-dots">
                    {testimonials.map((_, index) => (
                        <button
                            key={index}
                            className={`dot ${index === activeIndex ? 'active' : ''}`}
                            onClick={() => setActiveIndex(index)}
                            aria-label={`Go to testimonial ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
