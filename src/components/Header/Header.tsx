'use client';

import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LogoutIcon from '@mui/icons-material/Logout';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';

const menuItems = [
  { text: 'Dashboard', path: '/dashboard' },
  { text: 'Users', path: '/users' },
  { text: 'Products', path: '/products' },
];

const Header = ({ children }: { children: React.ReactNode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [showBackButton, setShowBackButton] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuthStore();

  React.useEffect(() => {
    const isDetailPage = pathname.startsWith('/users/') || pathname.startsWith('/products/');
    setShowBackButton(isDetailPage);
  }, [pathname]);

  const getPageTitle = () => {
    const currentItem = menuItems.find(item => item.path === pathname);
    if (currentItem) return currentItem.text;

    if (pathname.startsWith('/users/')) return 'User Details';
    if (pathname.startsWith('/products/')) return 'Product Details';
    
    return 'Admin Panel';
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    logout();
    router.push('/login');
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="fixed">
        <Toolbar>
          {showBackButton && (
            <IconButton
              color="inherit"
              aria-label="back to dashboard"
              onClick={() => router.push('/dashboard')}
              edge="start"
              sx={{ mr: 2 }}
            >
              <ArrowBackIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {getPageTitle()}
          </Typography>

          {isMobile ? (
            <>
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={handleMenu}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                {menuItems.map((item) => (
                  <MenuItem key={item.path} onClick={handleClose} component={Link} href={item.path}>
                    {item.text}
                  </MenuItem>
                ))}
                <MenuItem onClick={handleSignOut} aria-label="Logout">
                  <LogoutIcon />
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              {menuItems.map((item) => (
                <Button key={item.path} color="inherit" component={Link} href={item.path}>
                  {item.text}
                </Button>
              ))}
              <Typography sx={{ ml: 2, mr: 1 }}>
                Welcome, {session?.user?.name || session?.user?.email || 'user'}!
              </Typography>
              <Button color="inherit" onClick={handleSignOut}>
                <LogoutIcon />
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        {children}
      </Box>
    </Box>
  );
};

export default Header;