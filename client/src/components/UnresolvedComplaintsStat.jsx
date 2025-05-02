import React, { useEffect, useState } from "react";
import StatCard from "./StatCard";
import ReportIcon from "@mui/icons-material/Report";
import { api } from "../services/authService";

const UnresolvedComplaintsStat = () => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/complaints")
      .then(res => {
        const unresolved = Array.isArray(res.data)
          ? res.data.filter(c => c.status !== "resolved")
          : [];
        setCount(unresolved.length);
      })
      .catch(() => setCount(0))
      .finally(() => setLoading(false));
  }, []);

  return (
    <StatCard
      title="Active Complaints"
      value={loading ? "..." : count}
      icon={<ReportIcon sx={{ color: "#e74c3c", fontSize: 40 }} />}
    />
  );
};

export default UnresolvedComplaintsStat;