import React, { useEffect, useState } from 'react';
import ActivityList from './ActivityList';
import { fetchVisitorLogs } from '../services/visitorLogService';

const ActivityListContainer = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadVisitorLogs = async () => {
      try {
        const logs = await fetchVisitorLogs();
        setActivities(logs.map(log => ({
          id: log._id,
          name: log.name,
          type: log.type,
          entryTime: log.entry_time || 'Pending', // Use log.entry_time
          status: log.status,
        })));
      } catch (err) {
        console.error('Error fetching visitor logs:', err);
        setError('Failed to load visitor logs. Please try again.');
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    loadVisitorLogs();
  }, []);

  if (loading) {
    return <div>Loading activities...</div>; // Display a loading message
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return <ActivityList activities={activities} />;
};

export default ActivityListContainer;