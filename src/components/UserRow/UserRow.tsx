import React from 'react';
import { TableRow, TableCell, Button, Avatar, Typography, Box } from '@mui/material';
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

interface UserRowProps {
  user: User;
}

const UserRow = React.memo(({ user }: UserRowProps) => {
  return (
    <TableRow 
      key={user.id}
      sx={{
        '&:hover': {
          backgroundColor: 'action.hover',
        },
      }}
    >
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar src={user.image} sx={{ mr: 2 }} />
          <Box>
            <Typography variant="body1">{`${user.firstName} ${user.lastName}`}</Typography>
            <Typography variant="body2" color="text.secondary">{user.email}</Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell>{user.gender}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 120 }}>{user.phone}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 120 }}>{user.company.name}</TableCell>
      <TableCell>
        <Link href={`/users/${user.id}`} passHref>
          <Button variant="outlined" size="small">View</Button>
        </Link>
      </TableCell>
    </TableRow>
  );
});

UserRow.displayName = 'UserRow';

export default UserRow;
