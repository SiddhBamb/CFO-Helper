import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Box,
  LinearProgress,
  useTheme,
  Fade,
  Zoom,
  Grow,
  Collapse,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import WarningIcon from '@mui/icons-material/Warning';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import SavingsIcon from '@mui/icons-material/Savings';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

const MetricCard = ({ title, value, unit = '', trend = 0, icon: Icon }) => (
  <StyledCard>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Icon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography color="textSecondary" gutterBottom sx={{ mb: 0 }}>
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
        {typeof value === 'number' ? 
          (unit === '$' ? 
            (value < 0 ? `-$${Math.abs(value).toLocaleString()}` : `$${value.toLocaleString()}`) : 
            `${value.toLocaleString()}${unit}`) : 
          value}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
        <Typography 
          variant="body2" 
          sx={{ 
            color: trend >= 0 ? 'success.main' : 'error.main',
            fontWeight: 'medium',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </Typography>
      </Box>
    </CardContent>
  </StyledCard>
);

const Dashboard = () => {
  const theme = useTheme();
  const [metrics, setMetrics] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getBusinessSuggestions = () => {
    const suggestions = [];
    const cashOnHand = metrics.find(m => m.metric_name === 'Cash on Hand')?.value || 0;
    const runway = metrics.find(m => m.metric_name === 'Runway')?.value || 0;
    const netBurn = metrics.find(m => m.metric_name === 'Net Burn')?.value || 0;
    const revenueGrowth = metrics.find(m => m.metric_name === 'Revenue Growth')?.value || 0;

    if (runway < 6) {
      suggestions.push({
        severity: 'warning',
        title: 'Low Runway',
        message: 'Consider raising additional capital or reducing burn rate to extend runway beyond 6 months.',
        icon: WarningIcon
      });
    }

    if (netBurn > 0) {
      suggestions.push({
        severity: 'error',
        title: 'High Burn Rate',
        message: 'Review operating expenses and implement cost-cutting measures to reduce monthly burn.',
        icon: TrendingDownIcon
      });
    }

    if (revenueGrowth < 10) {
      suggestions.push({
        severity: 'info',
        title: 'Revenue Growth',
        message: 'Focus on sales and marketing initiatives to accelerate revenue growth above 10%.',
        icon: TrendingUpIcon
      });
    }

    if (cashOnHand > 1000000) {
      suggestions.push({
        severity: 'success',
        title: 'Strong Cash Position',
        message: 'Consider strategic investments in growth initiatives or team expansion.',
        icon: SavingsIcon
      });
    }

    return suggestions;
  };

  const prepareChartData = () => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return {
        date: date.toLocaleDateString(),
        revenue: 0,
        expenses: 0,
        netIncome: 0
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <LinearProgress sx={{ width: '50%' }} />
      </Box>
    );
  }

  if (!mounted) {
    return null;
  }

  const suggestions = getBusinessSuggestions();

  return (
    <Box sx={{ flexGrow: 1, p: 3, bgcolor: 'background.default' }}>
      <Collapse in={mounted}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 'bold', 
            color: '#ffffff',
            textAlign: 'center',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            mb: 4,
          }}
        >
          Financial Dashboard
        </Typography>

        {/* Financial Alerts */}
        <Box sx={{ mb: 4 }}>
          <Alert 
            severity="warning" 
            sx={{ 
              bgcolor: 'rgba(255, 152, 0, 0.1)',
              border: '1px solid rgba(255, 152, 0, 0.3)',
              color: 'rgba(255, 255, 255, 0.9)',
              '& .MuiAlert-icon': {
                color: 'rgba(255, 152, 0, 0.8)',
              },
            }}
          >
            <AlertTitle>Suggestions</AlertTitle>
            <List dense>
              {metrics.find(m => m.metric_name === 'Operating Expenses')?.value > 50000 && (
                <ListItem>
                  <ListItemIcon>
                    <ReceiptIcon sx={{ color: 'warning.main' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="High Operating Expenses" 
                    secondary="Consider renegotiating vendor contracts and implementing remote work policies to reduce office space costs."
                  />
                </ListItem>
              )}
              {metrics.find(m => m.metric_name === 'Gross Margin')?.value < 60 && (
                <ListItem>
                  <ListItemIcon>
                    <TrendingUpIcon sx={{ color: 'warning.main' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Low Gross Margin" 
                    secondary="Review pricing strategy and supplier costs. Consider bulk purchasing or alternative suppliers to improve margins."
                  />
                </ListItem>
              )}
              {metrics.find(m => m.metric_name === 'MRR')?.value < 100000 && (
                <ListItem>
                  <ListItemIcon>
                    <AttachMoneyIcon sx={{ color: 'warning.main' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="MRR Growth Opportunity" 
                    secondary="Implement a customer referral program and upsell existing customers to higher-tier plans."
                  />
                </ListItem>
              )}
              {metrics.find(m => m.metric_name === 'Customer Churn')?.value > 5 && (
                <ListItem>
                  <ListItemIcon>
                    <WarningIcon sx={{ color: 'warning.main' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="High Customer Churn" 
                    secondary="Launch a customer success program and improve onboarding process to reduce churn."
                  />
                </ListItem>
              )}
              {metrics.find(m => m.metric_name === 'Cash on Hand')?.value < 500000 && (
                <ListItem>
                  <ListItemIcon>
                    <AccountBalanceIcon sx={{ color: 'warning.main' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Cash Flow Management" 
                    secondary="Implement stricter payment terms and consider invoice factoring for better cash flow."
                  />
                </ListItem>
              )}
              {metrics.find(m => m.metric_name === 'Team Size')?.value > 50 && (
                <ListItem>
                  <ListItemIcon>
                    <TrendingDownIcon sx={{ color: 'warning.main' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Team Efficiency" 
                    secondary="Review team structure and consider implementing productivity tools to optimize workforce efficiency."
                  />
                </ListItem>
              )}
            </List>
          </Alert>
        </Box>
      </Collapse>

      {/* Business Suggestions Alert */}
      {suggestions.length > 0 && (
        <Collapse in={mounted} timeout={800}>
          <Box sx={{ mb: 3 }}>
            <Paper sx={{ p: 2, bgcolor: 'background.paper' }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <WarningIcon sx={{ mr: 1, color: 'warning.main' }} />
                Business Recommendations
              </Typography>
              <List>
                {suggestions.map((suggestion, index) => (
                  <ListItem key={index} sx={{ py: 1 }}>
                    <ListItemIcon>
                      <suggestion.icon sx={{ color: `${suggestion.severity}.main` }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={suggestion.title}
                      secondary={suggestion.message}
                      primaryTypographyProps={{
                        color: `${suggestion.severity}.main`,
                        fontWeight: 'medium'
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Box>
        </Collapse>
      )}
      
      {/* Revenue & Income Section */}
      <Collapse in={mounted} timeout={800}>
        <Box sx={{ mt: 3, mb: 2 }}>
          <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center' }}>
            <AttachMoneyIcon sx={{ mr: 1, color: 'success.main' }} />
            Revenue & Income
          </Typography>
        </Box>
      </Collapse>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Collapse in={mounted} timeout={1000}>
            <MetricCard 
              title="MRR" 
              value={metrics.find(m => m.metric_name === 'MRR')?.value || 0} 
              unit="$" 
              trend={15.5}
              icon={AttachMoneyIcon}
            />
          </Collapse>
        </Grid>
        <Grid item xs={12} md={4}>
          <Collapse in={mounted} timeout={1200}>
            <MetricCard 
              title="ARR" 
              value={metrics.find(m => m.metric_name === 'ARR')?.value || 0} 
              unit="$" 
              trend={12.3}
              icon={TrendingUpIcon}
            />
          </Collapse>
        </Grid>
        <Grid item xs={12} md={4}>
          <Collapse in={mounted} timeout={1400}>
            <MetricCard 
              title="Revenue Growth" 
              value={metrics.find(m => m.metric_name === 'Revenue Growth')?.value || 0} 
              unit="%" 
              trend={2.5}
              icon={ShowChartIcon}
            />
          </Collapse>
        </Grid>
      </Grid>

      {/* Revenue Chart */}
      <Collapse in={mounted} timeout={1000}>
        <Paper sx={{ p: 3, mt: 3, borderRadius: 2, boxShadow: theme.shadows[4] }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <ShowChartIcon sx={{ mr: 1, color: 'primary.main' }} />
            Revenue & Expenses (Last 30 Days)
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              <XAxis dataKey="date" stroke={theme.palette.text.secondary} />
              <YAxis stroke={theme.palette.text.secondary} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: theme.shape.borderRadius
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke={theme.palette.success.main} 
                strokeWidth={2}
                dot={{ fill: theme.palette.success.main }}
                name="Revenue" 
              />
              <Line 
                type="monotone" 
                dataKey="expenses" 
                stroke={theme.palette.error.main} 
                strokeWidth={2}
                dot={{ fill: theme.palette.error.main }}
                name="Expenses" 
              />
              <Line 
                type="monotone" 
                dataKey="netIncome" 
                stroke={theme.palette.primary.main} 
                strokeWidth={2}
                dot={{ fill: theme.palette.primary.main }}
                name="Net Income" 
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Collapse>

      {/* Expenses & Burn Section */}
      <Collapse in={mounted} timeout={800}>
        <Box sx={{ mt: 3, mb: 2 }}>
          <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center' }}>
            <TrendingUpIcon sx={{ mr: 1, color: 'success.main' }} />
            Expenses & Burn
          </Typography>
        </Box>
      </Collapse>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Collapse in={mounted} timeout={1000}>
            <MetricCard 
              title="Operating Expenses" 
              value={metrics.find(m => m.metric_name === 'Operating Expenses')?.value || 0} 
              unit="$" 
              trend={-5.2}
              icon={ReceiptIcon}
            />
          </Collapse>
        </Grid>
        <Grid item xs={12} md={4}>
          <Collapse in={mounted} timeout={1200}>
            <MetricCard 
              title="Gross Margin" 
              value={metrics.find(m => m.metric_name === 'Gross Margin')?.value || 0} 
              unit="%" 
              trend={1.2}
              icon={ShowChartIcon}
            />
          </Collapse>
        </Grid>
        <Grid item xs={12} md={4}>
          <Collapse in={mounted} timeout={1400}>
            <MetricCard 
              title="Net Burn" 
              value={metrics.find(m => m.metric_name === 'Net Burn')?.value || 0} 
              unit="$" 
              trend={-8.5}
              icon={ReceiptIcon}
            />
          </Collapse>
        </Grid>
      </Grid>

      {/* Expenses Breakdown Chart */}
      <Collapse in={mounted} timeout={1000}>
        <Paper sx={{ p: 3, mt: 3, borderRadius: 2, boxShadow: theme.shadows[4] }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <ReceiptIcon sx={{ mr: 1, color: 'primary.main' }} />
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
      </Collapse>

      {/* Cash & Runway Section */}
      <Collapse in={mounted} timeout={800}>
        <Box sx={{ mt: 3, mb: 2 }}>
          <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center' }}>
            <AccountBalanceIcon sx={{ mr: 1, color: 'primary.main' }} />
            Cash & Runway
          </Typography>
        </Box>
      </Collapse>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Collapse in={mounted} timeout={1000}>
            <StyledCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Cash on Hand
                </Typography>
                <Typography variant="h3">
                  ${metrics.find(m => m.metric_name === 'Cash on Hand')?.value.toLocaleString() || 0}
                </Typography>
              </CardContent>
            </StyledCard>
          </Collapse>
        </Grid>
        <Grid item xs={12} md={6}>
          <Collapse in={mounted} timeout={1200}>
            <StyledCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Runway
                </Typography>
                <Typography variant="h3">
                  {metrics.find(m => m.metric_name === 'Runway')?.value || 0} months
                </Typography>
              </CardContent>
            </StyledCard>
          </Collapse>
        </Grid>
      </Grid>

      {/* Recent Transactions */}
      <Collapse in={mounted} timeout={1000}>
        <Box sx={{ mt: 3 }}>
          <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <ReceiptIcon sx={{ mr: 1, color: 'primary.main' }} />
            Recent Transactions
          </Typography>
          <Paper sx={{ p: 2, borderRadius: 2, boxShadow: theme.shadows[4] }}>
            {transactions.slice(0, 20).map((transaction, index) => (
              <Collapse in={mounted} timeout={500 + index * 100} key={transaction.id}>
                <Box sx={{ 
                  mb: 2, 
                  p: 2, 
                  borderRadius: 1,
                  bgcolor: 'background.paper',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  }
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                      {transaction.type === 'income' ? 
                        <AttachMoneyIcon sx={{ mr: 1, color: 'success.main' }} /> : 
                        <TrendingUpIcon sx={{ mr: 1, color: 'error.main' }} />} 
                      {transaction.description}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontWeight: 'bold',
                        color: transaction.type === 'income' ? 'success.main' : 'error.main'
                      }}
                    >
                      {transaction.type === 'income' ? '+' : '-'}${Math.abs(transaction.amount).toLocaleString()}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(transaction.date).toLocaleDateString()}
                  </Typography>
                </Box>
              </Collapse>
            ))}
          </Paper>
        </Box>
      </Collapse>
    </Box>
  );
};

export default Dashboard; 