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
import BusinessAlert from './BusinessAlert';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import CloudIcon from '@mui/icons-material/Cloud';
import BusinessIcon from '@mui/icons-material/Business';
import WorkIcon from '@mui/icons-material/Work';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FlightIcon from '@mui/icons-material/Flight';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import SchoolIcon from '@mui/icons-material/School';
import BuildIcon from '@mui/icons-material/Build';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import DescriptionIcon from '@mui/icons-material/Description';
import SecurityIcon from '@mui/icons-material/Security';
import StorageIcon from '@mui/icons-material/Storage';
import WebIcon from '@mui/icons-material/Web';
import PeopleIcon from '@mui/icons-material/People';
import DevicesIcon from '@mui/icons-material/Devices';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const Dashboard = () => {
  const [metrics, setMetrics] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [runwayMonths, setRunwayMonths] = useState(0);
  const [transactionLimit, setTransactionLimit] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metricsRes, transactionsRes] = await Promise.all([
          axios.get('http://localhost:5001/api/metrics'),
          axios.get(`http://localhost:5001/api/transactions?limit=${transactionLimit}`)
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
  }, [transactionLimit]);

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

    // Add base values for revenue and expenses
    const baseRevenue = 50000;
    const baseExpenses = 35000;
    const revenueGrowth = 0.02; // 2% daily growth
    const expenseGrowth = 0.01; // 1% daily growth

    // Calculate base values for each day
    last30Days.forEach((day, index) => {
      const growthFactor = Math.pow(1 + revenueGrowth, index);
      const expenseFactor = Math.pow(1 + expenseGrowth, index);
      
      // Add some randomness to make it more realistic
      const randomRevenue = Math.random() * 5000 - 2500; // ±2500 variation
      const randomExpense = Math.random() * 3000 - 1500; // ±1500 variation
      
      day.revenue = Math.round(baseRevenue * growthFactor + randomRevenue);
      day.expenses = Math.round(baseExpenses * expenseFactor + randomExpense);
      day.netIncome = day.revenue - day.expenses;
    });

    // Add transaction data on top of base values
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

  const getTransactionIcon = (category, type) => {
    const iconStyle = {
      fontSize: '1.5rem',
      marginRight: '1rem',
      background: 'var(--primary-gradient)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    };

    const iconMap = {
      // Cloud Services
      'AWS Cloud Services': <CloudIcon style={iconStyle} />,
      'Google Cloud Platform': <CloudIcon style={iconStyle} />,
      'Microsoft Azure': <CloudIcon style={iconStyle} />,
      
      // SaaS Subscriptions
      'Slack Subscription': <WebIcon style={iconStyle} />,
      'Zoom Subscription': <WebIcon style={iconStyle} />,
      'GitHub Enterprise': <StorageIcon style={iconStyle} />,
      'Jira Cloud': <WebIcon style={iconStyle} />,
      'Confluence Cloud': <WebIcon style={iconStyle} />,
      'Salesforce CRM': <PeopleIcon style={iconStyle} />,
      'HubSpot Marketing': <WebIcon style={iconStyle} />,
      
      // Marketing
      'LinkedIn Ads': <LocalOfferIcon style={iconStyle} />,
      'Google Ads': <LocalOfferIcon style={iconStyle} />,
      'Facebook Ads': <LocalOfferIcon style={iconStyle} />,
      
      // Salaries & HR
      'Employee Salaries': <WorkIcon style={iconStyle} />,
      'Contractor Payments': <WorkIcon style={iconStyle} />,
      
      // Office & Facilities
      'Office Rent': <BusinessIcon style={iconStyle} />,
      'Utilities': <BuildIcon style={iconStyle} />,
      'Internet Service': <WebIcon style={iconStyle} />,
      'Phone Service': <DevicesIcon style={iconStyle} />,
      
      // Travel & Entertainment
      'Travel Expenses': <FlightIcon style={iconStyle} />,
      'Meals & Entertainment': <RestaurantIcon style={iconStyle} />,
      
      // Equipment & Software
      'Equipment Purchase': <DevicesIcon style={iconStyle} />,
      'Software Licenses': <StorageIcon style={iconStyle} />,
      
      // Professional Services
      'Professional Services': <BuildIcon style={iconStyle} />,
      'Legal Fees': <DescriptionIcon style={iconStyle} />,
      'Accounting Services': <AccountBalanceIcon style={iconStyle} />,
      'Insurance Premiums': <SecurityIcon style={iconStyle} />,
      
      // Training & Development
      'Training Programs': <SchoolIcon style={iconStyle} />,
      
      // Income Categories
      'Subscription Revenue': <ReceiptIcon style={iconStyle} />,
      'Enterprise Contract': <BusinessIcon style={iconStyle} />,
      'Service Fee': <LocalAtmIcon style={iconStyle} />,
      'Consulting Income': <WorkIcon style={iconStyle} />,
      'API Usage Revenue': <StorageIcon style={iconStyle} />,
      'Training Revenue': <SchoolIcon style={iconStyle} />,
      'Support Contract': <BuildIcon style={iconStyle} />,
      'License Renewal': <StorageIcon style={iconStyle} />,
      'Custom Development': <BuildIcon style={iconStyle} />,
      'Integration Fee': <WebIcon style={iconStyle} />,
    };

    return iconMap[category] || (type === 'income' ? <TrendingUpIcon style={iconStyle} /> : <TrendingDownIcon style={iconStyle} />);
  };

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
            <span className="button-icon"><AssessmentIcon /></span>
            Generate Report
          </button>
          <button className="button button-secondary">
            <span className="button-icon"><SettingsIcon /></span>
            Settings
          </button>
        </div>
      </div>

      <BusinessAlert metrics={metrics} />
      
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
            <p className="metric-change negative">+8%</p>
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
              <span className="button-icon"><SportsEsportsIcon /></span>
              Start Simulation
            </Link>
            <Link to="/game" className="button button-secondary">
              <span className="button-icon"><SportsEsportsIcon /></span>
              Play Game
            </Link>
            <Link to="/assistant" className="button button-secondary">
              <span className="button-icon"><SmartToyIcon /></span>
              Ask AI Assistant
            </Link>
          </div>
        </div>

        <div className="activity-cards">
          <div className="card activity-card">
            <h2>Financial Analysis</h2>
            <div className="activity-list">
              <div className="activity-item">
                <span className="activity-icon"><TrendingUpIcon /></span>
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
                <span className="activity-icon"><SportsEsportsIcon /></span>
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
        <div className="transactions-header">
          <h2>Recent Transactions</h2>
          <select 
            value={transactionLimit} 
            onChange={(e) => setTransactionLimit(Number(e.target.value))}
            className="transaction-limit-select"
          >
            <option value={5}>Show 5</option>
            <option value={10}>Show 10</option>
            <option value={20}>Show 20</option>
          </select>
        </div>
        <div className="transactions-list">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="transaction-item">
              <div className="transaction-icon">
                {getTransactionIcon(transaction.category, transaction.type)}
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