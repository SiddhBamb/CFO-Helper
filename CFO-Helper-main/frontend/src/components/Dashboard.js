import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Box,
  LinearProgress,
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { Link } from 'react-router-dom';
import RunwayAlert from './RunwayAlert';

const Dashboard = () => {
  const [metrics, setMetrics] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [runwayMonths, setRunwayMonths] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metricsRes, transactionsRes] = await Promise.all([
          axios.get('http://localhost:5001/api/metrics'),
          axios.get('http://localhost:5001/api/transactions')
        ]);
        setMetrics(metricsRes.data);
        setTransactions(transactionsRes.data);
        setLoading(false);
        setRunwayMonths(metricsRes.data.runwayMonths);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
    // Set up polling for real-time updates
    const interval = setInterval(fetchData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const MetricCard = ({ title, value, unit = '', trend = 0 }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" component="div">
          {value}{unit}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <Typography variant="body2" color={trend >= 0 ? 'success.main' : 'error.main'}>
            {trend >= 0 ? '+' : ''}{trend}%
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  // Prepare data for charts
  const prepareChartData = () => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return {
        date: date.toLocaleDateString(),
        revenue: 0,
        expenses: 0,
        netIncome: 0,
        customers: 0
      };
    });

    transactions.forEach(transaction => {
      const date = new Date(transaction.date).toLocaleDateString();
      const dayData = last30Days.find(d => d.date === date);
      if (dayData) {
        if (transaction.type === 'income') {
          dayData.revenue += transaction.amount;
        } else {
          dayData.expenses += transaction.amount;
        }
        dayData.netIncome = dayData.revenue - dayData.expenses;
      }
    });

    return last30Days;
  };

  const chartData = prepareChartData();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Financial Dashboard</h1>
        <div className="dashboard-actions">
          <button className="button">
            <span className="button-icon">📊</span>
            Generate Report
          </button>
          <button className="button button-secondary">
            <span className="button-icon">⚙️</span>
            Settings
          </button>
        </div>
      </div>

      {/* Key Metrics - Landscape at top */}
      <div className="card metrics-landscape">
        <h2>Key Metrics</h2>
        <div className="metrics-grid-landscape">
          <div className="metric-item">
            <h3>Revenue</h3>
            <p className="metric-value">$1.2M</p>
            <p className="metric-change positive">+12%</p>
          </div>
          <div className="metric-item">
            <h3>Expenses</h3>
            <p className="metric-value">$850K</p>
            <p className="metric-change positive">+8%</p>
          </div>
          <div className="metric-item">
            <h3>Profit</h3>
            <p className="metric-value">$350K</p>
            <p className="metric-change positive">+15%</p>
          </div>
          <div className="metric-item">
            <h3>Growth</h3>
            <p className="metric-value">24%</p>
            <p className="metric-change positive">+5%</p>
          </div>
        </div>
      </div>
      
      <RunwayAlert runwayMonths={runwayMonths} />

      <div className="dashboard-grid">
        <div className="card">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <Link to="/simulation" className="button">
              <span className="button-icon">🎮</span>
              Start Simulation
            </Link>
            <Link to="/game" className="button button-secondary">
              <span className="button-icon">🎯</span>
              Play Game
            </Link>
            <Link to="/assistant" className="button button-secondary">
              <span className="button-icon">🤖</span>
              Ask AI Assistant
            </Link>
          </div>
        </div>

        <div className="activity-cards">
          <div className="card activity-card">
            <h2>Financial Analysis</h2>
            <div className="activity-list">
              <div className="activity-item">
                <span className="activity-icon">📊</span>
                <div className="activity-details">
                  <h3>Quarterly Review</h3>
                  <p>Completed quarterly financial review</p>
                  <span className="activity-time">2 hours ago</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card activity-card">
            <h2>Game Progress</h2>
            <div className="activity-list">
              <div className="activity-item">
                <span className="activity-icon">🎮</span>
                <div className="activity-details">
                  <h3>Level 3 Achieved</h3>
                  <p>Reached level 3 in Financial Strategy</p>
                  <span className="activity-time">Yesterday</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-charts">
        <div className="card chart-card">
          <h2>Revenue & Expenses</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.05)" />
                <XAxis dataKey="date" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip 
                  contentStyle={{
                    background: 'var(--surface-primary)',
                    border: '1px solid var(--apple-border)',
                    borderRadius: '8px',
                    boxShadow: 'var(--card-shadow)'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="var(--apple-blue)" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Revenue" 
                />
                <Line 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="var(--error)" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Expenses" 
                />
                <Line 
                  type="monotone" 
                  dataKey="netIncome" 
                  stroke="var(--success)" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Net Income" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card chart-card">
          <h2>Expenses Breakdown</h2>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { name: 'Salaries', value: 25000 },
                { name: 'Marketing', value: 12000 },
                { name: 'R&D', value: 25000 },
                { name: 'Operations', value: 8000 },
                { name: 'Other', value: 5000 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.05)" />
                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip 
                  contentStyle={{
                    background: 'var(--surface-primary)',
                    border: '1px solid var(--apple-border)',
                    borderRadius: '8px',
                    boxShadow: 'var(--card-shadow)'
                  }}
                />
                <Bar 
                  dataKey="value" 
                  fill="var(--apple-blue)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card transactions-card">
        <h2>Recent Transactions</h2>
        <div className="transactions-list">
          {transactions.slice(0, 5).map((transaction) => (
            <div key={transaction.id} className="transaction-item">
              <div className="transaction-icon">
                {transaction.type === 'income' ? '💰' : '💸'}
              </div>
              <div className="transaction-details">
                <h3>{transaction.description}</h3>
                <p>{new Date(transaction.date).toLocaleDateString()}</p>
              </div>
              <div className={`transaction-amount ${transaction.type}`}>
                {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 