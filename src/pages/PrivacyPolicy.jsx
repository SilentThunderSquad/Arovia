import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './LegalPage.css';

const PrivacyPolicy = () => {
    return (
        <div className="legal-page">
            <Header />

            <div className="legal-hero">
                <h1>Privacy Policy</h1>
                <p className="legal-subtitle">Last updated: March 30, 2026</p>
            </div>

            <div className="legal-content">
                <Link to="/" className="legal-back">← Back to Home</Link>

                <section>
                    <h2>Introduction</h2>
                    <p>
                        Welcome to Arovia ("we," "our," or "us"). We are committed to protecting and respecting your
                        privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your
                        information when you use our website and services at{' '}
                        <a href="https://arovia.silentthundersquad.in" target="_blank" rel="noopener noreferrer">
                            arovia.silentthundersquad.in
                        </a>{' '}
                        (the "Platform").
                    </p>
                    <p>
                        By accessing or using the Platform, you agree to the terms of this Privacy Policy. If you do
                        not agree, please discontinue use of the Platform immediately.
                    </p>
                </section>

                <section>
                    <h2>Information We Collect</h2>

                    <h3>1. Information You Provide</h3>
                    <ul>
                        <li><strong>Account Information:</strong> Name, email address, phone number, and password when you register.</li>
                        <li><strong>Profile Information:</strong> Age, gender, medical history, chronic conditions, and other health-related details you voluntarily provide.</li>
                        <li><strong>Appointment Data:</strong> Details related to specialist searches, appointment bookings, and consultation notes.</li>
                        <li><strong>Communications:</strong> Any messages, feedback, or support inquiries you send us.</li>
                    </ul>

                    <h3>2. Information Collected Automatically</h3>
                    <ul>
                        <li><strong>Device Information:</strong> Browser type, operating system, device identifiers, and IP address.</li>
                        <li><strong>Usage Data:</strong> Pages visited, features used, time spent on the Platform, and referring URLs.</li>
                        <li><strong>Cookies &amp; Tracking Technologies:</strong> We use cookies, web beacons, and similar technologies to enhance your experience and gather analytical data.</li>
                    </ul>

                    <h3>3. Information from Third Parties</h3>
                    <p>
                        We may receive information from healthcare providers, insurance partners, or identity verification
                        services to validate your account or improve our services.
                    </p>
                </section>

                <section>
                    <h2>How We Use Your Information</h2>
                    <p>We use the information we collect to:</p>
                    <ul>
                        <li>Provide, operate, and maintain the Platform and its services.</li>
                        <li>Connect patients with verified specialist doctors for chronic disease management.</li>
                        <li>Process and manage appointment bookings.</li>
                        <li>Personalize your experience and suggest relevant specialists.</li>
                        <li>Communicate with you about updates, notifications, and support.</li>
                        <li>Analyze usage trends to improve the Platform's performance and features.</li>
                        <li>Detect, prevent, and address fraud, abuse, or security issues.</li>
                        <li>Comply with legal obligations and enforce our terms.</li>
                    </ul>
                </section>

                <section>
                    <h2>Sharing of Information</h2>
                    <p>We do not sell your personal information. We may share your data in the following circumstances:</p>
                    <ul>
                        <li><strong>With Doctors/Specialists:</strong> Relevant medical and contact information is shared with doctors you choose to consult.</li>
                        <li><strong>Service Providers:</strong> Third-party vendors who assist with hosting, analytics, email delivery, and payment processing, under strict data protection agreements.</li>
                        <li><strong>Legal Requirements:</strong> When required by law, regulation, or legal process, or to protect the rights, safety, and property of Arovia, its users, or the public.</li>
                        <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction.</li>
                    </ul>
                </section>

                <section>
                    <h2>Data Security</h2>
                    <p>
                        We implement industry-standard technical and organizational measures to protect your personal
                        information against unauthorized access, alteration, disclosure, or destruction. These include
                        encryption (TLS/SSL), secure storage, access controls, and regular security audits.
                    </p>
                    <div className="info-card">
                        <p>
                            While we strive to protect your data, no method of transmission over the Internet or electronic
                            storage is 100% secure. We cannot guarantee absolute security.
                        </p>
                    </div>
                </section>

                <section>
                    <h2>Data Retention</h2>
                    <p>
                        We retain your personal data for as long as your account is active or as needed to provide you
                        services. We may also retain data to comply with legal obligations, resolve disputes, and enforce
                        our agreements. When data is no longer necessary, it is securely deleted or anonymized.
                    </p>
                </section>

                <section>
                    <h2>Your Rights</h2>
                    <p>Depending on your jurisdiction, you may have the right to:</p>
                    <ul>
                        <li>Access, correct, or delete your personal information.</li>
                        <li>Withdraw consent for data processing at any time.</li>
                        <li>Object to or restrict certain processing activities.</li>
                        <li>Request data portability (receive your data in a structured format).</li>
                        <li>Lodge a complaint with a data protection authority.</li>
                    </ul>
                    <p>
                        To exercise any of these rights, please contact us at{' '}
                        <a href="mailto:support@arovia.in">support@arovia.in</a>.
                    </p>
                </section>

                <section>
                    <h2>Cookies Policy</h2>
                    <p>
                        We use cookies and similar tracking technologies to track activity on our Platform and store
                        certain information. You can manage your cookie preferences through your browser settings.
                    </p>
                    <ul>
                        <li><strong>Essential Cookies:</strong> Required for the Platform to function properly (authentication, security).</li>
                        <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with the Platform.</li>
                        <li><strong>Preference Cookies:</strong> Remember your settings and preferences.</li>
                    </ul>
                </section>

                <section>
                    <h2>Children's Privacy</h2>
                    <p>
                        Arovia is not intended for individuals under the age of 18. We do not knowingly collect personal
                        information from children. If we become aware that a child has provided us with personal data, we
                        will take steps to delete such information promptly.
                    </p>
                </section>

                <section>
                    <h2>Third-Party Links</h2>
                    <p>
                        The Platform may contain links to third-party websites or services not operated by us. We are not
                        responsible for the privacy practices of those sites. We encourage you to review the privacy
                        policies of any third-party services you visit.
                    </p>
                </section>

                <section>
                    <h2>Changes to This Policy</h2>
                    <p>
                        We may update this Privacy Policy from time to time. We will notify you of material changes by
                        posting the updated policy on this page with a new "Last updated" date. Your continued use of the
                        Platform after changes constitutes acceptance of the revised policy.
                    </p>
                </section>

                <section>
                    <h2>Contact Us</h2>
                    <p>If you have any questions or concerns about this Privacy Policy, please contact us:</p>
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

export default PrivacyPolicy;
