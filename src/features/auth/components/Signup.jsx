import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Box, Container, TextField, Button, Typography,
  IconButton, InputAdornment, Checkbox, FormControlLabel,
  Divider, Paper, LinearProgress,
} from '@mui/material';
import { Visibility, VisibilityOff, Google, Facebook, ArrowBack } from '@mui/icons-material';
import Swal from 'sweetalert2';
import authService from '@shared/services/auth.service';
import { useAuth } from '@shared/hooks/useAuth';
import { checkBackendHealth } from '@shared/utils/healthCheck';

const Signup = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', confirmPassword: '', acceptTerms: false });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleGoogleLogin = async () => {
    try {
      // Check backend is available before OAuth redirect
      const isHealthy = await checkBackendHealth(true);
      
      if (!isHealthy) {
        await Swal.fire({
          title: 'Backend Service Unavailable',
          html: `
            <p style="margin-bottom: 10px;">The application backend is not running.</p>
            <p style="margin-bottom: 10px;">Please start it with:</p>
            <code style="background: #f0f0f0; padding: 10px; border-radius: 4px; display: block;">
              npm run dev:backend
            </code>
          `,
          icon: 'error',
          confirmButtonColor: '#ef4444',
        });
        return;
      }
      
      // Backend is healthy, proceed with Google signup
      await authService.loginWithGoogle();
    } catch (err) {
      Swal.fire({ title: 'Google Sign Up Failed', text: err.message, icon: 'error', confirmButtonColor: '#ef4444' });
    }
  };

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
    setFormData((prev) => ({ ...prev, [name]: newValue }));
    if (name === 'password') setPasswordStrength(calculatePasswordStrength(value));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    else if (formData.fullName.trim().length < 2) newErrors.fullName = 'Name must be at least 2 characters';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.acceptTerms) newErrors.acceptTerms = 'You must accept the terms and conditions';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      await register({ name: formData.fullName, email: formData.email, password: formData.password });
      // ✅ After signup, user is NOT authenticated yet - they need to login
      // Redirect to login page for manual sign-in
      Swal.fire({ 
        title: 'Account Created!', 
        text: 'Your account has been created. Please sign in.', 
        icon: 'success', 
        timer: 1500, 
        showConfirmButton: false, 
        background: '#ffffff', 
        color: '#111827', 
        iconColor: '#2EC4B6' 
      });
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setIsLoading(false);
      Swal.fire({ 
        title: 'Registration Failed!', 
        text: err.message, 
        icon: 'error', 
        confirmButtonColor: '#ef4444', 
        background: '#ffffff', 
        color: '#111827' 
      });
    }
  };

  const strengthColors = ['#ef4444', '#f59e0b', '#eab308', '#22c55e', '#2EC4B6'];
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];

  return (
    <Box sx={{ minHeight: '100vh', width: '100%', background: 'linear-gradient(135deg, #0F4C5C 0%, #2EC4B6 50%, #0F4C5C 100%)', position: 'relative', display: 'flex', alignItems: 'center', py: 4 }}>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, width: '100%' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4, alignItems: 'center', width: '100%' }}>
          <Box component={motion.div} initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} sx={{ display: { xs: 'none', md: 'block' } }}>
            <IconButton component={Link} to="/" sx={{ mb: 4, color: 'rgba(255,255,255,0.9)', '&:hover': { color: '#FFB703' } }}>
              <ArrowBack sx={{ mr: 1 }} />
              <Typography variant="body2">Back to Home</Typography>
            </IconButton>
            <Typography variant="h2" sx={{ fontWeight: 800, mb: 3, color: '#ffffff' }}>Join Arovia Today</Typography>
            <Typography variant="h5" sx={{ mb: 4, color: 'rgba(255,255,255,0.9)' }}>Start your journey to better healthcare</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {['10,000+ Verified Specialists', 'AI-Powered Matching', 'Secure & Confidential', '24/7 Support'].map((feature, i) => (
                <Box key={i} component={motion.div} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.1 }} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: '50%', background: '#FFB703', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', color: '#ffffff', fontWeight: 700 }}>✓</Box>
                  <Typography variant="body1" sx={{ color: '#ffffff', fontWeight: 500 }}>{feature}</Typography>
                </Box>
              ))}
            </Box>
          </Box>

          <Box component={motion.div} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} sx={{ width: '100%' }}>
            <Paper elevation={24} sx={{ p: 4, borderRadius: 4, background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.3)', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', width: '100%' }}>
              <Typography variant="h4" sx={{ mb: 1, fontWeight: 700, color: '#0F4C5C' }}>Create Account</Typography>
              <Typography variant="body2" sx={{ mb: 3, color: '#6b7280' }}>Join Arovia to find the right specialist for your chronic disease</Typography>
              <Box component="form" onSubmit={handleSubmit}>
                <TextField fullWidth label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} error={!!errors.fullName} helperText={errors.fullName} sx={{ mb: 2.5 }} placeholder="John Doe" />
                <TextField fullWidth label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} error={!!errors.email} helperText={errors.email} sx={{ mb: 2.5 }} placeholder="you@example.com" />
                <TextField fullWidth label="Password" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} error={!!errors.password} helperText={errors.password} sx={{ mb: 1 }} placeholder="Create a strong password"
                  InputProps={{ endAdornment: (<InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)} edge="end">{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>) }} />
                {formData.password && (
                  <Box sx={{ mb: 2.5 }}>
                    <LinearProgress variant="determinate" value={(passwordStrength / 4) * 100} sx={{ height: 6, borderRadius: 3, backgroundColor: '#e5e7eb', '& .MuiLinearProgress-bar': { backgroundColor: strengthColors[passwordStrength], borderRadius: 3 } }} />
                    <Typography variant="caption" sx={{ color: strengthColors[passwordStrength], mt: 0.5, display: 'block', fontWeight: 600 }}>{strengthLabels[passwordStrength]}</Typography>
                  </Box>
                )}
                <TextField fullWidth label="Confirm Password" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={handleChange} error={!!errors.confirmPassword} helperText={errors.confirmPassword} sx={{ mb: 2 }} placeholder="Re-enter your password"
                  InputProps={{ endAdornment: (<InputAdornment position="end"><IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">{showConfirmPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>) }} />
                <FormControlLabel control={<Checkbox name="acceptTerms" checked={formData.acceptTerms} onChange={handleChange} />}
                  label={<Typography variant="body2">I accept the{' '}<Link to="/terms-of-service" style={{ color: '#0F4C5C', textDecoration: 'none', fontWeight: 600 }}>Terms &amp; Conditions</Link>{' '}and{' '}<Link to="/privacy-policy" style={{ color: '#0F4C5C', textDecoration: 'none', fontWeight: 600 }}>Privacy Policy</Link></Typography>}
                  sx={{ mb: 2 }} />
                {errors.acceptTerms && <Typography variant="caption" sx={{ color: 'error.main', display: 'block', mb: 2 }}>{errors.acceptTerms}</Typography>}
                <Button type="submit" fullWidth variant="contained" size="large" disabled={isLoading} sx={{ mb: 2.5, py: 1.5 }}>{isLoading ? 'Creating account...' : 'Create Account'}</Button>
                <Divider sx={{ my: 2.5 }}><Typography variant="body2" sx={{ color: '#6b7280' }}>or continue with</Typography></Divider>
                <Box sx={{ display: 'flex', gap: 2, mb: 2.5 }}>
                  <Button fullWidth variant="outlined" startIcon={<Google />} onClick={handleGoogleLogin} type="button" sx={{ borderColor: '#d1d5db', color: '#111827', '&:hover': { borderColor: '#0F4C5C', backgroundColor: 'rgba(15,76,92,0.05)' } }}>Google</Button>
                  <Button fullWidth variant="outlined" startIcon={<Facebook />} type="button" disabled sx={{ borderColor: '#d1d5db', color: '#9ca3af' }}>Facebook</Button>
                </Box>
                <Typography variant="body2" sx={{ textAlign: 'center', color: '#6b7280' }}>
                  Already have an account?{' '}<Link to="/login" style={{ color: '#0F4C5C', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Signup;
