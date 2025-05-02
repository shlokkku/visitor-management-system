import React, { useEffect, useState } from "react";
import { Box, Grid, Paper, useTheme, useMediaQuery } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import SecurityIcon from "@mui/icons-material/Security";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ReportIcon from "@mui/icons-material/Report";

import StatCard from "../components/StatCard";
import ActivityListContainer from "../components/ActivityListContainer";
import NoticeBoard from "../components/NoticeBoard";
import PendingDues from "../components/PendingDues";
import AlertPopup from "../components/AlertPopup";
import { api } from "../services/authService";

const NAVBAR_HEIGHT_MOBILE = 56; // px
const NAVBAR_HEIGHT_DESKTOP = 64; // px

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/admin/stats/overview")
      .then(res => setStats(res.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  const dueItems = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const displayedDueItems = isMobile ? dueItems.slice(0, 5) : dueItems;

  return (
    <Box
      component="main"
      sx={{
        width: "100%",
        height: "100%",
        paddingTop: { xs: `${NAVBAR_HEIGHT_MOBILE}px`, sm: `${NAVBAR_HEIGHT_DESKTOP}px` }, // Only this!
        paddingLeft: { xs: 2, sm: 3 },
        paddingRight: { xs: 2, sm: 3 },
        paddingBottom: { xs: 3, sm: 4 },
        bgcolor: "#f8f9fa",
        boxSizing: "border-box",
      }}
    >
      <AlertPopup />
      <Grid container spacing={isMobile ? 2 : 3} sx={{ mb: { xs: 2, sm: 3 } }}>
        <Grid xs={12} sm={6} md={3}>
          <StatCard
            title="Total Residents"
            value={loading || !stats ? "—" : stats.residentCount}
            icon={<PeopleIcon sx={{ color: "#3498db", fontSize: 40 }} />}
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <StatCard
            title="Unresolved Complaints"
            value={loading || !stats ? "—" : stats.unresolvedComplaints}
            icon={<ReportIcon sx={{ color: "#f39c12", fontSize: 40 }} />}
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <StatCard
            title="Security Alerts"
            value={loading || !stats ? "—" : stats.securityAlerts}
            icon={<SecurityIcon sx={{ color: "#2ecc71", fontSize: 40 }} />}
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Dues"
            value={loading || !stats ? "—" : stats.duePayments}
            icon={<AccountBalanceWalletIcon sx={{ color: "#e74c3c", fontSize: 40 }} />}
          />
        </Grid>
      </Grid>
      <Grid
        container
        spacing={isMobile ? 2 : 3}
        sx={{
          height: { xs: "auto", md: "calc(100% - 130px)" },
          minHeight: { xs: "auto", md: "420px" },
        }}
      >
        {/* Main Gate Activity */}
        <Grid xs={12} md={4} sx={{ height: { xs: "auto", md: "100%" }, mb: { xs: 2, md: 0 } }}>
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
        <Grid xs={12} md={4} sx={{ height: { xs: "auto", md: "100%" }, mb: { xs: 2, md: 0 } }}>
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
        <Grid xs={12} md={4} sx={{ height: { xs: "auto", md: "100%" } }}>
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
            <PendingDues dues={displayedDueItems} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;