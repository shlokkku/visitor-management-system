import React, { useEffect, useState } from 'react';
import ActivityList from './ActivityList';
import { fetchVisitorLogs } from '../services/visitorLogService';

const ActivityListContainer = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadVisitorLogs = async () => {
      try {
        const logs = await fetchVisitorLogs();
        setActivities(logs.map(log => ({
          id: log._id,
          name: log.name,
          type: log.type,
          entryTime: log.entry_time || 'Pending',
          status: log.status,
        })));
      } catch (err) {
        console.error('Error fetching visitor logs:', err);
        setError('Failed to load visitor logs. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadVisitorLogs();
  }, []);

  return <ActivityList activities={activities} loading={loading} error={error} />;
};

export default ActivityListContainer;