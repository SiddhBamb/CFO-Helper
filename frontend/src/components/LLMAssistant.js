import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import axios from 'axios';

const LLMAssistant = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const historyRef = useRef(null);

  useEffect(() => {
    const scrollToBottom = () => {
      try {
        if (historyRef.current) {
          const scrollHeight = historyRef.current.scrollHeight;
          const clientHeight = historyRef.current.clientHeight;
          if (scrollHeight > clientHeight) {
            historyRef.current.scrollTop = scrollHeight - clientHeight;
          }
        }
      } catch (error) {
        console.error('Error scrolling to bottom:', error);
      }
    };

    // Use requestAnimationFrame to ensure the DOM is updated
    requestAnimationFrame(scrollToBottom);
  }, [history]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5001/api/ask', {
        question,
      });

      const newHistoryItem = {
        question,
        answer: response.data.answer,
        timestamp: new Date().toLocaleString(),
      };

      setHistory([newHistoryItem, ...history]);
      setAnswer(response.data.answer);
      setQuestion('');
    } catch (error) {
      console.error('Error asking question:', error);
      setAnswer('Sorry, there was an error processing your question. Please make sure the Ollama server is running on port 11434.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        AI Financial Assistant
      </Typography>
      <Typography variant="body1" paragraph>
        Ask questions about your financial metrics, get advice on cost reduction, or analyze your business performance.
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            label="Ask a question about your finances"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading || !question.trim()}
          >
            {loading ? <CircularProgress size={24} /> : 'Ask'}
          </Button>
        </form>
      </Paper>

      {answer && (
        <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.default' }}>
          <Typography variant="h6" gutterBottom>
            Answer:
          </Typography>
          <Typography variant="body1" style={{ whiteSpace: 'pre-line' }}>
            {answer}
          </Typography>
        </Paper>
      )}

      {history.length > 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Previous Questions
          </Typography>
          <Box
            ref={historyRef}
            sx={{
              maxHeight: '400px',
              overflowY: 'auto',
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: '#f1f1f1',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#888',
                borderRadius: '4px',
                '&:hover': {
                  background: '#555',
                },
              },
            }}
          >
            <List>
              {history.map((item, index) => (
                <ListItem key={index} divider>
                  <ListItemText
                    primary={item.question}
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary">
                          {item.timestamp}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {item.answer}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default LLMAssistant; 