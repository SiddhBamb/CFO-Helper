import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import axios from 'axios';

const Simulation = () => {
  const [currentState, setCurrentState] = useState({
    cash: 850000,
    revenue: 75000,
    expenses: 45000,
    customers: 377,
    churnRate: 2.5,
    customerSatisfaction: 85,
    productQuality: 80,
    marketingEfficiency: 70,
    teamSize: 15,
    month: 1,
    marketShare: 8,
    competitorPressure: 50,
  });

  const [currentEvent, setCurrentEvent] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [history, setHistory] = useState([]);

  const events = [
    {
      id: 1,
      title: 'Market Competition Intensifies',
      description: 'A major competitor has launched a similar product at a lower price point. Your sales team reports increasing pressure from customers requesting price matching.',
      options: [
        {
          text: 'Lower prices by 20% to stay competitive',
          effect: {
            revenue: -0.2,
            customers: 0.15,
            cash: -10000,
            marketShare: 2,
            competitorPressure: -20,
            description: 'Price reduction impacts revenue but helps retain market share'
          }
        },
        {
          text: 'Invest in product innovation ($50,000) to differentiate',
          effect: {
            cash: -50000,
            expenses: 0.1,
            productQuality: 15,
            revenue: 0.25,
            marketShare: 3,
            competitorPressure: -30,
            description: 'Product improvements lead to higher customer satisfaction and revenue'
          }
        },
        {
          text: 'Launch aggressive marketing campaign ($30,000)',
          effect: {
            cash: -30000,
            marketingEfficiency: 20,
            customers: 0.2,
            expenses: 0.15,
            marketShare: 1.5,
            competitorPressure: -10,
            description: 'Marketing boost attracts new customers but increases expenses'
          }
        }
      ]
    },
    {
      id: 2,
      title: 'Technical Infrastructure Decision',
      description: 'Your platform is experiencing scalability issues due to growing user base. Technical debt is accumulating.',
      options: [
        {
          text: 'Complete infrastructure overhaul ($100,000)',
          effect: {
            cash: -100000,
            expenses: -0.1,
            productQuality: 25,
            customerSatisfaction: 15,
            churnRate: -1,
            description: 'Major improvement in system reliability and performance'
          }
        },
        {
          text: 'Implement incremental improvements ($25,000)',
          effect: {
            cash: -25000,
            productQuality: 10,
            customerSatisfaction: 5,
            expenses: -0.05,
            description: 'Moderate improvements with lower immediate cost'
          }
        },
        {
          text: 'Maintain current system',
          effect: {
            productQuality: -5,
            customerSatisfaction: -10,
            churnRate: 0.5,
            description: 'Technical debt continues to accumulate'
          }
        }
      ]
    },
    {
      id: 3,
      title: 'Team Expansion Opportunity',
      description: 'Growing workload is stretching the team thin. You have the opportunity to hire more staff.',
      options: [
        {
          text: 'Hire 5 new employees ($50,000/month increase)',
          effect: {
            expenses: 0.3,
            teamSize: 5,
            productQuality: 15,
            customerSatisfaction: 10,
            revenue: 0.2,
            description: 'Larger team improves product and service quality'
          }
        },
        {
          text: 'Hire 2 critical roles ($20,000/month increase)',
          effect: {
            expenses: 0.12,
            teamSize: 2,
            productQuality: 8,
            customerSatisfaction: 5,
            revenue: 0.1,
            description: 'Targeted hiring addresses key gaps'
          }
        },
        {
          text: 'Optimize current team structure',
          effect: {
            productQuality: -5,
            customerSatisfaction: -5,
            teamSize: 0,
            description: 'Team remains stretched thin'
          }
        }
      ]
    },
    {
      id: 4,
      title: 'Market Expansion Opportunity',
      description: 'A new market segment has emerged with high potential for growth.',
      options: [
        {
          text: 'Full-scale expansion ($150,000)',
          effect: {
            cash: -150000,
            revenue: 0.4,
            expenses: 0.3,
            customers: 0.5,
            marketShare: 5,
            description: 'Major expansion could lead to significant growth'
          }
        },
        {
          text: 'Pilot program ($40,000)',
          effect: {
            cash: -40000,
            revenue: 0.15,
            expenses: 0.1,
            customers: 0.2,
            marketShare: 2,
            description: 'Test the market with lower risk'
          }
        },
        {
          text: 'Focus on current market',
          effect: {
            revenue: 0.05,
            marketShare: -1,
            description: 'Maintain focus but miss expansion opportunity'
          }
        }
      ]
    }
  ];

  const calculateImpact = (currentState, effect) => {
    const newState = { ...currentState };
    
    // Apply direct numerical changes
    Object.keys(effect).forEach(key => {
      if (key !== 'description') {
        if (typeof effect[key] === 'number') {
          if (key.includes('Rate') || key.includes('Share') || key.includes('Efficiency') || 
              key.includes('Quality') || key.includes('Satisfaction')) {
            // For percentage-based metrics, add/subtract directly
            newState[key] = Math.max(0, Math.min(100, newState[key] + effect[key]));
          } else if (typeof effect[key] === 'number' && effect[key] > -1 && effect[key] < 1) {
            // For percentage changes (decimals between -1 and 1)
            newState[key] *= (1 + effect[key]);
          } else {
            // For absolute changes
            newState[key] += effect[key];
          }
        }
      }
    });

    // Calculate derived impacts
    newState.revenue *= (1 + (newState.customerSatisfaction - currentState.customerSatisfaction) * 0.002);
    newState.churnRate *= (1 - (newState.productQuality - currentState.productQuality) * 0.01);
    newState.customers *= (1 - newState.churnRate / 100);

    // Monthly cash flow calculation
    newState.cash += (newState.revenue - newState.expenses);
    
    // Round numerical values
    Object.keys(newState).forEach(key => {
      if (typeof newState[key] === 'number') {
        newState[key] = Math.round(newState[key] * 100) / 100;
      }
    });

    return newState;
  };

  const handleOptionSelect = (effect) => {
    const newState = calculateImpact(currentState, effect);
    newState.month += 1;

    // Add to history
    setHistory([...history, {
      month: currentState.month,
      event: currentEvent,
      decision: effect,
      result: newState,
    }]);

    setCurrentState(newState);

    // Check game over conditions
    if (newState.cash <= 0 || newState.customers <= 0) {
      setGameOver(true);
    } else {
      // Get new random event
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      setCurrentEvent(randomEvent);
    }
  };

  useEffect(() => {
    // Start the game with a random event
    const randomEvent = events[Math.floor(Math.random() * events.length)];
    setCurrentEvent(randomEvent);
  }, []);

  const restartGame = () => {
    setCurrentState({
      cash: 850000,
      revenue: 75000,
      expenses: 45000,
      customers: 377,
      churnRate: 2.5,
      customerSatisfaction: 85,
      productQuality: 80,
      marketingEfficiency: 70,
      teamSize: 15,
      month: 1,
      marketShare: 8,
      competitorPressure: 50,
    });
    setGameOver(false);
    setHistory([]);
    const randomEvent = events[Math.floor(Math.random() * events.length)];
    setCurrentEvent(randomEvent);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Business Simulation
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Company Status - Month {currentState.month}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography><strong>Cash:</strong> ${currentState.cash.toLocaleString()}</Typography>
                  <Typography><strong>Revenue:</strong> ${currentState.revenue.toLocaleString()}/mo</Typography>
                  <Typography><strong>Expenses:</strong> ${currentState.expenses.toLocaleString()}/mo</Typography>
                  <Typography><strong>Customers:</strong> {currentState.customers.toLocaleString()}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography><strong>Churn Rate:</strong> {currentState.churnRate}%</Typography>
                  <Typography><strong>Team Size:</strong> {currentState.teamSize}</Typography>
                  <Typography><strong>Market Share:</strong> {currentState.marketShare}%</Typography>
                  <Typography><strong>Product Quality:</strong> {currentState.productQuality}/100</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          {!gameOver && currentEvent && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {currentEvent.title}
                </Typography>
                <Typography paragraph>{currentEvent.description}</Typography>
                {currentEvent.options.map((option, index) => (
                  <Tooltip 
                    key={index}
                    title={option.effect.description}
                    placement="right"
                  >
                    <Button
                      variant="outlined"
                      fullWidth
                      sx={{ mb: 1 }}
                      onClick={() => handleOptionSelect(option.effect)}
                    >
                      {option.text}
                    </Button>
                  </Tooltip>
                ))}
              </CardContent>
            </Card>
          )}

          {gameOver && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Game Over
                </Typography>
                <Typography paragraph>
                  {currentState.cash <= 0 
                    ? "Your company ran out of cash!" 
                    : "Your customer base has completely churned!"}
                </Typography>
                <Typography paragraph>
                  Final Stats:
                  <br />
                  Months Survived: {currentState.month}
                  <br />
                  Final Cash: ${currentState.cash.toLocaleString()}
                  <br />
                  Final Customers: {currentState.customers.toLocaleString()}
                  <br />
                  Market Share: {currentState.marketShare}%
                </Typography>
                <Button variant="contained" onClick={restartGame}>
                  Start New Game
                </Button>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {history.length > 0 && (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Decision History
          </Typography>
          {history.map((entry, index) => (
            <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
              <Typography variant="subtitle1">
                Month {entry.month}: {entry.event.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Decision: {entry.event.options.find(opt => 
                  JSON.stringify(opt.effect) === JSON.stringify(entry.decision)
                )?.text}
              </Typography>
              <Typography variant="body2">
                Impact: {entry.decision.description}
              </Typography>
              <Typography variant="body2">
                Cash: ${entry.result.cash.toLocaleString()} | 
                Revenue: ${entry.result.revenue.toLocaleString()}/mo | 
                Customers: {entry.result.customers.toLocaleString()}
              </Typography>
            </Box>
          ))}
        </Paper>
      )}
    </Box>
  );
};

export default Simulation; 