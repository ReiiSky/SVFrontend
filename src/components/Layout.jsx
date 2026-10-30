import { Box, Drawer, List, ListItemButton, ListItemText } from '@mui/material';
import { Link, Outlet, useLocation } from 'react-router-dom';

const DRAWER_WIDTH = 240;

const MENU = [
  { label: 'All Posts', to: '/posts' },
  { label: 'Add New', to: '/posts/new' },
  { label: 'Preview', to: '/preview' },
];

export default function Layout() {
  const { pathname } = useLocation();

  function isSelected(to) {
    return pathname === to;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        sx={{ width: DRAWER_WIDTH, [`& .MuiDrawer-paper`]: { width: DRAWER_WIDTH } }}
      >
        <List>
          {MENU.map((item) => (
            <ListItemButton
              key={item.to}
              component={Link}
              to={item.to}
              selected={isSelected(item.to)}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
