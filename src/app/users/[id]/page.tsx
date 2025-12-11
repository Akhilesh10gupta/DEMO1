'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  CircularProgress,
  Alert,
  Button,
  Avatar,
  Divider,
} from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CakeIcon from '@mui/icons-material/Cake';
import WcIcon from '@mui/icons-material/Wc';
import WorkIcon from '@mui/icons-material/Work';
import ApartmentIcon from '@mui/icons-material/Apartment';
import Link from 'next/link';

const UserDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { selectedUser, loading, error, fetchUserById } = useUserStore();

  useEffect(() => {
    if (id) {
      fetchUserById(id);
    }
  }, [id, fetchUserById]);

  if (loading) {
    return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 8 }} />;
  }

  if (error) {
    return <Alert severity="error" sx={{ m: 4 }}>{error}</Alert>;
  }

  if (!selectedUser) {
    return <Typography sx={{ textAlign: 'center', mt: 8 }}>User not found</Typography>;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          User Details
        </Typography>
        <Button variant="contained" component={Link} href="/dashboard">
          Go to Dashboard
        </Button>
      </Box>

      <Card sx={{ p: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
              <Avatar src={selectedUser.image} sx={{ width: 120, height: 120, mb: 2, border: '2px solid primary.main' }} />
              <Typography variant="h5" sx={{ mb: 0.5 }}>{`${selectedUser.firstName} ${selectedUser.lastName}`}</Typography>
              <Typography variant="body1" color="text.secondary">@{selectedUser.username}</Typography>
              <Button variant="contained" sx={{ mt: 3 }}>Edit User</Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              {/* Contact Information */}
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <EmailIcon sx={{ mr: 1 }} /> Contact Information
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <EmailIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} /> Email: {selectedUser.email}
                    </Typography>
                    <Typography sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} /> Phone: {selectedUser.phone}
                    </Typography>
                    <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationOnIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} /> Address: {`${selectedUser.address.address}, ${selectedUser.address.city}, ${selectedUser.address.state}`}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Personal Information */}
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <WcIcon sx={{ mr: 1 }} /> Personal Information
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <WcIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} /> Gender: {selectedUser.gender}
                    </Typography>
                    <Typography sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CakeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} /> Birth Date: {selectedUser.birthDate} ({selectedUser.age} years old)
                    </Typography>
                    <Typography sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography component="span" sx={{ mr: 1, color: 'text.secondary' }}>🩸</Typography> Blood Group: {selectedUser.bloodGroup}
                    </Typography>
                    <Typography sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      Height: {selectedUser.height} cm
                    </Typography>
                    <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                      Weight: {selectedUser.weight} kg
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Company Information */}
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <ApartmentIcon sx={{ mr: 1 }} /> Company Information
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <ApartmentIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} /> Company: {selectedUser.company.name}
                    </Typography>
                    <Typography sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <WorkIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} /> Title: {selectedUser.company.title}
                    </Typography>
                    <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                      Department: {selectedUser.company.department}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
};

export default UserDetailPage;
