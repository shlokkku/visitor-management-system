import React, { useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  TextField,
  IconButton,
  Paper
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

// Constants
const PRIMARY_COLOR = "#2c3e50";
const SECONDARY_COLOR = "#3498db";
const LIGHT_BG = "rgba(52, 152, 219, 0.08)";

// Utility Function for Date Formatting
const formatTime = (date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Mock Initial Data
const MOCK_THREADS = [
  {
    id: 'thread1',
    participants: [{ name: 'A Wing 304' }],
    messages: [
      {
        id: 'm1',
        content: 'This is the plumbers number.',
        timestamp: new Date('2024-03-26T19:54:00'),
        type: 'received'
      },
      {
        id: 'm2',
        content: 'Can you share the number with me?',
        timestamp: new Date('2024-03-26T19:58:00'),
        type: 'sent'
      }
    ]
  },
  {
    id: 'thread2',
    participants: [{ name: 'D Wing 203' }],
    messages: [
      {
        id: 'm3',
        content: 'Okay',
        timestamp: new Date('2024-03-26T19:58:00'),
        type: 'received'
      }
    ]
  }
];

const CommunicationPage = () => {
  // State Management
  const [threads, setThreads] = useState(MOCK_THREADS);
  const [selectedThread, setSelectedThread] = useState(MOCK_THREADS[0]);
  const [newMessage, setNewMessage] = useState('');

  // Handle Message Sending
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    // Create new message
    const newMessageObj = {
      id: `m${Date.now()}`,
      content: newMessage,
      timestamp: new Date(),
      type: 'sent'
    };

    // Update the selected thread's messages
    const updatedThreads = threads.map(thread => 
      thread.id === selectedThread.id 
        ? {
            ...thread, 
            messages: [...thread.messages, newMessageObj]
          }
        : thread
    );

    setThreads(updatedThreads);
    setSelectedThread(prevThread => ({
      ...prevThread,
      messages: [...prevThread.messages, newMessageObj]
    }));

    // Clear input
    setNewMessage('');
  };

  return (
    <Paper 
      elevation={1} 
      sx={{ 
        height: "100%", 
        display: "flex",
        borderRadius: 2,
        border: `1px solid ${LIGHT_BG}`,
        overflow: 'hidden'
      }}
    >
      {/* Thread List Sidebar */}
      <Box 
        sx={{ 
          width: '250px', 
          borderRight: `1px solid ${LIGHT_BG}`,
          overflowY: 'auto' 
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            p: 2, 
            borderBottom: `1px solid ${LIGHT_BG}`,
            color: PRIMARY_COLOR 
          }}
        >
          Threads
        </Typography>
        <List>
          {threads.map(thread => (
            <ListItem 
              key={thread.id}
              selected={selectedThread?.id === thread.id}
              onClick={() => setSelectedThread(thread)}
              sx={{ 
                cursor: 'pointer',
                '&.Mui-selected': {
                  backgroundColor: LIGHT_BG
                }
              }}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: SECONDARY_COLOR }}>
                  {thread.participants[0]?.name?.[0] || 'T'}
                </Avatar>
              </ListItemAvatar>
              <ListItemText 
                primary={thread.participants[0]?.name || 'Thread'}
                secondary={thread.messages[thread.messages.length - 1]?.content?.slice(0, 30) + '...' || 'No messages'}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Message Area */}
      <Box 
        sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column' 
        }}
      >
        {/* Thread Header */}
        {selectedThread && (
          <Box 
            sx={{ 
              p: 2, 
              borderBottom: `1px solid ${LIGHT_BG}`,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Avatar sx={{ mr: 2, bgcolor: SECONDARY_COLOR }}>
              {selectedThread.participants[0]?.name?.[0] || 'T'}
            </Avatar>
            <Typography variant="h6">
              {selectedThread.participants[0]?.name || 'Thread'}
            </Typography>
          </Box>
        )}

        {/* Messages List */}
        <List 
          sx={{ 
            flexGrow: 1, 
            overflowY: 'auto',
            p: 2 
          }}
        >
          {selectedThread?.messages?.map(message => (
            <ListItem 
              key={message.id}
              sx={{
                justifyContent: message.type === 'sent' 
                  ? 'flex-end' 
                  : 'flex-start',
                mb: 1
              }}
            >
              <Box 
                sx={{
                  maxWidth: '70%',
                  bgcolor: message.type === 'sent' 
                    ? SECONDARY_COLOR 
                    : LIGHT_BG,
                  color: message.type === 'sent' ? 'white' : 'black',
                  p: 1.5,
                  borderRadius: 2
                }}
              >
                <Typography variant="body2">
                  {message.content}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    display: 'block', 
                    textAlign: 'right',
                    mt: 0.5,
                    opacity: 0.7 
                  }}
                >
                  {formatTime(message.timestamp)}
                </Typography>
              </Box>
            </ListItem>
          ))}
        </List>

        {/* Message Input */}
        <Box 
          sx={{ 
            p: 2, 
            borderTop: `1px solid ${LIGHT_BG}`,
            display: 'flex' 
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type a message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            sx={{ mr: 1 }}
          />
          <IconButton 
            color="primary" 
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};

export default CommunicationPage;