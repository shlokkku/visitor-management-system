import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Avatar, 
  TextField, 
  IconButton, 
  Badge, 
  InputAdornment,
  Paper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FilterListIcon from '@mui/icons-material/FilterList';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';


const THEME = {
  primary: "#1a73e8",
  secondary: "#f5f5f5",
  text: "#212121",
  textSecondary: "#5f6368",
  lightGray: "#e0e0e0",
  success: "#34a853",
  lightBg: "#f8f9fa",
  sentBubble: "#e3f2fd",
  receivedBubble: "#ffffff",
  backgroundGray: "#f7f9fc",
  onlineGreen: "#4caf50"
};


const MOCK_THREADS = [
  {
    id: 'thread1',
    name: 'A Wing 304',
    avatar: 'A',
    lastMessage: 'This is the plumber\'s number: 9876543210',
    timestamp: new Date('2024-04-27T10:54:00'),
    unread: 0,
    status: 'online',
    pinned: true
  },
  {
    id: 'thread2',
    name: 'D Wing 203',
    avatar: 'D',
    lastMessage: 'When will the water supply resume?',
    timestamp: new Date('2024-04-27T09:30:00'),
    unread: 2,
    status: 'offline',
    pinned: false
  },
  {
    id: 'thread3',
    name: 'Building Security',
    avatar: 'B',
    lastMessage: 'New visitor at the gate',
    timestamp: new Date('2024-04-26T18:22:00'),
    unread: 1,
    status: 'offline',
    pinned: false
  },
  {
    id: 'thread4',
    name: 'B Wing 102',
    avatar: 'B',
    lastMessage: 'Thank you for approving my request',
    timestamp: new Date('2024-04-26T16:15:00'),
    unread: 0,
    status: 'offline',
    pinned: false
  },
  {
    id: 'thread5',
    name: 'C Wing 501',
    avatar: 'C',
    lastMessage: 'Issue with parking allocation',
    timestamp: new Date('2024-04-25T14:40:00'),
    unread: 0,
    status: 'offline',
    pinned: false
  }
];

// Message data for selected thread
const MESSAGE_DATA = {
  'thread1': [
    {
      id: 'm1',
      content: 'Hello, I\'m having an issue with water leakage in my bathroom.',
      timestamp: new Date('2024-04-26T19:30:00'),
      type: 'received',
      status: 'read'
    },
    {
      id: 'm2',
      content: 'I understand. Could you share some pictures of the leakage?',
      timestamp: new Date('2024-04-26T19:32:00'),
      type: 'sent',
      status: 'read'
    },
    {
      id: 'm3',
      content: 'Here are the pictures. The leak seems to be coming from the pipe connection.',
      timestamp: new Date('2024-04-26T19:35:00'),
      type: 'received',
      status: 'read',
      attachment: {
        type: 'image',
        name: 'leakage.jpg'
      }
    },
    {
      id: 'm4',
      content: 'Thank you for sharing. I\'ll arrange for the plumber to visit tomorrow between 10 AM and 12 PM. Would that work for you?',
      timestamp: new Date('2024-04-26T19:40:00'),
      type: 'sent',
      status: 'read'
    },
    {
      id: 'm5',
      content: 'Yes, that works perfectly. Thank you for the quick response.',
      timestamp: new Date('2024-04-26T19:42:00'),
      type: 'received',
      status: 'read'
    },
    {
      id: 'm6',
      content: 'This is the plumber\'s number: 9876543210. You can contact him directly if needed.',
      timestamp: new Date('2024-04-26T19:54:00'),
      type: 'received',
      status: 'read'
    },
    {
      id: 'm7',
      content: 'Can you share the number with me?',
      timestamp: new Date('2024-04-26T19:58:00'),
      type: 'sent',
      status: 'read'
    }
  ],
  'thread2': [
    {
      id: 'm1',
      content: 'Hi, we\'re experiencing water shortage in our apartment since morning.',
      timestamp: new Date('2024-04-27T09:15:00'),
      type: 'received',
      status: 'read'
    },
    {
      id: 'm2',
      content: 'When will the water supply resume?',
      timestamp: new Date('2024-04-27T09:30:00'),
      type: 'received',
      status: 'delivered'
    }
  ],
  'thread3': [
    {
      id: 'm1',
      content: 'New visitor at the gate: Rahul from Swiggy with delivery for A Wing 204',
      timestamp: new Date('2024-04-26T18:22:00'),
      type: 'received',
      status: 'delivered'
    }
  ],
  'thread4': [
    {
      id: 'm1',
      content: 'Thank you for approving my request for the community hall booking.',
      timestamp: new Date('2024-04-26T16:15:00'),
      type: 'received',
      status: 'read'
    }
  ],
  'thread5': [
    {
      id: 'm1',
      content: 'Hi, I\'m facing an issue with my parking allocation. Someone else keeps parking in my spot.',
      timestamp: new Date('2024-04-25T14:40:00'),
      type: 'received',
      status: 'read'
    }
  ]
};

