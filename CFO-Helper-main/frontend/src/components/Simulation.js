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
import PixelBusinessman from './PixelBusinessman';

const Simulation = () => {
  const [currentState, setCurrentState] = useState({
    cash: 0,
    revenue: 0,
    expenses: 0,
    customers: 0,
    churnRate: 0,
    customerSatisfaction: 0,
    productQuality: 0,
    marketingEfficiency: 0,
    teamSize: 0,
    month: 1,
    marketShare: 0,
    competitorPressure: 0,
  });

  const [currentEvent, setCurrentEvent] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [history, setHistory] = useState([]);
  const [cashTrend, setCashTrend] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch initial metrics from database
  useEffect(() => {
    const fetchInitialMetrics = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/metrics');
        const metrics = response.data;
        
        // Map database metrics to game state
        const initialState = {
          cash: metrics.find(m => m.metric_name === 'Cash on Hand')?.value || 0,
          revenue: metrics.find(m => m.metric_name === 'MRR')?.value || 0,
          expenses: metrics.find(m => m.metric_name === 'Operating Expenses')?.value || 0,
          customers: metrics.find(m => m.metric_name === 'Paying Customers')?.value || 0,
          churnRate: metrics.find(m => m.metric_name === 'Churn Rate')?.value || 0,
          customerSatisfaction: 85, // Default value as it's not in metrics
          productQuality: 80, // Default value as it's not in metrics
          marketingEfficiency: 70, // Default value as it's not in metrics
          teamSize: 15, // Default value as it's not in metrics
          month: 1,
          marketShare: 8, // Default value as it's not in metrics
          competitorPressure: 50, // Default value as it's not in metrics
        };

        setCurrentState(initialState);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching initial metrics:', error);
        setLoading(false);
      }
    };

    fetchInitialMetrics();
  }, []);

  // Initialize first event when component mounts and metrics are loaded
  useEffect(() => {
    if (!currentEvent && !loading) {
      setCurrentEvent(events[0]);
    }
  }, [loading]);

  // Calculate cash trend
  useEffect(() => {
    if (history.length > 0) {
      const lastEntry = history[history.length - 1];
      const currentProfit = lastEntry.result.revenue - lastEntry.result.expenses;
      const previousProfit = history.length > 1 
        ? history[history.length - 2].result.revenue - history[history.length - 2].result.expenses
        : currentState.revenue - currentState.expenses;
      
      // Calculate percentage change in profit
      // If previous profit is negative, we'll use absolute value to maintain correct sign
      const trend = previousProfit !== 0 
        ? ((currentProfit - previousProfit) / Math.abs(previousProfit)) * 100
        : currentProfit > 0 ? 100 : -100; // Handle division by zero
      
      console.log('Current Profit:', currentProfit);
      console.log('Previous Profit:', previousProfit);
      console.log('Trend:', trend);
      
      setCashTrend(Math.round(trend));
    } else {
      // For the first turn, if we're profitable, show as happy
      const initialProfit = currentState.revenue - currentState.expenses;
      setCashTrend(initialProfit > 0 ? 10 : 0);
    }
  }, [history, currentState]);

  const events = [
    {
      id: 1,
      title: 'Market Competition Intensifies',
      description: 'A major competitor has launched a similar product at a lower price point. Your sales team reports increasing pressure from customers requesting price matching.',
      options: [
        { 
          text: "Match competitor's prices", 
          effect: { 
            revenue: -15, 
            marketShare: 5,
            customerSatisfaction: 10
          },
          description: "Reduced prices to match competition, maintaining market share but impacting revenue."
        },
        { 
          text: "Focus on premium features", 
          effect: { 
            revenue: 10, 
            marketShare: -5,
            productQuality: 15
          },
          description: "Invested in premium features to differentiate from competition."
        },
        { 
          text: "Launch a new product line", 
          effect: { 
            revenue: -20, 
            marketShare: 15,
            expenses: 50000
          },
          description: "Launched new product line to capture different market segment."
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
    },
    {
      id: 5,
      title: 'Customer Service Crisis',
      description: 'Customer complaints are increasing, and support tickets are piling up. Your team is struggling to keep up.',
      options: [
        {
          text: 'Hire dedicated support team ($35,000/month)',
          effect: {
            expenses: 0.2,
            customerSatisfaction: 20,
            churnRate: -2,
            teamSize: 3,
            description: 'Improved customer service reduces churn'
          }
        },
        {
          text: 'Implement AI chatbot ($15,000 one-time)',
          effect: {
            cash: -15000,
            customerSatisfaction: 5,
            churnRate: -0.5,
            expenses: 0.05,
            description: 'Automated support helps with basic queries'
          }
        },
        {
          text: 'Outsource support ($25,000/month)',
          effect: {
            expenses: 0.15,
            customerSatisfaction: -5,
            churnRate: 1,
            description: 'Cost-effective but lower quality support'
          }
        }
      ]
    },
    {
      id: 6,
      title: 'Product Innovation Challenge',
      description: 'Your product is becoming outdated. Competitors are introducing new features that customers want.',
      options: [
        {
          text: 'Major feature update ($75,000)',
          effect: {
            cash: -75000,
            productQuality: 20,
            revenue: 0.25,
            customerSatisfaction: 15,
            description: 'Significant product improvements drive growth'
          }
        },
        {
          text: 'Incremental updates ($25,000)',
          effect: {
            cash: -25000,
            productQuality: 10,
            revenue: 0.1,
            customerSatisfaction: 5,
            description: 'Small improvements maintain competitiveness'
          }
        },
        {
          text: 'Focus on marketing existing features',
          effect: {
            revenue: -0.1,
            marketShare: -3,
            description: 'Product falls behind in features'
          }
        }
      ]
    },
    {
      id: 7,
      title: 'Economic Downturn',
      description: 'The economy is slowing down. Customers are becoming more price-sensitive and spending less.',
      options: [
        {
          text: 'Cut prices to maintain sales',
          effect: {
            revenue: -0.2,
            customers: 0.1,
            marketShare: 3,
            description: 'Lower prices help maintain customer base'
          }
        },
        {
          text: 'Focus on enterprise clients',
          effect: {
            revenue: 0.1,
            customers: -0.2,
            expenses: 0.15,
            description: 'Higher-value customers provide stability'
          }
        },
        {
          text: 'Reduce costs aggressively',
          effect: {
            expenses: -0.25,
            customerSatisfaction: -15,
            productQuality: -10,
            description: 'Cost cuts impact quality and satisfaction'
          }
        }
      ]
    },
    {
      id: 8,
      title: 'Data Security Incident',
      description: 'A potential security vulnerability has been discovered in your system. No data breach has occurred yet.',
      options: [
        {
          text: 'Full security audit ($50,000)',
          effect: {
            cash: -50000,
            customerSatisfaction: 10,
            churnRate: -1,
            description: 'Proactive security measures build trust'
          }
        },
        {
          text: 'Patch critical issues ($15,000)',
          effect: {
            cash: -15000,
            customerSatisfaction: 0,
            description: 'Basic security fixes implemented'
          }
        },
        {
          text: 'Ignore for now',
          effect: {
            customerSatisfaction: -20,
            churnRate: 2,
            description: 'Security risks remain unaddressed'
          }
        }
      ]
    },
    {
      id: 9,
      title: 'Marketing Campaign Decision',
      description: 'Your marketing team has proposed several strategies to increase brand awareness and customer acquisition.',
      options: [
        {
          text: 'Major brand campaign ($100,000)',
          effect: {
            cash: -100000,
            customers: 0.4,
            marketShare: 3,
            revenue: 0.2,
            description: 'Large-scale marketing drives growth'
          }
        },
        {
          text: 'Targeted digital ads ($30,000)',
          effect: {
            cash: -30000,
            customers: 0.15,
            marketShare: 1,
            revenue: 0.1,
            description: 'Focused marketing yields good ROI'
          }
        },
        {
          text: 'Organic growth focus',
          effect: {
            customers: -0.1,
            marketShare: -2,
            description: 'Growth slows without marketing'
          }
        }
      ]
    },
    {
      id: 10,
      title: 'Supply Chain Disruption',
      description: 'Your main supplier has increased prices and is experiencing delays. This could impact your product delivery.',
      options: [
        {
          text: 'Find alternative suppliers ($20,000)',
          effect: {
            cash: -20000,
            expenses: -0.1,
            productQuality: 5,
            description: 'Diversified supply chain reduces risk'
          }
        },
        {
          text: 'Negotiate with current supplier',
          effect: {
            expenses: 0.15,
            customerSatisfaction: -5,
            description: 'Higher costs but maintains relationships'
          }
        },
        {
          text: 'Pass costs to customers',
          effect: {
            revenue: 0.1,
            customerSatisfaction: -10,
            churnRate: 1,
            description: 'Price increase impacts customer satisfaction'
          }
        }
      ]
    }
  ];

  const handleOptionSelect = (optionIndex) => {
    const selectedOption = currentEvent.options[optionIndex];
    const newState = { ...currentState };
    
    // First, calculate the monthly revenue and expense changes
    let revenueChange = 0;
    let expenseChange = 0;
    let cashImpact = 0;

    // Apply effects
    Object.entries(selectedOption.effect).forEach(([key, value]) => {
      if (key === 'revenue') {
        // Revenue change is a percentage of current revenue
        revenueChange = Math.round(newState.revenue * (value/100));
        newState.revenue += revenueChange;
      } else if (key === 'expenses') {
        // Expense change could be absolute or percentage
        if (typeof value === 'number' && value > 1000) {
          // If value is large, treat as absolute change
          expenseChange = value;
          newState.expenses += value;
        } else {
          // Otherwise treat as percentage
          expenseChange = Math.round(newState.expenses * (value/100));
          newState.expenses += expenseChange;
        }
      } else if (key === 'cash') {
        // Direct cash impact (one-time cost or gain)
        cashImpact = value;
      } else if (key !== 'description') {
        // Other metrics (customers, satisfaction, etc.)
        newState[key] = Math.round(Math.min(100, Math.max(0, newState[key] + value)));
      }
    });

    // Update cash based on:
    // 1. Previous cash
    // 2. Monthly revenue - expenses
    // 3. One-time cash impacts
    newState.cash = newState.cash + cashImpact + (newState.revenue - newState.expenses);
    
    // Increment month
    newState.month += 1;

    // Add to history
    setHistory([...history, {
      month: currentState.month,
      event: currentEvent,
      decision: selectedOption.effect,
      result: { ...newState }
    }]);

    // Check game over conditions
    if (newState.cash <= 0 || newState.customers <= 0) {
      setGameOver(true);
      // Store the final state for accurate game over message
      setCurrentState(newState);
    } else {
      setCurrentState(newState);
      // Pick a random next event, but not the same one
      let nextEvent;
      do {
        nextEvent = events[Math.floor(Math.random() * events.length)];
      } while (nextEvent.id === currentEvent.id && events.length > 1);
      setCurrentEvent(nextEvent);
    }
  };

  const restartGame = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5001/api/metrics');
      const metrics = response.data;
      
      // Map database metrics to game state
      const initialState = {
        cash: metrics.find(m => m.metric_name === 'Cash on Hand')?.value || 0,
        revenue: metrics.find(m => m.metric_name === 'MRR')?.value || 0,
        expenses: metrics.find(m => m.metric_name === 'Operating Expenses')?.value || 0,
        customers: metrics.find(m => m.metric_name === 'Paying Customers')?.value || 0,
        churnRate: metrics.find(m => m.metric_name === 'Churn Rate')?.value || 0,
        customerSatisfaction: 85, // Default value as it's not in metrics
        productQuality: 80, // Default value as it's not in metrics
        marketingEfficiency: 70, // Default value as it's not in metrics
        teamSize: 15, // Default value as it's not in metrics
        month: 1,
        marketShare: 8, // Default value as it's not in metrics
        competitorPressure: 50, // Default value as it's not in metrics
      };

      setCurrentState(initialState);
      setCurrentEvent(events[0]);
      setGameOver(false);
      setHistory([]);
      setCashTrend(0);
    } catch (error) {
      console.error('Error fetching initial metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      p: 3, 
      backgroundColor: '#f5f5f5',
      borderRadius: 2,
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      maxWidth: '800px',
      mx: 'auto',
      fontFamily: '"Press Start 2P", cursive',
      position: 'relative',
      overflow: 'hidden',
      backgroundImage: `
        linear-gradient(45deg, #f5f5f5 25%, transparent 25%),
        linear-gradient(-45deg, #f5f5f5 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, #f5f5f5 75%),
        linear-gradient(-45deg, transparent 75%, #f5f5f5 75%)
      `,
      backgroundSize: '20px 20px',
      backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, #2ecc71, #3498db, #e74c3c)',
      }
    }}>
      <Typography variant="h4" gutterBottom sx={{ 
        fontFamily: "'Press Start 2P', cursive",
        textAlign: 'center',
        mb: 4,
        color: '#2c3e50',
        fontSize: '1.5rem',
        textShadow: '2px 2px 0px rgba(0,0,0,0.1)'
      }}>
        Business Trail
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={5}>
          <Card sx={{ 
            background: 'rgba(255, 255, 255, 0.95)',
            border: '4px solid #2c3e50',
            borderRadius: '0',
            boxShadow: '4px 4px 0px rgba(0,0,0,0.2)',
            minWidth: '300px',
            height: '100%'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ mb: 5 }}>
                <PixelBusinessman 
                  cashTrend={cashTrend} 
                  emotion={
                    gameOver 
                      ? 'dead'
                      : cashTrend <= -20 
                      ? 'panicked'
                      : cashTrend < 0 
                      ? 'worried'
                      : cashTrend >= 5
                      ? 'happy'
                      : 'neutral'
                  }
                />
              </Box>
              <Typography variant="h6" gutterBottom sx={{ 
                fontFamily: "'Press Start 2P', cursive",
                fontSize: '1.1rem',
                textAlign: 'center',
                color: '#2c3e50',
                mb: 3,
                mt: 2
              }}>
                Month {currentState.month}
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography sx={{ 
                    fontFamily: "'Press Start 2P', cursive", 
                    fontSize: '0.9rem',
                    color: '#2c3e50',
                    mb: 2
                  }}>
                    <strong>Cash:</strong> ${currentState.cash.toLocaleString()}
                  </Typography>
                  <Typography sx={{ 
                    fontFamily: "'Press Start 2P', cursive", 
                    fontSize: '0.9rem',
                    color: '#2c3e50',
                    mb: 2
                  }}>
                    <strong>Revenue:</strong> ${currentState.revenue.toLocaleString()}/mo
                  </Typography>
                  <Typography sx={{ 
                    fontFamily: "'Press Start 2P', cursive", 
                    fontSize: '0.9rem',
                    color: '#2c3e50',
                    mb: 2
                  }}>
                    <strong>Expenses:</strong> ${currentState.expenses.toLocaleString()}/mo
                  </Typography>
                  <Typography sx={{ 
                    fontFamily: "'Press Start 2P', cursive", 
                    fontSize: '0.9rem',
                    color: '#2c3e50',
                    mb: 2
                  }}>
                    <strong>Customers:</strong> {currentState.customers.toLocaleString()}
                  </Typography>
                  <Typography sx={{ 
                    fontFamily: "'Press Start 2P', cursive", 
                    fontSize: '0.9rem',
                    color: '#2c3e50',
                    mb: 2
                  }}>
                    <strong>Market Share:</strong> {currentState.marketShare}%
                  </Typography>
                  <Typography sx={{ 
                    fontFamily: "'Press Start 2P', cursive", 
                    fontSize: '0.9rem',
                    color: '#2c3e50',
                    mb: 2
                  }}>
                    <strong>Team Size:</strong> {currentState.teamSize}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={7}>
          {!gameOver && currentEvent && (
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.95)',
              border: '4px solid #2c3e50',
              borderRadius: '0',
              boxShadow: '4px 4px 0px rgba(0,0,0,0.2)',
              minWidth: '400px',
              height: '100%'
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ 
                  fontFamily: "'Press Start 2P', cursive",
                  fontSize: '1rem',
                  color: '#2c3e50',
                  mb: 3
                }}>
                  {currentEvent.title}
                </Typography>
                <Typography paragraph sx={{ 
                  fontFamily: "'Press Start 2P', cursive",
                  fontSize: '0.8rem',
                  mb: 4,
                  color: '#2c3e50',
                  lineHeight: '1.8'
                }}>
                  {currentEvent.description}
                </Typography>
                <Grid container spacing={3}>
                  {currentEvent.options.map((option, index) => (
                    <Grid item xs={12} key={index}>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => handleOptionSelect(index)}
                        sx={{
                          fontFamily: "'Press Start 2P', cursive",
                          fontSize: '0.8rem',
                          py: 2,
                          px: 3,
                          background: '#2c3e50',
                          color: '#fff',
                          border: '2px solid #000',
                          borderRadius: '0',
                          whiteSpace: 'normal',
                          height: 'auto',
                          lineHeight: '1.5',
                          '&:hover': {
                            background: '#34495e'
                          }
                        }}
                      >
                        {option.text}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          )}

          {gameOver && (
            <Card sx={{ 
              background: 'rgba(255, 255, 255, 0.95)',
              border: '4px solid #e74c3c',
              borderRadius: '0',
              boxShadow: '4px 4px 0px rgba(0,0,0,0.2)'
            }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ 
                  fontFamily: "'Press Start 2P', cursive",
                  fontSize: '0.9rem',
                  color: '#e74c3c'
                }}>
                  Game Over
                </Typography>
                <Typography paragraph sx={{ 
                  fontFamily: "'Press Start 2P', cursive",
                  fontSize: '0.7rem',
                  color: '#2c3e50',
                  lineHeight: '1.6'
                }}>
                  {currentState.cash <= 0 
                    ? "Your company ran out of cash!" 
                    : currentState.customers <= 0
                    ? "Your customer base has completely churned!"
                    : "Your company has gone bankrupt!"}
                </Typography>
                <Typography paragraph sx={{ 
                  fontFamily: "'Press Start 2P', cursive",
                  fontSize: '0.7rem',
                  color: '#2c3e50',
                  lineHeight: '1.6'
                }}>
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
                <Button 
                  variant="contained" 
                  onClick={restartGame}
                  sx={{
                    fontFamily: "'Press Start 2P', cursive",
                    fontSize: '0.7rem',
                    background: '#2c3e50',
                    color: '#fff',
                    border: '2px solid #000',
                    borderRadius: '0',
                    '&:hover': {
                      background: '#34495e'
                    }
                  }}
                >
                  Start New Game
                </Button>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {history.length > 0 && (
        <Paper sx={{ 
          p: 3, 
          mt: 4,
          background: 'rgba(255, 255, 255, 0.95)',
          border: '4px solid #2c3e50',
          borderRadius: '0',
          boxShadow: '4px 4px 0px rgba(0,0,0,0.2)',
          width: '100%'
        }}>
          <Typography variant="h6" gutterBottom sx={{ 
            fontFamily: "'Press Start 2P', cursive",
            fontSize: '0.9rem',
            color: '#2c3e50'
          }}>
            Decision History
          </Typography>
          {[...history].reverse().map((entry, index) => (
            <Box key={index} sx={{ 
              mb: 2, 
              p: 2, 
              border: '2px solid #2c3e50',
              borderRadius: '0',
              background: index % 2 === 0 ? 'rgba(44, 62, 80, 0.05)' : 'transparent'
            }}>
              <Typography variant="subtitle1" sx={{ 
                fontFamily: "'Press Start 2P', cursive",
                fontSize: '0.7rem',
                color: '#2c3e50'
              }}>
                Month {entry.month}: {entry.event.title}
              </Typography>
              <Typography variant="body2" sx={{ 
                fontFamily: "'Press Start 2P', cursive",
                fontSize: '0.7rem',
                color: '#2c3e50',
                lineHeight: '1.6'
              }}>
                Decision: {entry.event.options.find(opt => 
                  JSON.stringify(opt.effect) === JSON.stringify(entry.decision)
                )?.text}
              </Typography>
              <Typography variant="body2" sx={{ 
                fontFamily: "'Press Start 2P', cursive",
                fontSize: '0.7rem',
                color: '#2c3e50',
                lineHeight: '1.6'
              }}>
                Impact: {entry.decision.description}
              </Typography>
              <Typography variant="body2" sx={{ 
                fontFamily: "'Press Start 2P', cursive",
                fontSize: '0.7rem',
                color: '#2c3e50',
                lineHeight: '1.6'
              }}>
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