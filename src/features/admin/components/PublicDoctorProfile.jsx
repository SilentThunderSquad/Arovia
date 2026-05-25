import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Avatar, Box, Button, Chip, CircularProgress, Container, Divider, Grid, Paper, Rating, Typography } from '@mui/material';
import { AccessTime, ArrowBack, AttachMoney, Language, Lock, Star, Verified } from '@mui/icons-material';

import { motion } from 'framer-motion';

import { api } from '@shared/services/api';

const PublicDoctorProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set Canonical URL for SEO optimization
  useEffect(() => {
    const link = document.querySelector("link[rel='canonical']") || document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', `${window.location.origin}/doctor/${username}`);
    document.head.appendChild(link);
    return () => { if (link.parentNode) link.parentNode.removeChild(link); };
  }, [username]);

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.get(`/api/public/doctor/${username}`);
        setProfile(data);
      } catch (err) {
        setError(err.message || 'Doctor profile not found or is private');
      } finally {
        setLoading(false);
      }
    };
    if (username) fetchDoctorProfile();
  }, [username]);

  // Set OpenGraph and SEO Meta Elements Dynamically
  useEffect(() => {
    if (!profile) return;

    document.title = `${profile.name} | Verified Doctor Profile | Arovia`;

    const descriptionText = `View ${profile.name}'s verified doctor profile, specialization, and schedule on Arovia.`;
    
    let descMeta = document.querySelector("meta[name='description']") || document.createElement('meta');
    descMeta.setAttribute('name', 'description');
    descMeta.setAttribute('content', descriptionText);
    document.head.appendChild(descMeta);

    // OpenGraph Tags
    let ogTitle = document.querySelector("meta[property='og:title']") || document.createElement('meta');
    ogTitle.setAttribute('property', 'og:title');
    ogTitle.setAttribute('content', `${profile.name} - Verified Doctor Profile | Arovia`);
    document.head.appendChild(ogTitle);

    let ogDesc = document.querySelector("meta[property='og:description']") || document.createElement('meta');
    ogDesc.setAttribute('property', 'og:description');
    ogDesc.setAttribute('content', descriptionText);
    document.head.appendChild(ogDesc);

    let ogImage = document.querySelector("meta[property='og:image']") || document.createElement('meta');
    ogImage.setAttribute('property', 'og:image');
    ogImage.setAttribute('content', profile.profilePicture || '/default-doctor-avatar.png');
    document.head.appendChild(ogImage);

    // Twitter Tags
    let twCard = document.querySelector("meta[name='twitter:card']") || document.createElement('meta');
    twCard.setAttribute('name', 'twitter:card');
    twCard.setAttribute('content', 'summary_large_image');
    document.head.appendChild(twCard);

  }, [profile]);

  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'DR';

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0F4C5C 0%, #2EC4B6 100%)' }}>
        <CircularProgress sx={{ color: '#fff' }} />
      </Box>
    );
  }

  if (error || !profile) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0F4C5C 0%, #2EC4B6 100%)', px: 2 }}>
        <Paper component={motion.div} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} sx={{ p: 4, maxWidth: 450, textAlign: 'center', borderRadius: 3, backdropFilter: 'blur(10px)', bgcolor: 'rgba(255, 255, 255, 0.9)' }}>
          <Lock sx={{ fontSize: 60, color: '#0F4C5C', mb: 2 }} />
          <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: '#0F4C5C' }}>Profile Private</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            This profile is private, unlisted, or does not exist.
          </Typography>
          <Button variant="contained" onClick={() => navigate('/')} sx={{ bgcolor: '#0F4C5C', '&:hover': { bgcolor: '#0b3945' }, borderRadius: 2, px: 4 }}>
            Go Home
          </Button>
        </Paper>
      </Box>
    );
  }

  // Handle Suspended or Deactivated accounts gracefully
  if (profile.isActive === false) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0F4C5C 0%, #2EC4B6 100%)', px: 2 }}>
        <Paper component={motion.div} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} sx={{ p: 4, maxWidth: 450, textAlign: 'center', borderRadius: 3, backdropFilter: 'blur(10px)', bgcolor: 'rgba(255, 255, 255, 0.9)' }}>
          <Avatar sx={{ bgcolor: 'rgba(230, 57, 70, 0.1)', color: '#e63946', width: 80, height: 80, mx: 'auto', mb: 2 }}>🛑</Avatar>
          <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: '#e63946' }}>Profile Deactivated</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            The healthcare provider profile for @{profile.username} has been temporarily suspended or deactivated.
          </Typography>
          <Button variant="contained" onClick={() => navigate('/')} sx={{ bgcolor: '#0F4C5C', '&:hover': { bgcolor: '#0b3945' }, borderRadius: 2, px: 4 }}>
            Go Home
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', py: 6, background: 'linear-gradient(135deg, #0F4C5C 0%, #2EC4B6 100%)', display: 'flex', alignItems: 'center' }}>
      <Container maxWidth="md">
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ color: '#fff', mb: 3, '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
          Back
        </Button>

        <Paper component={motion.div} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }} sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', bgcolor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)' }}>
          {/* Cover Header */}
          <Box sx={{ height: 160, background: 'linear-gradient(90deg, #0F4C5C 0%, #2EC4B6 100%)', position: 'relative' }} />

          {/* Profile Details Container */}
          <Box sx={{ px: { xs: 3, md: 5 }, pb: 5, position: 'relative' }}>
            {/* Avatar positioning */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'center', sm: 'flex-end' }, gap: 3, mt: -8, mb: 4 }}>
              <Avatar src={profile.profilePicture || ''} alt={profile.name} sx={{ width: 130, height: 130, border: '6px solid #fff', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', bgcolor: '#0F4C5C', fontSize: '3rem', fontWeight: 'bold' }}>
                {getInitials(profile.name)}
              </Avatar>
              <Box sx={{ textAlign: { xs: 'center', sm: 'left' }, pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-start' }, gap: 1 }}>
                  <Typography variant="h4" fontWeight="bold" color="#0F4C5C">{profile.name}</Typography>
                  <Verified sx={{ color: '#FFB703', fontSize: 24 }} />
                </Box>
                <Typography variant="subtitle1" color="text.secondary" fontWeight={500}>@{profile.username}</Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Grid details */}
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">SPECIALIZATION</Typography>
                    <Chip label={profile.specialization} color="primary" sx={{ bgcolor: '#0F4C5C', color: '#fff', fontWeight: 'bold', mt: 0.5 }} />
                    {profile.subSpecialization && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{profile.subSpecialization}</Typography>
                    )}
                  </Box>

                  {profile.rating && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Rating value={Number(profile.rating)} readOnly precision={0.1} />
                      <Typography variant="body1" fontWeight={700} color="#0F4C5C">({profile.rating})</Typography>
                    </Box>
                  )}

                  {profile.hospital && (
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Typography variant="body2" color="text.disabled" sx={{ fontSize: 20 }}>🏥</Typography>
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block">CLINIC / HOSPITAL</Typography>
                        <Typography variant="body1" fontWeight={600} color="#1F2937">{profile.hospital}</Typography>
                        {profile.city && (
                          <Typography variant="body2" color="text.secondary">{profile.city}</Typography>
                        )}
                      </Box>
                    </Box>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {profile.experience && (
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">EXPERIENCE</Typography>
                      <Typography variant="body1" fontWeight={600} color="#1F2937">{profile.experience}</Typography>
                    </Box>
                  )}

                  {profile.qualification && (
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">QUALIFICATIONS</Typography>
                      <Typography variant="body1" fontWeight={600} color="#1F2937">{profile.qualification}</Typography>
                    </Box>
                  )}

                  {profile.consultationFee && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="body2" color="text.disabled" sx={{ fontSize: 20 }}>💵</Typography>
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block">CONSULTATION FEE</Typography>
                        <Typography variant="body1" fontWeight={600} color="#2EC4B6">{profile.consultationFee}</Typography>
                      </Box>
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>

            {profile.scheduleDays && (
              <>
                <Divider sx={{ my: 4 }} />
                <Typography variant="h6" fontWeight="bold" color="#0F4C5C" sx={{ mb: 2 }}>Availability & Schedule</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <AccessTime sx={{ color: '#0F4C5C' }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block">AVAILABLE TIME</Typography>
                        <Typography variant="body1" fontWeight={600} color="#1F2937">{profile.consultationTime || 'Not specified'}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">SCHEDULE DAYS</Typography>
                      <Typography variant="body1" fontWeight={600} color="#1F2937">{profile.scheduleDays}</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default PublicDoctorProfile;
