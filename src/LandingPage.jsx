import Header from './components/Header'
import Hero from './components/Hero'
import Mission from './components/Mission'
import Features from './components/Features'
import HowItWorks from './components/HowItWorks'
import Testimonials from './components/Testimonials'
import Footer from './components/Footer'

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
    )
}

export default LandingPage
