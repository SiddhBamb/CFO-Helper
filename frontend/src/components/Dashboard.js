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

const Dashboard = () => {
  const [metrics, setMetrics] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

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
    return <LinearProgress />;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Financial Dashboard
      </Typography>
      
      {/* Revenue & Income Section */}
      <Typography variant="h5" sx={{ mt: 3, mb: 2 }}>
        💰 Revenue & Income
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <MetricCard 
            title="MRR" 
            value={metrics.find(m => m.metric_name === 'MRR')?.value || 0} 
            unit="$" 
            trend={15.5}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <MetricCard 
            title="ARR" 
            value={metrics.find(m => m.metric_name === 'ARR')?.value || 0} 
            unit="$" 
            trend={12.3}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <MetricCard 
            title="Revenue Growth" 
            value={metrics.find(m => m.metric_name === 'Revenue Growth')?.value || 0} 
            unit="%" 
            trend={2.5}
          />
        </Grid>
      </Grid>

      {/* Revenue Chart */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Revenue & Expenses (Last 30 Days)
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenue" />
            <Line type="monotone" dataKey="expenses" stroke="#82ca9d" name="Expenses" />
            <Line type="monotone" dataKey="netIncome" stroke="#ffc658" name="Net Income" />
          </LineChart>
        </ResponsiveContainer>
      </Paper>

      {/* Expenses & Burn Section */}
      <Typography variant="h5" sx={{ mt: 3, mb: 2 }}>
        💸 Expenses & Burn
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <MetricCard 
            title="Operating Expenses" 
            value={metrics.find(m => m.metric_name === 'Operating Expenses')?.value || 0} 
            unit="$" 
            trend={-5.2}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <MetricCard 
            title="Gross Margin" 
            value={metrics.find(m => m.metric_name === 'Gross Margin')?.value || 0} 
            unit="%" 
            trend={1.2}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <MetricCard 
            title="Net Burn" 
            value={metrics.find(m => m.metric_name === 'Net Burn')?.value || 0} 
            unit="$" 
            trend={-8.5}
          />
        </Grid>
      </Grid>

      {/* Expenses Breakdown Chart */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Expenses Breakdown
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={[
            { name: 'Salaries', value: 25000 },
            { name: 'Marketing', value: 12000 },
            { name: 'R&D', value: 25000 },
            { name: 'Operations', value: 8000 },
            { name: 'Other', value: 5000 }
          ]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>

      {/* Cash & Runway Section */}
      <Typography variant="h5" sx={{ mt: 3, mb: 2 }}>
        🏦 Cash & Runway
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Cash on Hand
              </Typography>
              <Typography variant="h3">
                ${metrics.find(m => m.metric_name === 'Cash on Hand')?.value || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Runway
              </Typography>
              <Typography variant="h3">
                {metrics.find(m => m.metric_name === 'Runway')?.value || 0} months
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Transactions */}
      <Typography variant="h5" sx={{ mt: 3, mb: 2 }}>
        📊 Recent Transactions
      </Typography>
      <Paper sx={{ p: 2 }}>
        {transactions.slice(0, 5).map((transaction) => (
          <Box key={transaction.id} sx={{ mb: 2 }}>
            <Typography variant="body1">
              {transaction.type === 'income' ? '💰' : '💸'} {transaction.description}
            </Typography>
            <Typography variant="body2" color={transaction.type === 'income' ? 'success.main' : 'error.main'}>
              {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
            </Typography>
          </Box>
        ))}
      </Paper>
    </Box>
  );
};

export default Dashboard; 