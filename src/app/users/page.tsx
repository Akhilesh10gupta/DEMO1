'use client';

import { useEffect, useState, useCallback } from 'react';
import { useUserStore } from '@/store/userStore';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  TextField,
  Box,
  CircularProgress,
  Alert,
  Button, // Ensure Button is imported
} from '@mui/material';
import UserRow from '@/components/UserRow/UserRow';
import Link from 'next/link';

const UsersPage = () => {
  const { users, total, loading, error, fetchUsers, searchUsers } = useUserStore();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const rowsPerPage = 10;

  useEffect(() => {
    if (searchTerm) {
      searchUsers(searchTerm);
    } else {
      fetchUsers(rowsPerPage, (page - 1) * rowsPerPage);
    }
  }, [page, searchTerm, fetchUsers, searchUsers]);

  const handlePageChange = useCallback((event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  }, []);

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1); 
  }, []);

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Users
        </Typography>
        <Button variant="contained" component={Link} href="/dashboard">
          Go to Dashboard
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 4 }}>
        <TextField
          fullWidth
          label="Search Users"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </Paper>

      {loading && <CircularProgress sx={{ display: 'block', margin: 'auto', my: 4 }} />}
      {error && <Alert severity="error">{error}</Alert>}
      
      {!loading && !error && (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead sx={{ bgcolor: 'primary.main' }}>
              <TableRow>
                <TableCell sx={{ color: 'common.white' }}>Name</TableCell>
                <TableCell sx={{ color: 'common.white' }}>Gender</TableCell>
                <TableCell sx={{ color: 'common.white' }}>Phone</TableCell>
                <TableCell sx={{ color: 'common.white' }}>Company</TableCell>
                <TableCell sx={{ color: 'common.white' }}>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <UserRow key={user.id} user={user} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={Math.ceil(total / rowsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
          disabled={!!searchTerm}
        />
      </Box>
    </Container>
  );
};

export default UsersPage;
