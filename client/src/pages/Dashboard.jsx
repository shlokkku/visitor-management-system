"use client";
import { Box, Grid, Paper, useTheme } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SecurityIcon from "@mui/icons-material/Security";

import StatCard from "../components/StatCard";
import ActivityListContainer from "../components/ActivityListContainer";
import NoticeBoard from "../components/NoticeBoard";
import PendingDues from "../components/PendingDues";
import UnresolvedComplaintsStat from "../components/UnresolvedComplaintsStat";
// 1. Import AlertPopup at the top
import AlertPopup from "../components/AlertPopup";

const Dashboard = () => {
  const theme = useTheme();

  // Sample data for other stats (except complaints, which is dynamic)
  const dashboardStats = [
    { title: "Total Tenants", value: 16, icon: <PeopleIcon sx={{ color: "#3498db", fontSize: 40 }} /> },
    // Active Complaints is handled by UnresolvedComplaintsStat
    { title: "Pending Requests", value: 7, icon: <NotificationsIcon sx={{ color: "#f39c12", fontSize: 40 }} /> },
    { title: "Security Alerts", value: 2, icon: <SecurityIcon sx={{ color: "#2ecc71", fontSize: 40 }} /> },
  ];

  const dueItems = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <Box
      component="main"
      sx={{
        width: "100%",
        height: "100%",
        padding: {
          xs: theme.spacing(2),
          sm: theme.spacing(3),
        },
        paddingBottom: {
          xs: theme.spacing(3),
          sm: theme.spacing(4),
        },
        bgcolor: "#f8f9fa",
        boxSizing: "border-box",
      }}
    >
      {/* 2. Add AlertPopup as a top-level child for real-time alert popups */}
      <AlertPopup />

      {/* Dashboard Stats */}
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 2, sm: 3 } }}>
        {/* Total Tenants */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              height: "100%",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
              },
            }}
          >
            <StatCard title="Total Tenants" value={16} icon={<PeopleIcon sx={{ color: "#3498db", fontSize: 40 }} />} />
          </Paper>
        </Grid>
        {/* Active Complaints (dynamic, unresolved) */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              height: "100%",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
              },
            }}
          >
            <UnresolvedComplaintsStat />
          </Paper>
        </Grid>
        {/* Other stats */}
        {dashboardStats.slice(1).map((stat, i) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                height: "100%",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                },
              }}
            >
              <StatCard title={stat.title} value={stat.value} icon={stat.icon} />
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Main Dashboard Content */}
      <Grid
        container
        spacing={{ xs: 2, sm: 3 }}
        sx={{
          height: { xs: "auto", md: "calc(100% - 130px)" },
          minHeight: { xs: "auto", md: "420px" },
        }}
      >
        {/* Main Gate Activity */}
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            height: { xs: "auto", md: "100%" },
            mb: { xs: 2, md: 0 },
          }}
        >
          <Paper
            elevation={0}
            sx={{
              borderRadius: 2,
              height: "100%",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <ActivityListContainer />
          </Paper>
        </Grid>

        {/* Notice Board */}
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            height: { xs: "auto", md: "100%" },
            mb: { xs: 2, md: 0 },
          }}
        >
          <Paper
            elevation={0}
            sx={{
              borderRadius: 2,
              height: "100%",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <NoticeBoard />
          </Paper>
        </Grid>

        {/* Pending Dues */}
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            height: { xs: "auto", md: "100%" },
          }}
        >
          <Paper
            elevation={0}
            sx={{
              borderRadius: 2,
              height: "100%",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <PendingDues dues={dueItems} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
export default Dashboard;