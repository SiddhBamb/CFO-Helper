import React from 'react';
import { Box, Typography } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

const BusinessAlert = ({ metrics }) => {
  const getBusinessSuggestion = () => {
    if (!metrics) return null;

    const { 
      mrr = 0,
      arr = 0,
      revenueGrowth = 0,
      customerAcquisitionCost = 0,
      customerLifetimeValue = 0,
      churnRate = 0,
      runwayMonths = 0
    } = metrics;

    // Check for low runway
    if (runwayMonths < 6) {
      return {
        severity: 'high',
        message: 'Low runway detected! Consider reducing expenses or raising additional capital to extend your runway beyond 6 months.'
      };
    }

    // Check for high churn
    if (churnRate > 1) {
      return {
        severity: 'high',
        message: 'High churn rate detected! Focus on customer retention strategies and improving product value to reduce churn.'
      };
    }

    // Check for low growth
    if (revenueGrowth < 10) {
      return {
        severity: 'medium',
        message: 'Revenue growth is below target. Consider increasing marketing efforts or exploring new customer segments.'
      };
    }

    // Check for high CAC
    if (customerAcquisitionCost > customerLifetimeValue * 0.3) {
      return {
        severity: 'medium',
        message: 'Customer acquisition cost is high relative to lifetime value. Optimize marketing channels and improve conversion rates.'
      };
    }

    // Check for low MRR
    if (mrr < 50000) {
      return {
        severity: 'low',
        message: 'Consider implementing upselling strategies to increase monthly recurring revenue.'
      };
    }

    // Default positive message
    return {
      severity: 'low',
      message: 'Business metrics are healthy! Consider reinvesting profits into growth initiatives.'
    };
  };

  const suggestion = getBusinessSuggestion();

  if (!suggestion) return null;

  return (
    <Box
      sx={{
        backgroundColor: 'rgba(255, 152, 0, 0.1)',
        border: '1px solid rgba(255, 152, 0, 0.3)',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
      }}
    >
      <WarningIcon sx={{ color: 'warning.main', mt: 0.5 }} />
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
          Business Suggestion
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {suggestion.message}
        </Typography>
      </Box>
    </Box>
  );
};

export default BusinessAlert; 