'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  Typography,
  Button,
  Container,
  Box,
  Paper,
  Grid,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { setToken } = useAuthStore();

  useEffect(() => {
    if (session?.user?.token) {
      setToken(session.user.token);
    }
  }, [session, setToken]);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ mb: 4 }}>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, display: 'flex', alignItems: 'center' }}>
            <PeopleIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
            <Box>
              <Typography variant="h6">Users</Typography>
              <Typography>Manage user accounts</Typography>
              <Button variant="outlined" sx={{ mt: 2 }} onClick={() => router.push('/users')}>
                View Users
              </Button>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, display: 'flex', alignItems: 'center' }}>
            <ShoppingCartIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
            <Box>
              <Typography variant="h6">Products</Typography>
              <Typography>Manage your products</Typography>
              <Button variant="outlined" sx={{ mt: 2 }} onClick={() => router.push('/products')}>
                View Products
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