// Utility Functions
const formatDate = (date) => {
  const now = new Date();
  
  if (date.toDateString() === now.toDateString()) {
    return 'Apr 27, 2024'; // Today format
  } else {
    // Custom format to match the screenshot
    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  }
};

const formatTime = (date) => {
  return date.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: false 
  });
};

const CommunicationPage = () => {
  // State
  const [threads, setThreads] = useState(MOCK_THREADS);
  const [selectedThreadId, setSelectedThreadId] = useState('thread1');
  const [messages, setMessages] = useState(MESSAGE_DATA[selectedThreadId] || []);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);

  // Get the selected thread data
  const selectedThread = threads.find(thread => thread.id === selectedThreadId);

  // Filter threads based on search query
  const filteredThreads = threads.filter(thread => 
    thread.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    thread.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort threads: pinned first, then by timestamp
  const sortedThreads = [...filteredThreads].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return b.timestamp - a.timestamp;
  });

  // Effect to scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Effect to load messages when selected thread changes
  useEffect(() => {
    setMessages(MESSAGE_DATA[selectedThreadId] || []);
    
    // Mark messages as read when selecting thread
    setThreads(prevThreads => 
      prevThreads.map(thread => 
        thread.id === selectedThreadId ? { ...thread, unread: 0 } : thread
      )
    );
  }, [selectedThreadId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleThreadSelect = (threadId) => {
    setSelectedThreadId(threadId);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // Create new message
    const newMessageObj = {
      id: `m${Date.now()}`,
      content: newMessage,
      timestamp: new Date(),
      type: 'sent',
      status: 'sent'
    };

    // Add message to the current thread
    setMessages(prev => [...prev, newMessageObj]);
    
    // Update thread's last message
    setThreads(prevThreads => 
      prevThreads.map(thread => 
        thread.id === selectedThreadId 
          ? {
              ...thread,
              lastMessage: newMessage,
              timestamp: new Date()
            }
          : thread
      )
    );

    // Clear input
    setNewMessage('');
    
    // Focus back on input after sending
    messageInputRef.current?.focus();
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      height: '100vh',
      bgcolor: 'white',
      overflow: 'hidden'
    }}>
      {/* Left Panel - Conversations List - adjusted to match image */}
      <Box sx={{ 
        width: 405,
        borderRight: `1px solid ${THEME.lightGray}`,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'white'
      }}>
        {/* Header */}
        <Box sx={{ 
          p: 2.5,
          borderBottom: `1px solid ${THEME.lightGray}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Typography variant="h6" fontWeight={500} color={THEME.text}>
            Messages
          </Typography>
          <IconButton size="small">
            <FilterListIcon />
          </IconButton>
        </Box>

        {/* Search Bar */}
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search messages"
            size="small"
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              )
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 4,
                backgroundColor: THEME.secondary
              }
            }}
          />
        </Box>

        {/* Threads List */}
        <Box sx={{ overflow: 'auto', flexGrow: 1 }}>
          {sortedThreads.map((thread) => (
            <Box 
              key={thread.id}
              onClick={() => handleThreadSelect(thread.id)}
              sx={{
                p: 2,
                cursor: 'pointer',
                bgcolor: selectedThreadId === thread.id ? THEME.lightBg : 'white',
                borderBottom: `1px solid ${THEME.lightGray}`,
                '&:hover': {
                  bgcolor: selectedThreadId === thread.id ? THEME.lightBg : 'rgba(0,0,0,0.04)'
                }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex' }}>
                  <Box sx={{ position: 'relative' }}>
                    <Avatar 
                      sx={{ 
                        width: 48, 
                        height: 48, 
                        bgcolor: thread.id === 'thread3' ? '#FF9800' : THEME.primary,
                        fontWeight: 'bold'
                      }}
                    >
                      {thread.avatar}
                    </Avatar>
                    {thread.status === 'online' && (
                      <Box 
                        sx={{
                          position: 'absolute',
                          width: 12,
                          height: 12,
                          bgcolor: THEME.onlineGreen,
                          borderRadius: '50%',
                          border: '2px solid white',
                          bottom: 0,
                          right: 0
                        }}
                      />
                    )}
                  </Box>
                  
                  <Box sx={{ ml: 2, overflow: 'hidden', width: '70%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography 
                        variant="subtitle1" 
                        fontWeight={500}
                        color={THEME.text}
                        noWrap
                      >
                        {thread.name}
                      </Typography>
                      {thread.pinned && (
                        <StarIcon sx={{ ml: 1, fontSize: 16, color: 'red' }} />
                      )}
                    </Box>
                    
                    <Typography 
                      variant="body2" 
                      color={THEME.textSecondary}
                      noWrap
                      sx={{ mt: 0.5 }}
                    >
                      {thread.lastMessage}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minWidth: 70 }}>
                  <Typography 
                    variant="caption" 
                    color={thread.unread > 0 ? THEME.primary : THEME.textSecondary}
                  >
                    {formatDate(thread.timestamp)}
                  </Typography>
                  
                  {thread.unread > 0 && (
                    <Badge 
                      badgeContent={thread.unread} 
                      color="primary"
                      sx={{ mt: 1 }}
                    />
                  )}
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Right Panel - Chat Area */}
      <Box sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column',
        height: '100%',
        bgcolor: THEME.backgroundGray
      }}>
        {selectedThread && (
          <>
            {/* Chat Header */}
            <Box sx={{ 
              px: 3,
              py: 2,
              borderBottom: `1px solid ${THEME.lightGray}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              bgcolor: 'white'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ position: 'relative' }}>
                  <Avatar 
                    sx={{ 
                      width: 44, 
                      height: 44, 
                      bgcolor: selectedThread.id === 'thread3' ? '#FF9800' : THEME.primary,
                      fontWeight: 'bold'
                    }}
                  >
                    {selectedThread.avatar}
                  </Avatar>
                  {selectedThread.status === 'online' && (
                    <Box 
                      sx={{
                        position: 'absolute',
                        width: 12,
                        height: 12,
                        bgcolor: THEME.onlineGreen,
                        borderRadius: '50%',
                        border: '2px solid white',
                        bottom: 0,
                        right: 0
                      }}
                    />
                  )}
                </Box>
                <Box sx={{ ml: 2 }}>
                  <Typography variant="subtitle1" fontWeight={500} color={THEME.text}>
                    {selectedThread.name}
                  </Typography>
                  <Typography variant="caption" color={THEME.textSecondary}>
                    {selectedThread.status === 'online' ? 'Online' : 'Offline'}
                  </Typography>
                </Box>
              </Box>

              <Box>
                <IconButton>
                  <NotificationsIcon />
                </IconButton>
                <IconButton>
                  <MoreVertIcon />
                </IconButton>
              </Box>
            </Box>

            {/* Messages Area */}
            <Box sx={{ 
              flexGrow: 1, 
              overflow: 'auto', 
              px: 3,
              py: 2,
              display: 'flex',
              flexDirection: 'column'
            }}>
              {messages.map((message) => (
                <Box
                  key={message.id}
                  sx={{
                    display: 'flex',
                    justifyContent: message.type === 'sent' ? 'flex-end' : 'flex-start',
                    mb: 2
                  }}
                >
                  {message.attachment && (
                    <Paper 
                      elevation={0}
                      sx={{
                        maxWidth: '70%',
                        bgcolor: '#f0f0f0',
                        p: 1.5,
                        borderRadius: 1.5,
                        mb: 1
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {message.attachment.name}
                      </Typography>
                    </Paper>
                  )}
                  
                  <Paper
                    elevation={0}
                    sx={{
                      maxWidth: '70%',
                      bgcolor: message.type === 'sent' ? THEME.sentBubble : THEME.receivedBubble,
                      p: 2,
                      borderRadius: 1.5,
                      position: 'relative'
                    }}
                  >
                    <Typography variant="body1" color={THEME.text}>
                      {message.content}
                    </Typography>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'flex-end', 
                      alignItems: 'center',
                      mt: 1
                    }}>
                      <Typography 
                        variant="caption" 
                        color={THEME.textSecondary}
                        sx={{ pr: 0.5 }}
                      >
                        {formatTime(message.timestamp)}
                      </Typography>
                      {message.type === 'sent' && (
                        <CheckCircleIcon sx={{ fontSize: 14, color: THEME.success, ml: 0.5 }} />
                      )}
                    </Box>
                  </Paper>
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </Box>

            {/* Message Input Area */}
            <Box sx={{ 
              p: 2, 
              bgcolor: 'white',
              borderTop: `1px solid ${THEME.lightGray}`,
              display: 'flex',
              alignItems: 'center'
            }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                inputRef={messageInputRef}
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                  }
                }}
              />
              
              <IconButton 
                color="primary"
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                sx={{ ml: 1 }}
              >
                <SendRoundedIcon />
              </IconButton>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default CommunicationPage;