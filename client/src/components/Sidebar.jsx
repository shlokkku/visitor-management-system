import { Box, Typography, List, ListItem, ListItemIcon, ListItemText } from "@mui/material"
import { NavLink } from "react-router-dom"
import DashboardIcon from "@mui/icons-material/Dashboard"
import PeopleIcon from "@mui/icons-material/People"
import ReportIcon from "@mui/icons-material/Report"
import NotificationsIcon from "@mui/icons-material/Notifications"
import SecurityIcon from "@mui/icons-material/Security"
import SettingsIcon from "@mui/icons-material/Settings"
import DescriptionIcon from "@mui/icons-material/Description"
import AnnouncementIcon from '@mui/icons-material/Announcement';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import GridViewIcon from "@mui/icons-material/GridView"

const Sidebar = ({ isMobile }) => {
  // Modern color scheme
  const bgGradient = "linear-gradient(180deg, #1e293b, #334155)"

  // Define menu items with properly assigned icons
  const menuItems = [
    { name: "Dashboard", icon: <DashboardIcon />, path: "/admin" },
    { name: "Tenants", icon: <PeopleIcon />, path: "/admin/tenant-management" },
    { name: "Complaints", icon: <ReportIcon />, path: "/admin/complaints" },
    { name: "ParkingLot", icon: <SecurityIcon />, path: "/admin/parking" },
    { name: "Settings", icon: <SettingsIcon />, path: "/admin/settings" },
    { name: "Legal Documents", icon: <DescriptionIcon />, path: "/admin/legal-documents" },
    { name: "Pending Dues", icon: < AccountBalanceWalletIcon/> , path: "/admin/pending-dues"},
    { name: "Notice Board", icon: <AnnouncementIcon />, path: "/admin/notices"}
  ]

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        background: bgGradient,
        color: "white",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      {/* App Logo and Title */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: {
            xs: "16px 20px",
            sm: "20px 24px",
          },
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <GridViewIcon sx={{ fontSize: { xs: 28, sm: 32 }, mr: 2, color: "#60a5fa" }} />
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: 600,
            letterSpacing: "0.5px",
            fontSize: {
              xs: "1rem",
              sm: "1.25rem",
            },
          }}
        >
          Admin Panel
        </Typography>
      </Box>

      {/* Navigation menu */}
      <List sx={{ width: "100%", padding: "12px 0" }}>
        {menuItems.map((item, index) => (
          <ListItem
            button
            component={NavLink}
            to={item.path}
            key={index}
            sx={{
              padding: {
                xs: "10px 20px",
                sm: "12px 24px",
              },
              color: "rgba(255, 255, 255, 0.85)",
              "&.active": {
                backgroundColor: "rgba(96, 165, 250, 0.15)",
                borderLeft: "4px solid #60a5fa",
                "& .MuiListItemIcon-root": {
                  color: "#60a5fa",
                },
                "& .MuiListItemText-primary": {
                  fontWeight: 600,
                  color: "#ffffff",
                },
              },
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.05)",
              },
              transition: "all 0.2s ease",
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: { xs: 36, sm: 40 },
                color: "rgba(255, 255, 255, 0.6)",
                "& .MuiSvgIcon-root": {
                  fontSize: {
                    xs: "1.25rem",
                    sm: "1.5rem",
                  },
                },
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.name}
              primaryTypographyProps={{
                fontSize: {
                  xs: "14px",
                  sm: "15px",
                },
                fontWeight: 500,
                letterSpacing: "0.3px",
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

export default Sidebar
