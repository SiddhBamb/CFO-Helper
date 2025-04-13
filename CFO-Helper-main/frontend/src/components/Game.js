import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Card, CardContent, Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const EventCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.02)',
  },
}));

const Game = () => {
  const [events, setEvents] = useState([]);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const financialEvents = [
    {
      id: 1,
      title: "Venture Capital Offer",
      description: "A VC firm offers $2M for 20% equity. What do you do?",
      options: [
        { text: "Accept the offer", impact: { cash: 2000000, equity: -20 } },
        { text: "Negotiate for better terms", impact: { cash: 2500000, equity: -20 } },
        { text: "Decline and bootstrap", impact: { cash: 0, equity: 0 } }
      ],
      correct: 1
    },
    {
      id: 2,
      title: "Customer Churn Crisis",
      description: "Your churn rate has increased by 5%. How do you respond?",
      options: [
        { text: "Increase marketing spend", impact: { marketing: 50000, churn: -2 } },
        { text: "Launch customer success program", impact: { marketing: 25000, churn: -3 } },
        { text: "Do nothing", impact: { churn: 1 } }
      ],
      correct: 1
    },
    {
      id: 3,
      title: "Competitor Price War",
      description: "A competitor has slashed prices by 30%. What's your move?",
      options: [
        { text: "Match their prices", impact: { revenue: -15, marketShare: 5 } },
        { text: "Focus on premium features", impact: { revenue: 10, marketShare: -5 } },
        { text: "Launch a new product line", impact: { revenue: -20, marketShare: 15 } }
      ],
      correct: 2
    },
    {
      id: 4,
      title: "Team Expansion",
      description: "You need to scale your engineering team. What's your approach?",
      options: [
        { text: "Hire senior engineers", impact: { cash: -200000, productivity: 30 } },
        { text: "Hire junior engineers", impact: { cash: -100000, productivity: 15 } },
        { text: "Outsource development", impact: { cash: -50000, productivity: 10 } }
      ],
      correct: 0
    },
    {
      id: 5,
      title: "Product Launch",
      description: "Time to launch your new feature. What's your strategy?",
      options: [
        { text: "Big launch event", impact: { marketing: 100000, users: 10000 } },
        { text: "Soft launch with beta users", impact: { marketing: 25000, users: 5000 } },
        { text: "Gradual rollout", impact: { marketing: 50000, users: 7500 } }
      ],
      correct: 1
    },
    {
      id: 6,
      title: "Economic Downturn",
      description: "The market is crashing. How do you protect your business?",
      options: [
        { text: "Cut costs aggressively", impact: { cash: 200000, morale: -20 } },
        { text: "Focus on core customers", impact: { revenue: -10, churn: -5 } },
        { text: "Double down on growth", impact: { cash: -100000, marketShare: 10 } }
      ],
      correct: 1
    },
    {
      id: 7,
      title: "Data Breach",
      description: "You've discovered a security vulnerability. What's your response?",
      options: [
        { text: "Immediate fix and disclosure", impact: { cash: -50000, trust: 5 } },
        { text: "Silent fix", impact: { cash: -25000, trust: -10 } },
        { text: "Ignore it", impact: { trust: -20 } }
      ],
      correct: 0
    },
    {
      id: 8,
      title: "Partnership Opportunity",
      description: "A major company wants to partner. What's your approach?",
      options: [
        { text: "Exclusive partnership", impact: { revenue: 25, flexibility: -20 } },
        { text: "Non-exclusive partnership", impact: { revenue: 15, flexibility: 0 } },
        { text: "Decline partnership", impact: { revenue: 0, flexibility: 10 } }
      ],
      correct: 1
    },
    {
      id: 9,
      title: "Regulatory Changes",
      description: "New regulations affect your business model. How do you adapt?",
      options: [
        { text: "Comply immediately", impact: { cash: -100000, compliance: 100 } },
        { text: "Gradual compliance", impact: { cash: -50000, compliance: 50 } },
        { text: "Challenge the regulations", impact: { cash: -200000, compliance: 0 } }
      ],
      correct: 1
    },
    {
      id: 10,
      title: "Acquisition Offer",
      description: "A competitor wants to buy you out. What's your decision?",
      options: [
        { text: "Accept the offer", impact: { cash: 10000000, exit: true } },
        { text: "Negotiate higher price", impact: { cash: 15000000, exit: true } },
        { text: "Stay independent", impact: { growth: 20 } }
      ],
      correct: 2
    }
  ];

  useEffect(() => {
    // Shuffle events
    const shuffledEvents = [...financialEvents].sort(() => Math.random() - 0.5);
    setEvents(shuffledEvents);
    setCurrentEvent(shuffledEvents[0]);
  }, []);

  const handleOptionSelect = (optionIndex) => {
    if (currentEvent.correct === optionIndex) {
      setScore(score + 10);
    }

    const currentIndex = events.indexOf(currentEvent);
    if (currentIndex < events.length - 1) {
      setCurrentEvent(events[currentIndex + 1]);
    } else {
      setGameOver(true);
    }
  };

  if (gameOver) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Game Over!
        </Typography>
        <Typography variant="h6" gutterBottom>
          Your final score: {score}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.location.reload()}
        >
          Play Again
        </Button>
      </Box>
    );
  }

  if (!currentEvent) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">Score: {score}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <EventCard>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {currentEvent.title}
              </Typography>
              <Typography variant="body1" paragraph>
                {currentEvent.description}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {currentEvent.options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outlined"
                    fullWidth
                    onClick={() => handleOptionSelect(index)}
                    sx={{ justifyContent: 'flex-start', textAlign: 'left' }}
                  >
                    {option.text}
                  </Button>
                ))}
              </Box>
            </CardContent>
          </EventCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Game; 