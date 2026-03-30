import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './LegalPage.css';

const TermsOfService = () => {
    return (
        <div className="legal-page">
            <Header />

            <div className="legal-hero">
                <h1>Terms of Service</h1>
                <p className="legal-subtitle">Last updated: March 30, 2026</p>
            </div>

            <div className="legal-content">
                <Link to="/" className="legal-back">← Back to Home</Link>

                <section>
                    <h2>Acceptance of Terms</h2>
                    <p>
                        By accessing or using the Arovia platform at{' '}
                        <a href="https://arovia.silentthundersquad.in" target="_blank" rel="noopener noreferrer">
                            arovia.silentthundersquad.in
                        </a>{' '}
                        (the "Platform"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree
                        to these Terms, you must not use the Platform.
                    </p>
                    <p>
                        These Terms constitute a legally binding agreement between you ("User," "you," or "your") and
                        Arovia ("we," "us," or "our").
                    </p>
                </section>

                <section>
                    <h2>Description of Service</h2>
                    <p>
                        Arovia is a healthcare technology platform that connects patients with chronic diseases to
                        verified specialist doctors. Our services include:
                    </p>
                    <ul>
                        <li>Specialist doctor search and matching based on chronic conditions.</li>
                        <li>Online appointment booking and management.</li>
                        <li>Patient health profile management.</li>
                        <li>Doctor verification and credential validation.</li>
                        <li>Health information resources and educational content.</li>
                    </ul>
                    <div className="info-card">
                        <p>
                            <strong>Important:</strong> Arovia is a technology platform that facilitates connections between
                            patients and doctors. We do not provide medical advice, diagnosis, or treatment ourselves.
                        </p>
                    </div>
                </section>

                <section>
                    <h2>User Accounts</h2>

                    <h3>1. Registration</h3>
                    <p>
                        To access certain features, you must create an account. You agree to provide accurate, complete,
                        and current information during registration and to update it as necessary.
                    </p>

                    <h3>2. Account Security</h3>
                    <ul>
                        <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
                        <li>You are responsible for all activities that occur under your account.</li>
                        <li>You must notify us immediately of any unauthorized use of your account.</li>
                        <li>We reserve the right to suspend or terminate accounts that violate these Terms.</li>
                    </ul>

                    <h3>3. Account Types</h3>
                    <p>
                        The Platform supports multiple account types including Patient accounts and Doctor accounts. Each
                        account type has specific features, responsibilities, and verification requirements.
                    </p>
                </section>

                <section>
                    <h2>User Responsibilities</h2>
                    <p>When using the Platform, you agree to:</p>
                    <ul>
                        <li>Provide truthful and accurate information about yourself and your health conditions.</li>
                        <li>Use the Platform only for lawful purposes and in accordance with these Terms.</li>
                        <li>Not impersonate any person or entity, or misrepresent your affiliation with any person or entity.</li>
                        <li>Not attempt to gain unauthorized access to any part of the Platform or its systems.</li>
                        <li>Not upload or transmit any malicious code, viruses, or harmful content.</li>
                        <li>Not use the Platform to harass, abuse, or harm another person.</li>
                        <li>Not scrape, data mine, or use automated means to access the Platform without our permission.</li>
                    </ul>
                </section>

                <section>
                    <h2>Doctor Verification</h2>
                    <p>
                        Doctors listed on the Platform undergo a verification process that includes credential checks and
                        identity verification. However:
                    </p>
                    <ul>
                        <li>We do not guarantee the accuracy or completeness of doctor profiles.</li>
                        <li>Verification does not constitute an endorsement or recommendation of any doctor.</li>
                        <li>Users should independently verify a doctor's credentials and suitability.</li>
                        <li>We are not responsible for the quality of medical advice or treatment provided by doctors.</li>
                    </ul>
                </section>

                <section>
                    <h2>Medical Disclaimer</h2>
                    <div className="info-card">
                        <p>
                            The Platform does not provide medical advice. Content on the Platform is for informational
                            purposes only and should not be considered a substitute for professional medical advice,
                            diagnosis, or treatment. Always seek the advice of a qualified healthcare provider with any
                            questions regarding a medical condition.
                        </p>
                    </div>
                    <p>
                        In case of a medical emergency, call your local emergency services immediately. Do not rely on
                        the Platform for emergency medical situations.
                    </p>
                </section>

                <section>
                    <h2>Intellectual Property</h2>
                    <p>
                        All content, features, and functionality on the Platform — including but not limited to text,
                        graphics, logos, icons, images, software, and the overall design — are owned by Arovia or its
                        licensors and are protected by copyright, trademark, and other intellectual property laws.
                    </p>
                    <ul>
                        <li>You may not reproduce, distribute, modify, or create derivative works from our content without express written permission.</li>
                        <li>The "Arovia" name, logo, and related marks are trademarks of Arovia. Unauthorized use is prohibited.</li>
                    </ul>
                </section>

                <section>
                    <h2>Privacy</h2>
                    <p>
                        Your use of the Platform is also governed by our{' '}
                        <Link to="/privacy-policy">Privacy Policy</Link>, which describes how we collect, use, and
                        protect your personal information. By using the Platform, you consent to our data practices as
                        described in the Privacy Policy.
                    </p>
                </section>

                <section>
                    <h2>Limitation of Liability</h2>
                    <p>
                        To the fullest extent permitted by applicable law:
                    </p>
                    <ul>
                        <li>Arovia shall not be liable for any indirect, incidental, special, consequential, or punitive damages.</li>
                        <li>Our total liability for any claim arising from the use of the Platform shall not exceed the amount you paid to us in the preceding 12 months.</li>
                        <li>We are not responsible for any damages resulting from the actions or advice of doctors accessed through the Platform.</li>
                        <li>We do not guarantee uninterrupted, secure, or error-free access to the Platform.</li>
                    </ul>
                </section>

                <section>
                    <h2>Indemnification</h2>
                    <p>
                        You agree to indemnify, defend, and hold harmless Arovia, its officers, directors, employees,
                        partners, and agents from any claims, liabilities, damages, losses, costs, or expenses
                        (including reasonable legal fees) arising from:
                    </p>
                    <ul>
                        <li>Your use of or access to the Platform.</li>
                        <li>Your violation of these Terms.</li>
                        <li>Your violation of any third-party rights.</li>
                        <li>Any content you submit or transmit through the Platform.</li>
                    </ul>
                </section>

                <section>
                    <h2>Termination</h2>
                    <p>
                        We reserve the right to suspend or terminate your access to the Platform at any time, with or
                        without cause, and with or without notice. Upon termination:
                    </p>
                    <ul>
                        <li>Your right to use the Platform ceases immediately.</li>
                        <li>We may delete or retain your data in accordance with our Privacy Policy.</li>
                        <li>Provisions that by their nature should survive termination will remain in effect.</li>
                    </ul>
                </section>

                <section>
                    <h2>Governing Law</h2>
                    <p>
                        These Terms shall be governed by and construed in accordance with the laws of India. Any disputes
                        arising from these Terms or your use of the Platform shall be subject to the exclusive jurisdiction
                        of the courts in India.
                    </p>
                </section>

                <section>
                    <h2>Changes to Terms</h2>
                    <p>
                        We reserve the right to modify these Terms at any time. We will notify you of material changes by
                        posting the updated Terms on this page with a new "Last updated" date. Your continued use of the
                        Platform after changes constitutes acceptance of the revised Terms.
                    </p>
                </section>

                <section>
                    <h2>Contact Us</h2>
                    <p>If you have any questions about these Terms of Service, please contact us:</p>
                    <ul>
                        <li><strong>Email:</strong> <a href="mailto:support@arovia.in">support@arovia.in</a></li>
                        <li><strong>Phone:</strong> <a href="tel:+911234567890">+91 1234567890</a></li>
                        <li><strong>Website:</strong>{' '}
                            <a href="https://arovia.silentthundersquad.in" target="_blank" rel="noopener noreferrer">
                                arovia.silentthundersquad.in
                            </a>
                        </li>
                    </ul>
                </section>
            </div>

            <Footer />
        </div>
    );
};

export default TermsOfService;
