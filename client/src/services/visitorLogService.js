import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/visitorlogs';

/**
 * Fetch visitor logs for admin
 * @returns {Promise<Array>} List of visitor logs
 */
export const fetchVisitorLogs = async () => {
  const response = await axios.get(API_BASE_URL, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  return response.data;
};

export default { fetchVisitorLogs };