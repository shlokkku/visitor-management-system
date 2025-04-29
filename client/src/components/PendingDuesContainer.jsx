import React, { useEffect, useState } from "react";
import PendingDues from "./PendingDues";
import { api } from "../services/authService";

const PendingDuesContainer = () => {
  const [dues, setDues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPendingDues = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get("/api/dues");
        setDues(response.data || []);
      } catch (err) {
        console.error("Error fetching pending dues:", err);
        setError("Failed to load pending dues. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingDues();
  }, []);

  return <PendingDues dues={dues} loading={loading} error={error} />;
};

export default PendingDuesContainer;