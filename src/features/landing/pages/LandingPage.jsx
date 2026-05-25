import Header from '@features/landing/components/Header';
import Hero from '@features/landing/sections/Hero';
import Mission from '@features/landing/sections/Mission';
import Features from '@features/landing/sections/Features';
import HowItWorks from '@features/landing/sections/HowItWorks';
import Testimonials from '@features/landing/components/Testimonials';
import Footer from '@features/landing/components/Footer';

function LandingPage() {
    return (
        <div className="App">
            <Header />
            <main>
                <Hero />
                <Mission />
                <Features />
                <HowItWorks />
                <Testimonials />
            </main>
            <Footer />
        </div>
    );
}

export default LandingPage;
