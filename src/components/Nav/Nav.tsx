import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LogoutIcon from '@mui/icons-material/Logout';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Button, useMediaQuery, BottomNavigation, BottomNavigationAction } from '@mui/material';
import Link from 'next/link';

export default function MiniDrawer({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  const pathname = usePathname();
  const [showBackButton, setShowBackButton] = React.useState(false);

  const { data: session } = useSession();
  const { logout } = useAuthStore();

  React.useEffect(() => {
    const isDetailPage = pathname.startsWith('/users/') && pathname.split('/').length > 3 ||
                        pathname.startsWith('/products/') && pathname.split('/').length > 3;
    setShowBackButton(isDetailPage);
  }, [pathname]);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    logout();
    router.push('/login');
  };
  
  const menuItems = [
    { text: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { text: 'Users', path: '/users', icon: <PeopleIcon /> },
    { text: 'Products', path: '/products', icon: <ShoppingCartIcon /> },
  ];

  const getPageTitle = () => {
    const currentItem = menuItems.find(item => item.path === pathname);
    if (currentItem) return currentItem.text;

    if (pathname.startsWith('/users/')) return 'User Details';
    if (pathname.startsWith('/products/')) return 'Product Details';
    
    return 'Admin Panel';
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <MuiAppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          {showBackButton && (
            <IconButton
              color="inherit"
              aria-label="back to dashboard"
              onClick={() => {
                if (pathname.startsWith('/users/')) router.push('/users');
                else if (pathname.startsWith('/products/')) router.push('/products');
                else router.push('/dashboard');
              }}
              edge="start"
              sx={{ marginRight: 2 }}
            >
              <ArrowBackIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {getPageTitle()}
          </Typography>
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 2, marginRight: 2 }}>
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  color="inherit"
                  component={Link}
                  href={item.path}
                  sx={{
                    fontWeight: pathname === item.path ? 'bold' : 'normal',
                    textDecoration: pathname === item.path ? 'underline' : 'none',
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}
          <Typography>
            Welcome, {session?.user?.name || session?.user?.email || 'user'}!
          </Typography>
          <Button color="inherit" onClick={handleSignOut}>
            <LogoutIcon />
          </Button>
        </Toolbar>
      </MuiAppBar>

      <Box component="main" sx={{
        flexGrow: 1,
        p: 3,
        mt: 8, // To account for the AppBar
        mb: isMobile ? 7 : 0, // Margin bottom for mobile BottomNavigation
        width: '100%',
      }}>
        {children}
      </Box>

      {isMobile && (
        <BottomNavigation
          showLabels
          value={menuItems.findIndex(item => item.path === pathname)}
          sx={{ width: '100%', position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: theme.zIndex.drawer + 1 }}
        >
          {menuItems.map((item) => (
            <BottomNavigationAction
              key={item.text}
              label={item.text}
              icon={item.icon}
              component={Link}
              href={item.path}
              sx={{
                color: pathname === item.path ? theme.palette.primary.main : 'inherit',
              }}
            />
          ))}
        </BottomNavigation>
      )}
    </Box>
  );
}