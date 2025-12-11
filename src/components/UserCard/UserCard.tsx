import React from 'react';
import { Card, CardContent, Typography, Avatar, Box, Button } from '@mui/material';
import Link from 'next/link';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  phone: string;
  company: {
    name: string;
  };
  image: string;
}

interface UserCardProps {
  user: User;
}

const UserCard = React.memo(({ user }: UserCardProps) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar src={user.image} sx={{ width: 60, height: 60, mr: 2 }} />
        <Box>
          <Typography variant="h6">{`${user.firstName} ${user.lastName}`}</Typography>
          <Typography variant="body2" color="text.secondary">{user.email}</Typography>
        </Box>
      </Box>
      <CardContent sx={{ flexGrow: 1, p: 0, '&:last-child': { pb: 0 } }}>
        <Typography variant="body2">
          <strong>Gender:</strong> {user.gender}
        </Typography>
        <Typography variant="body2">
          <strong>Phone:</strong> {user.phone}
        </Typography>
        <Typography variant="body2">
          <strong>Company:</strong> {user.company.name}
        </Typography>
      </CardContent>
      <Box sx={{ mt: 2 }}>
        <Link href={`/users/${user.id}`} passHref>
          <Button variant="outlined" size="small" fullWidth>
            View Details
          </Button>
        </Link>
      </Box>
    </Card>
  );
});

UserCard.displayName = 'UserCard';

export default UserCard;
