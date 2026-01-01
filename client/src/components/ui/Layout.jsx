import { useEffect, useState } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import {
  AppBar,
  Box,
  CircularProgress,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Tooltip,
  Typography,
  Button,
  useTheme,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Home as HomeIcon,
  Dashboard as KpisIcon,
  Analytics as GraphicalIcon,
  QueryStats as AdvancedIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useServerHealth } from "../../utils/hooks/fetchHealth";
import { useLogout } from "../../utils/hooks/handleLogout";
import aiesecLogo from "../../assets/aiesec-logo-blue.svg";

const drawerWidth = 260;

const menuItems = [
  { text: "Home", icon: <HomeIcon />, path: "/" },
  { text: "KPIs", icon: <KpisIcon />, path: "/kpis" },
  { text: "Graphical", icon: <GraphicalIcon />, path: "/graphical" },
  { text: "Advanced", icon: <AdvancedIcon />, path: "/advanced" },
];

const getPageTitle = (pathname) => {
  switch (pathname) {
    case "/":
      return (<Box  component="img" src={aiesecLogo} mt={1} />);
    case "/kpis":
      return "KPIs";
    case "/graphical":
      return "Graphical";
    case "/advanced":
      return "Advanced";
    default:
      return (<Box  component="img" src={aiesecLogo} mt={1} />);
  }
};

export function Layout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const { logout, loggingOut } = useLogout();

  const {
    status: serverStatus,
    loading,
    refresh: refreshServerHealth
  } = useServerHealth();

  const getStatusColor = () => {
    switch (serverStatus) {
      case "online":
        return theme.palette.success.main;
      case "offline":
        return theme.palette.error.main;

      default:
        return theme.palette.success.main;
    }
  };

  const getStatusLabel = () => {
    switch (serverStatus) {
      case "online":
        return "Online";
      case "offline":
        return "Offline";
      default:
        return "Unknown";
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>

      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 2 }}
          >
            {open ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
            {getPageTitle(location.pathname)}
          </Typography>

          <Tooltip title={loading ? "Loading" : "Refresh status"} placement="bottom" arrow>
            <Button
              variant="rounded"
              color="inherit"
              onClick={() => refreshServerHealth()}
              disabled={loading}
              sx={{
                borderColor: theme.palette.text.secondary,
                color: theme.palette.text.primary,
                mr: 2,
                "&:hover": {
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                },
              }}
            >
              <Typography>Server:</Typography>
              {(loading ?
                <CircularProgress size="20px" sx={{ ml: 2.5, mr: 2, color: theme.palette.primary.main }} />
                : <Typography sx={{ ml: 1, fontWeight: 600, color: `${getStatusColor()}` }}>{getStatusLabel()}</Typography>
              )}
            </Button>
          </Tooltip>

          <Tooltip title="Log out" placement="bottom" arrow>
            <IconButton
              variant="rounded"
              color="inherit"
              onClick={logout}
              disabled={loggingOut}
              sx={{
                borderColor: theme.palette.text.secondary,
                color: theme.palette.text.primary,
                "&:hover": {
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                },
              }}
            >
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: open ? drawerWidth : 64,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: open ? drawerWidth : 64,
            boxSizing: "border-box",
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: "hidden",
            backgroundColor: theme.palette.background.paper,
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "hidden", mt: 1 }}>
          <List sx={{ px: 1 }}>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding sx={{ display: "block", mb: 0.5 }}>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  selected={location.pathname === item.path}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2,
                    borderRadius: 1,
                    "&.Mui-selected": {
                      backgroundColor: `${theme.palette.primary.main}14`,
                      color: theme.palette.primary.main,
                      "&:hover": {
                        backgroundColor: `${theme.palette.primary.main}20`,
                      },
                      "& .MuiListItemIcon-root": {
                        color: theme.palette.primary.main,
                      },
                    },
                    "&:hover": {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  <Tooltip title={open ? "" : `${item.text}`} placement="right" arrow>
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 2 : "auto",
                        justifyContent: "center",
                        color: location.pathname === item.path 
                          ? theme.palette.primary.main 
                          : theme.palette.text.secondary,
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                  </Tooltip>
                  <ListItemText
                    primary={item.text}
                    sx={{
                      opacity: open ? 1 : 0,
                      "& .MuiTypography-root": {
                        fontWeight: location.pathname === item.path ? 600 : 400,
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: theme.palette.background.default,
          minHeight: "100vh",
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
