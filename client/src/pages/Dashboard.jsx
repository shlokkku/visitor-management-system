import React from "react";
import { Box, Grid, useTheme } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import ReportIcon from "@mui/icons-material/Report";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SecurityIcon from "@mui/icons-material/Security";

import StatCard from "../components/StatCard";
import ActivityListContainer from "../components/ActivityListContainer";
import NoticeBoard from "../components/NoticeBoard";
import PendingDues from "../components/PendingDues";

const Dashboard = () => {
  const theme = useTheme();

  // Sample data - in a real app, this would come from API
  const dashboardStats = [
    { title: "Total Tenants", value: 16, icon: <PeopleIcon sx={{ color: "#2c3e50", fontSize: 40 }} /> },
    { title: "Active Complaints", value: 4, icon: <ReportIcon sx={{ color: "#2c3e50", fontSize: 40 }} /> },
    { title: "Pending Requests", value: 7, icon: <NotificationsIcon sx={{ color: "#2c3e50", fontSize: 40 }} /> },
    { title: "Security Alerts", value: 2, icon: <SecurityIcon sx={{ color: "#2c3e50", fontSize: 40 }} /> }
  ];

  // Generate array of numbers for list items
  const noticeItems = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const dueItems = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        padding: theme.spacing(3),
        bgcolor: "#f8f9fa",
        overflow: "auto",
      }}
    >
      {/* Dashboard Stats - equal sized cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {dashboardStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard title={stat.title} value={stat.value} icon={stat.icon} />
          </Grid>
        ))}
      </Grid>

      {/* Main Dashboard Content - Modified for equal height */}
      <Grid container spacing={3}>
        {/* Main Gate Activity - Reduced width */}
        <Grid item xs={12} md={7}>
          <ActivityListContainer /> {/* Replacing static activityItems */}
        </Grid>

        {/* Right Column - Modified for equal height sections */}
        <Grid item xs={12} md={5}>
          <Grid container direction="column" spacing={3} sx={{ height: "calc(100vh - 240px)" }}>
            {/* Notice Board - Equal Size */}
            <Grid item xs={12} sx={{ height: "50%" }}>
              <NoticeBoard notices={noticeItems} />
            </Grid>
            
            {/* Pending Dues - Equal Size */}
            <Grid item xs={12} sx={{ height: "50%" }}>
              <PendingDues dues={dueItems} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;