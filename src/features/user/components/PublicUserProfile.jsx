import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Paper, Avatar, CircularProgress, Button, Grid, Chip, Divider } from '@mui/material';
import { CalendarMonth, Badge, Bloodtype, ArrowBack, VerifiedUser, Lock } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { api } from '@shared/services/api';

const PublicUserProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set Canonical URL for SEO optimization
  useEffect(() => {
    const link = document.querySelector("link[rel='canonical']") || document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', `${window.location.origin}/u/${username}`);
    document.head.appendChild(link);
    return () => { if (link.parentNode) link.parentNode.removeChild(link); };
  }, [username]);

  useEffect(() => {
    const fetchPublicProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.get(`/api/public/user/${username}`);
        setProfile(data);
      } catch (err) {
        setError(err.message || 'Profile not found or is private');
      } finally {
        setLoading(false);
      }
    };
    if (username) fetchPublicProfile();
  }, [username]);

  // Set OpenGraph and SEO Meta Elements Dynamically
  useEffect(() => {
    if (!profile) return;

    document.title = `${profile.name} (@${profile.username}) | Arovia`;

    const descriptionText = `View ${profile.name}'s verified public healthcare card on Arovia.`;
    
    let descMeta = document.querySelector("meta[name='description']") || document.createElement('meta');
    descMeta.setAttribute('name', 'description');
    descMeta.setAttribute('content', descriptionText);
    document.head.appendChild(descMeta);

    // OpenGraph Tags
    let ogTitle = document.querySelector("meta[property='og:title']") || document.createElement('meta');
    ogTitle.setAttribute('property', 'og:title');
    ogTitle.setAttribute('content', `${profile.name} Profile | Arovia`);
    document.head.appendChild(ogTitle);

    let ogDesc = document.querySelector("meta[property='og:description']") || document.createElement('meta');
    ogDesc.setAttribute('property', 'og:description');
    ogDesc.setAttribute('content', descriptionText);
    document.head.appendChild(ogDesc);

    let ogImage = document.querySelector("meta[property='og:image']") || document.createElement('meta');
    ogImage.setAttribute('property', 'og:image');
    ogImage.setAttribute('content', profile.profilePicture || '/default-avatar.png');
    document.head.appendChild(ogImage);

    // Twitter Tags
    let twCard = document.querySelector("meta[name='twitter:card']") || document.createElement('meta');
    twCard.setAttribute('name', 'twitter:card');
    twCard.setAttribute('content', 'summary_large_image');
    document.head.appendChild(twCard);

  }, [profile]);

  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';

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
          <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: '#0F4C5C' }}>Profile Unavailable</Typography>
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
            The account associated with @{profile.username} has been temporarily suspended or deactivated.
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
          <Box sx={{ height: 160, background: 'linear-gradient(90deg, #2EC4B6 0%, #FFB703 100%)', position: 'relative' }} />

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
                  <VerifiedUser sx={{ color: '#2EC4B6', fontSize: 24 }} />
                </Box>
                <Typography variant="subtitle1" color="text.secondary" fontWeight={500}>@{profile.username}</Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Grid details */}
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Badge sx={{ color: '#0F4C5C' }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">GENDER</Typography>
                      <Typography variant="body1" fontWeight={600} color="#1F2937">{profile.gender || 'Not specified'}</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CalendarMonth sx={{ color: '#0F4C5C' }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">MEMBER SINCE</Typography>
                      <Typography variant="body1" fontWeight={600} color="#1F2937">
                        {new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {profile.bloodDonor && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Bloodtype sx={{ color: '#e63946' }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block">HEALTH STATS</Typography>
                        <Chip label="Registered Blood Donor" size="small" sx={{ bgcolor: 'rgba(230, 57, 70, 0.1)', color: '#e63946', fontWeight: 'bold', border: '1px solid rgba(230, 57, 70, 0.2)' }} />
                      </Box>
                    </Box>
                  )}

                  {profile.address?.city && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'rgba(46, 196, 182, 0.1)', color: '#2EC4B6', width: 40, height: 40 }}>📍</Avatar>
                      <Box>
                        <Typography variant="caption" color="text.secondary" display="block">LOCATION</Typography>
                        <Typography variant="body1" fontWeight={600} color="#1F2937">
                          {profile.address.city}, {profile.address.state}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default PublicUserProfile;
