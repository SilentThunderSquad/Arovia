import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import './Auth.css';
import Swal from 'sweetalert2';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const calculatePasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z\d]/.test(password)) strength++;
        return Math.min(strength, 4);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));

        // Calculate password strength
        if (name === 'password') {
            setPasswordStrength(calculatePasswordStrength(value));
        }

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        } else if (formData.fullName.trim().length < 2) {
            newErrors.fullName = 'Name must be at least 2 characters';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.acceptTerms) {
            newErrors.acceptTerms = 'You must accept the terms and conditions';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            // Absolute API URL: Works both locally and on any Vercel domain
            const origin = window.location.origin;
            const apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : origin;
            
            console.log(`Attempting Signup fetch to: ${apiUrl}/api/auth/register`);
            
            const response = await fetch(`${apiUrl}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.fullName,
                    email: formData.email,
                    password: formData.password,
                    role: 'user' // Default role
                }),
            });

            // Handle non-JSON responses (like Vercel error pages)
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                const text = await response.text();
                console.error("Non-JSON response received:", text);
                throw new Error("Server returned an error page (HTML) instead of data. Please check Vercel Logs.");
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            Swal.fire({
                title: 'Success!',
                text: 'Account created successfully! Redirecting...',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
                background: '#1a1a2e',
                color: '#fff',
                iconColor: '#10b981'
            });
            
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (error) {
            Swal.fire({
                title: 'Error!',
                text: error.message,
                icon: 'error',
                confirmButtonColor: '#ef4444',
                background: '#1a1a2e',
                color: '#fff'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const getStrengthLabel = () => {
        const labels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
        return labels[passwordStrength] || '';
    };

    const getStrengthColor = () => {
        const colors = ['#ef4444', '#f59e0b', '#eab308', '#22c55e', '#10b981'];
        return colors[passwordStrength] || '#ef4444';
    };

    return (
        <AuthLayout
            title="Create Account"
            subtitle="Join Arovia to find the right specialist for your chronic disease"
            type="signup"
        >
            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="fullName">Full Name</label>
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className={errors.fullName ? 'error' : ''}
                        placeholder="John Doe"
                    />
                    {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={errors.email ? 'error' : ''}
                        placeholder="you@example.com"
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <div className="password-input">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={errors.password ? 'error' : ''}
                            placeholder="Create a strong password"
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                    </div>
                    {formData.password && (
                        <div className="password-strength">
                            <div className="strength-bar">
                                <div
                                    className="strength-fill"
                                    style={{
                                        width: `${(passwordStrength / 4) * 100}%`,
                                        backgroundColor: getStrengthColor()
                                    }}
                                ></div>
                            </div>
                            <span className="strength-label" style={{ color: getStrengthColor() }}>
                                {getStrengthLabel()}
                            </span>
                        </div>
                    )}
                    {errors.password && <span className="error-message">{errors.password}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <div className="password-input">
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={errors.confirmPassword ? 'error' : ''}
                            placeholder="Re-enter your password"
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                        >
                            {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                    </div>
                    {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                </div>

                <div className="form-group">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            name="acceptTerms"
                            checked={formData.acceptTerms}
                            onChange={handleChange}
                        />
                        <span>
                            I accept the <Link to="/terms" className="auth-link">Terms & Conditions</Link> and <Link to="/privacy" className="auth-link">Privacy Policy</Link>
                        </span>
                    </label>
                    {errors.acceptTerms && <span className="error-message">{errors.acceptTerms}</span>}
                </div>

                <button type="submit" className="btn btn-primary btn-large btn-full" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <span className="spinner"></span>
                            Creating account...
                        </>
                    ) : (
                        'Create Account'
                    )}
                </button>

                <p className="auth-footer">
                    Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
                </p>
            </form>
        </AuthLayout>
    );
};

export default Signup;
