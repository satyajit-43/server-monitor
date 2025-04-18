import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

function ServerStats() {
  const [stats, setStats] = useState(null);
  const [cpuHistory, setCpuHistory] = useState([]);
  const [memoryHistory, setMemoryHistory] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
        const response = await axios.get(`${apiUrl}/api/server-stats`);
        setStats(response.data);
        
        // Update CPU history (keep last 10 entries)
        setCpuHistory(prev => [...prev.slice(-9), response.data.cpu]);
        
        // Update memory history (keep last 10 entries)
        setMemoryHistory(prev => [...prev.slice(-9), response.data.memory.percent]);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  if (!stats) return <div>Loading server stats...</div>;

  // Chart data for CPU
  const cpuData = {
    labels: cpuHistory.map((_, i) => i),
    datasets: [{
      label: 'CPU Usage %',
      data: cpuHistory,
      borderColor: 'rgba(75, 192, 192, 1)',
      tension: 0.1,
      fill: false
    }]
  };

  // Chart data for Memory
  const memoryData = {
    labels: memoryHistory.map((_, i) => i),
    datasets: [{
      label: 'Memory Usage %',
      data: memoryHistory,
      borderColor: 'rgba(255, 99, 132, 1)',
      tension: 0.1,
      fill: false
    }]
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Server Monitor</h1>
      <p>Last updated: {stats.timestamp}</p>
      
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        <div style={{ flex: 1, background: '#f5f5f5', padding: '15px', borderRadius: '8px' }}>
          <h2>CPU Usage</h2>
          <Line data={cpuData} />
          <p>Current: {stats.cpu}%</p>
        </div>
        
        <div style={{ flex: 1, background: '#f5f5f5', padding: '15px', borderRadius: '8px' }}>
          <h2>Memory Usage</h2>
          <Line data={memoryData} />
          <p>Used: {stats.memory.percent}% ({(stats.memory.used / 1024 / 1024).toFixed(2)} MB)</p>
        </div>
      </div>
      
      <div style={{ marginTop: '20px', background: '#f5f5f5', padding: '15px', borderRadius: '8px' }}>
        <h2>Disk Usage</h2>
        <p>Total: {(stats.disk.total / 1024 / 1024 / 1024).toFixed(2)} GB</p>
        <p>Used: {(stats.disk.used / 1024 / 1024 / 1024).toFixed(2)} GB ({stats.disk.percent}%)</p>
      </div>
    </div>
  );
}

export default ServerStats;