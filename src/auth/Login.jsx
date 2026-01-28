import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import './Auth.css';
import Swal from 'sweetalert2';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
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

            console.log(`Attempting Login fetch to: ${apiUrl}/api/auth/login`);

            const response = await fetch(`${apiUrl}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
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
                throw new Error(data.message || 'Invalid credentials');
            }

            localStorage.setItem('token', data.token);
            if (data.role) localStorage.setItem('role', data.role);

            Swal.fire({
                title: 'Welcome Back!',
                text: 'Logged in successfully! Redirecting...',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
                background: '#1a1a2e',
                color: '#fff',
                iconColor: '#10b981'
            });
            
            setTimeout(() => {
                navigate('/');
            }, 1500);

        } catch (error) {
            Swal.fire({
                title: 'Login Failed!',
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

    return (
        <AuthLayout
            title="Welcome Back"
            subtitle="Sign in to access your account and find the right specialist"
            type="login"
        >
            <form className="auth-form" onSubmit={handleSubmit}>
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
                            placeholder="Enter your password"
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? (
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M3.26 11.602C3.942 8.327 6.793 6 10 6c3.206 0 6.057 2.327 6.74 5.602a.5.5 0 00.98-.204C16.943 7.673 13.693 5 10 5c-3.693 0-6.943 2.673-7.72 6.398a.5.5 0 10.98.204z" fill="currentColor" />
                                    <path d="M10 8a3 3 0 100 6 3 3 0 000-6zm-2 3a2 2 0 114 0 2 2 0 01-4 0z" fill="currentColor" />
                                    <path d="M2.854 2.146a.5.5 0 10-.708.708l15 15a.5.5 0 00.708-.708l-15-15z" fill="currentColor" />
                                </svg>
                            ) : (
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M10 6c-3.207 0-6.058 2.327-6.74 5.602a.5.5 0 01-.98-.204C3.057 7.673 6.307 5 10 5c3.693 0 6.943 2.673 7.72 6.398a.5.5 0 11-.98.204C15.057 8.327 12.206 6 10 6z" fill="currentColor" />
                                    <path d="M10 8a3 3 0 100 6 3 3 0 000-6zm-2 3a2 2 0 114 0 2 2 0 01-4 0z" fill="currentColor" />
                                </svg>
                            )}
                        </button>
                    </div>
                    {errors.password && <span className="error-message">{errors.password}</span>}
                </div>

                <div className="form-row">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            name="rememberMe"
                            checked={formData.rememberMe}
                            onChange={handleChange}
                        />
                        <span>Remember me</span>
                    </label>
                    <Link to="/forgot-password" className="forgot-link">
                        Forgot password?
                    </Link>
                </div>

                <button type="submit" className="btn btn-primary btn-large btn-full" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <span className="spinner"></span>
                            Signing in...
                        </>
                    ) : (
                        'Sign In'
                    )}
                </button>

                <p className="auth-footer">
                    Don't have an account? <Link to="/signup" className="auth-link">Sign up</Link>
                </p>
            </form>
        </AuthLayout>
    );
};

export default Login;
