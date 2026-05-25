import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Box, Container, TextField, Button, Typography,
  IconButton, InputAdornment, Checkbox, FormControlLabel,
  Divider, Paper,
} from '@mui/material';
import {
  Visibility, VisibilityOff, Google, Facebook, ArrowBack,
} from '@mui/icons-material';
import Swal from 'sweetalert2';
import authService from '@shared/services/auth.service';
import { useAuth } from '@shared/hooks/useAuth';
import { safeOAuthRedirect, checkBackendHealth } from '@shared/utils/healthCheck';

/**
 * Login Component
 * 
 * ARCHITECTURE FIX:
 *   Removed manual navigate() after login (was causing state race).
 *   Now: Just call login(), AuthRedirect guard handles routing.
 */
const Login = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      
      // Backend is healthy, proceed with Google login
      await authService.loginWithGoogle();
    } catch (err) {
      Swal.fire({ title: 'Google Login Failed', text: err.message, icon: 'error', confirmButtonColor: '#ef4444' });
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      await login(formData.email, formData.password);
      // ✅ NO manual navigate() - state change triggers AuthRedirect
      Swal.fire({ title: 'Welcome Back!', text: 'Logged in successfully! Redirecting...', icon: 'success', timer: 1000, showConfirmButton: false, background: '#ffffff', color: '#111827', iconColor: '#2EC4B6' });
    } catch (err) {
      setIsLoading(false);
      Swal.fire({ title: 'Login Failed!', text: err.message, icon: 'error', confirmButtonColor: '#ef4444', background: '#ffffff', color: '#111827' });
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', height: '100vh', overflow: 'hidden', background: 'linear-gradient(135deg, #0F4C5C 0%, #2EC4B6 50%, #0F4C5C 100%)', position: 'relative', display: 'flex', alignItems: 'center' }}>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4, alignItems: 'center', minHeight: '90vh' }}>
          <Box component={motion.div} initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} sx={{ display: { xs: 'none', md: 'block' } }}>
            <IconButton component={Link} to="/" sx={{ mb: 4, color: 'rgba(255,255,255,0.9)', '&:hover': { color: '#FFB703' } }}>
              <ArrowBack sx={{ mr: 1 }} />
              <Typography variant="body2">Back to Home</Typography>
            </IconButton>
            <Typography variant="h2" sx={{ fontWeight: 800, mb: 3, color: '#ffffff' }}>Find the Right Specialist</Typography>
            <Typography variant="h5" sx={{ mb: 4, color: 'rgba(255,255,255,0.9)' }}>For Your Chronic Disease</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {['10,000+ Verified Specialists', 'AI-Powered Matching', 'Secure & Confidential', '24/7 Support'].map((feature, i) => (
                <Box key={i} component={motion.div} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.1 }} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: '50%', background: '#FFB703', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', color: '#ffffff', fontWeight: 700 }}>✓</Box>
                  <Typography variant="body1" sx={{ color: '#ffffff', fontWeight: 500 }}>{feature}</Typography>
                </Box>
              ))}
            </Box>
          </Box>

          <Box component={motion.div} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <Paper elevation={24} sx={{ p: 4, borderRadius: 4, background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.3)', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
              <Typography variant="h4" sx={{ mb: 1, fontWeight: 700, color: '#0F4C5C' }}>Welcome Back</Typography>
              <Typography variant="body2" sx={{ mb: 4, color: '#6b7280' }}>Sign in to access your account and find the right specialist</Typography>
              <Box component="form" onSubmit={handleSubmit}>
                <TextField fullWidth label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} error={!!errors.email} helperText={errors.email} sx={{ mb: 3 }} placeholder="you@example.com" />
                <TextField fullWidth label="Password" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} error={!!errors.password} helperText={errors.password} sx={{ mb: 2 }} placeholder="Enter your password"
                  InputProps={{ endAdornment: (<InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)} edge="end">{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>) }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <FormControlLabel control={<Checkbox name="rememberMe" checked={formData.rememberMe} onChange={handleChange} />} label="Remember me" />
                  <Link to="/forgot-password" style={{ color: '#0F4C5C', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600 }}>Forgot password?</Link>
                </Box>
                <Button type="submit" fullWidth variant="contained" size="large" disabled={isLoading} sx={{ mb: 3, py: 1.5 }}>{isLoading ? 'Signing in...' : 'Sign In'}</Button>
                <Divider sx={{ my: 3 }}><Typography variant="body2" sx={{ color: '#6b7280' }}>or continue with</Typography></Divider>
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <Button fullWidth variant="outlined" startIcon={<Google />} onClick={handleGoogleLogin} type="button" sx={{ borderColor: '#d1d5db', color: '#111827', '&:hover': { borderColor: '#0F4C5C', backgroundColor: 'rgba(15,76,92,0.05)' } }}>Google</Button>
                  <Button fullWidth variant="outlined" startIcon={<Facebook />} type="button" disabled sx={{ borderColor: '#d1d5db', color: '#9ca3af' }}>Facebook</Button>
                </Box>
                <Typography variant="body2" sx={{ textAlign: 'center', color: '#6b7280' }}>
                  Don&apos;t have an account?{' '}<Link to="/signup" style={{ color: '#0F4C5C', textDecoration: 'none', fontWeight: 600 }}>Sign up</Link>
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;
