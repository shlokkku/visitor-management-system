import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  IconButton, 
  InputAdornment,
  Paper,
  Chip,
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Badge,
  Tabs,
  Tab,
  Divider,
  CircularProgress,
  Tooltip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import SortIcon from '@mui/icons-material/Sort';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import CommentIcon from '@mui/icons-material/Comment';
import AttachmentIcon from '@mui/icons-material/Attachment';

// Theme Colors - matching your existing theme
const THEME = {
  primary: "#1a73e8",
  secondary: "#f5f5f5",
  text: "#212121",
  textSecondary: "#5f6368",
  lightGray: "#e0e0e0",
  success: "#34a853",
  warning: "#fbbc04",
  error: "#ea4335",
  lightBg: "#f8f9fa",
  backgroundGray: "#f7f9fc",
};

// Status colors
const STATUS_COLORS = {
  open: THEME.error,
  inProgress: THEME.warning,
  resolved: THEME.success,
};

// Mock Data for Complaints/Tickets
const MOCK_COMPLAINTS = [
  {
    id: 'ticket001',
    title: 'Water leakage in bathroom',
    description: 'There is continuous water leakage from the bathroom ceiling. It seems to be coming from the apartment above.',
    category: 'Plumbing',
    status: 'open',
    priority: 'high',
    createdAt: new Date('2024-04-26T10:30:00'),
    updatedAt: new Date('2024-04-26T11:45:00'),
    resident: {
      name: 'A Wing 304',
      avatar: 'A',
      contact: '9876543210'
    },
    assignedTo: null,
    comments: [
      {
        id: 'c1',
        text: 'Plumber has been notified and will visit today.',
        timestamp: new Date('2024-04-26T11:45:00'),
        author: 'Admin',
        isAdmin: true
      }
    ],
    attachments: [
      {
        id: 'a1',
        name: 'leakage_photo.jpg',
        type: 'image',
        url: '#'
      }
    ]
  },
  {
    id: 'ticket002',
    title: 'Broken street light near B wing',
    description: 'The street light near the B wing entrance has been flickering for 3 days and now has stopped working completely.',
    category: 'Electrical',
    status: 'inProgress',
    priority: 'medium',
    createdAt: new Date('2024-04-25T15:20:00'),
    updatedAt: new Date('2024-04-26T09:15:00'),
    resident: {
      name: 'B Wing 203',
      avatar: 'B',
      contact: '9876543211'
    },
    assignedTo: 'Electrician',
    comments: [
      {
        id: 'c2',
        text: 'Electrician has been assigned and will check it by today evening.',
        timestamp: new Date('2024-04-26T09:15:00'),
        author: 'Admin',
        isAdmin: true
      }
    ],
    attachments: []
  },
  {
    id: 'ticket003',
    title: 'Garbage not collected for 2 days',
    description: 'The garbage from C wing has not been collected for the past 2 days. It\'s causing bad odor in the area.',
    category: 'Sanitation',
    status: 'resolved',
    priority: 'high',
    createdAt: new Date('2024-04-24T08:40:00'),
    updatedAt: new Date('2024-04-25T10:20:00'),
    resident: {
      name: 'C Wing 102',
      avatar: 'C',
      contact: '9876543212'
    },
    assignedTo: 'Sanitation Team',
    comments: [
      {
        id: 'c3',
        text: 'Issue reported to the sanitation team.',
        timestamp: new Date('2024-04-24T09:30:00'),
        author: 'Admin',
        isAdmin: true
      },
      {
        id: 'c4',
        text: 'The garbage has been collected and area cleaned. Extra cleaning done to remove the odor.',
        timestamp: new Date('2024-04-25T10:20:00'),
        author: 'Admin',
        isAdmin: true
      }
    ],
    attachments: [
      {
        id: 'a2',
        name: 'garbage_area.jpg',
        type: 'image',
        url: '#'
      }
    ]
  },
  {
    id: 'ticket004',
    title: 'Issue with parking allocation',
    description: 'Someone else keeps parking in my assigned spot #A45. This has been happening for the past week.',
    category: 'Parking',
    status: 'open',
    priority: 'medium',
    createdAt: new Date('2024-04-25T14:40:00'),
    updatedAt: new Date('2024-04-25T14:40:00'),
    resident: {
      name: 'C Wing 501',
      avatar: 'C',
      contact: '9876543213'
    },
    assignedTo: null,
    comments: [],
    attachments: [
      {
        id: 'a3',
        name: 'car_in_spot.jpg',
        type: 'image',
        url: '#'
      }
    ]
  },
  {
    id: 'ticket005',
    title: 'Lift not working in D wing',
    description: 'The lift in D wing is not functioning since morning. Many elderly residents are having difficulty.',
    category: 'Maintenance',
    status: 'inProgress',
    priority: 'high',
    createdAt: new Date('2024-04-27T07:15:00'),
    updatedAt: new Date('2024-04-27T08:30:00'),
    resident: {
      name: 'D Wing 402',
      avatar: 'D',
      contact: '9876543214'
    },
    assignedTo: 'Elevator Technician',
    comments: [
      {
        id: 'c5',
        text: 'Elevator maintenance company has been contacted and technician is on the way.',
        timestamp: new Date('2024-04-27T08:30:00'),
        author: 'Admin',
        isAdmin: true
      }
    ],
    attachments: []
  },
  {
    id: 'ticket006',
    title: 'Playground equipment damaged',
    description: 'The swing in the children\'s playground is broken and poses a safety risk.',
    category: 'Common Facilities',
    status: 'open',
    priority: 'high',
    createdAt: new Date('2024-04-26T16:50:00'),
    updatedAt: new Date('2024-04-26T16:50:00'),
    resident: {
      name: 'A Wing 201',
      avatar: 'A',
      contact: '9876543215'
    },
    assignedTo: null,
    comments: [],
    attachments: [
      {
        id: 'a4',
        name: 'broken_swing.jpg',
        type: 'image',
        url: '#'
      }
    ]
  },
  {
    id: 'ticket007',
    title: 'Noise complaint',
    description: 'Excessive noise from B Wing 302 regularly after 11 PM. This has been happening for the past week.',
    category: 'Neighborhood Issues',
    status: 'inProgress',
    priority: 'medium',
    createdAt: new Date('2024-04-25T10:20:00'),
    updatedAt: new Date('2024-04-26T12:15:00'),
    resident: {
      name: 'B Wing 301',
      avatar: 'B',
      contact: '9876543216'
    },
    assignedTo: 'Security',
    comments: [
      {
        id: 'c6',
        text: 'Notice has been sent to B Wing 302. Security will monitor the situation.',
        timestamp: new Date('2024-04-26T12:15:00'),
        author: 'Admin',
        isAdmin: true
      }
    ],
    attachments: []
  },
  {
    id: 'ticket008',
    title: 'Water pump not working',
    description: 'The water pump seems to be malfunctioning. Water pressure is very low in all C wing apartments.',
    category: 'Plumbing',
    status: 'resolved',
    priority: 'high',
    createdAt: new Date('2024-04-23T11:30:00'),
    updatedAt: new Date('2024-04-24T14:45:00'),
    resident: {
      name: 'C Wing 204',
      avatar: 'C',
      contact: '9876543217'
    },
    assignedTo: 'Maintenance Team',
    comments: [
      {
        id: 'c7',
        text: 'Maintenance team has been notified and will check the pump.',
        timestamp: new Date('2024-04-23T12:00:00'),
        author: 'Admin',
        isAdmin: true
      },
      {
        id: 'c8',
        text: 'The pump has been repaired and water supply is now normal.',
        timestamp: new Date('2024-04-24T14:45:00'),
        author: 'Admin',
        isAdmin: true
      }
    ],
    attachments: []
  }
];

// Utility Functions
const formatDate = (date) => {
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Today ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffDays === 1) {
    return 'Yesterday ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
};

const getPriorityIcon = (priority) => {
  switch (priority) {
    case 'high':
      return <PriorityHighIcon sx={{ color: THEME.error, fontSize: 18 }} />;
    case 'medium':
      return <PriorityHighIcon sx={{ color: THEME.warning, fontSize: 18 }} />;
    case 'low':
      return <PriorityHighIcon sx={{ color: THEME.success, fontSize: 18 }} />;
    default:
      return null;
  }
};

const getStatusChip = (status) => {
  let label, color;
  
  switch (status) {
    case 'open':
      label = 'Open';
      color = STATUS_COLORS.open;
      break;
    case 'inProgress':
      label = 'In Progress';
      color = STATUS_COLORS.inProgress;
      break;
    case 'resolved':
      label = 'Resolved';
      color = STATUS_COLORS.resolved;
      break;
    default:
      label = status;
      color = THEME.textSecondary;
  }
  
  return (
    <Chip 
      label={label} 
      size="small" 
      sx={{ 
        backgroundColor: color + '20', 
        color: color,
        fontWeight: 500,
        borderRadius: 1,
        '& .MuiChip-label': {
          px: 1
        }
      }}
    />
  );
};

const ComplaintsPage = () => {
  // State
  const [complaints, setComplaints] = useState(MOCK_COMPLAINTS);
  const [filteredComplaints, setFilteredComplaints] = useState(MOCK_COMPLAINTS);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTab, setCurrentTab] = useState(0);
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  
  // Filter and Sort Options
  const tabFilters = ['All', 'Open', 'In Progress', 'Resolved'];
  const statusMap = {
    0: 'all',
    1: 'open',
    2: 'inProgress',
    3: 'resolved'
  };
  
  const sortOptions = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Oldest First', value: 'oldest' },
    { label: 'Priority: High to Low', value: 'priority-desc' },
    { label: 'Priority: Low to High', value: 'priority-asc' }
  ];
  
  const categoryOptions = [
    'All Categories',
    'Plumbing',
    'Electrical',
    'Sanitation',
    'Parking',
    'Maintenance',
    'Common Facilities',
    'Neighborhood Issues'
  ];
  
  const [selectedSort, setSelectedSort] = useState(sortOptions[0].value);
  const [selectedCategory, setSelectedCategory] = useState(categoryOptions[0]);
  
  // Apply filters and search
  useEffect(() => {
    let result = [...MOCK_COMPLAINTS];
    
    // Apply status filter
    if (statusMap[currentTab] !== 'all') {
      result = result.filter(complaint => complaint.status === statusMap[currentTab]);
    }
    
    // Apply category filter
    if (selectedCategory !== 'All Categories') {
      result = result.filter(complaint => complaint.category === selectedCategory);
    }
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(complaint => 
        complaint.title.toLowerCase().includes(query) ||
        complaint.description.toLowerCase().includes(query) ||
        complaint.resident.name.toLowerCase().includes(query) ||
        complaint.category.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      switch (selectedSort) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'priority-desc':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'priority-asc':
          const priorityOrderAsc = { high: 3, medium: 2, low: 1 };
          return priorityOrderAsc[a.priority] - priorityOrderAsc[b.priority];
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
    
    setFilteredComplaints(result);
  }, [searchQuery, currentTab, selectedSort, selectedCategory]);
  
  // Handlers
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };
  
  const handleSortClick = (event) => {
    setSortAnchorEl(event.currentTarget);
  };
  
  const handleSortClose = () => {
    setSortAnchorEl(null);
  };
  
  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };
  
  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };
  
  const handleSortSelect = (value) => {
    setSelectedSort(value);
    handleSortClose();
  };
  
  const handleCategorySelect = (value) => {
    setSelectedCategory(value);
    handleFilterClose();
  };
  
  const handleComplaintClick = (complaint) => {
    setSelectedComplaint(complaint);
    setDetailDialogOpen(true);
  };
  
  const handleCloseDetailDialog = () => {
    setDetailDialogOpen(false);
  };
  
  const handleStatusChange = (complaintId, newStatus) => {
    // Update in both arrays
    const updatedComplaints = complaints.map(complaint => 
      complaint.id === complaintId 
        ? { ...complaint, status: newStatus, updatedAt: new Date() } 
        : complaint
    );
    
    setComplaints(updatedComplaints);
    
    // Also update selected complaint if open in detail view
    if (selectedComplaint && selectedComplaint.id === complaintId) {
      setSelectedComplaint({ ...selectedComplaint, status: newStatus, updatedAt: new Date() });
    }
    
    handleCloseDetailDialog();
  };
  
  const handleAddComment = () => {
    if (!commentText.trim() || !selectedComplaint) return;
    
    const newComment = {
      id: `c${Date.now()}`,
      text: commentText,
      timestamp: new Date(),
      author: 'Admin',
      isAdmin: true
    };
    
    // Update in both arrays
    const updatedComplaints = complaints.map(complaint => 
      complaint.id === selectedComplaint.id 
        ? { 
            ...complaint, 
            comments: [...complaint.comments, newComment],
            updatedAt: new Date()
          } 
        : complaint
    );
    
    setComplaints(updatedComplaints);
    setSelectedComplaint({
      ...selectedComplaint,
      comments: [...selectedComplaint.comments, newComment],
      updatedAt: new Date()
    });
    
    setCommentText('');
  };
  
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      height: '100vh',
      bgcolor: THEME.backgroundGray,
      overflow: 'hidden'
    }}>
      {/* Header */}
      <Box sx={{ 
        p: 3,
        bgcolor: 'white',
        borderBottom: `1px solid ${THEME.lightGray}`,
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" fontWeight={500} color={THEME.text}>
            Complaints Management
          </Typography>
          
          <Box>
            <Button 
              variant="contained" 
              color="primary"
              startIcon={<FilterListIcon />}
              onClick={handleFilterClick}
              sx={{ mr: 1 }}
            >
              Filter
            </Button>
            
            <Button 
              variant="outlined"
              startIcon={<SortIcon />}
              onClick={handleSortClick}
            >
              Sort
            </Button>
            
            {/* Sort Menu */}
            <Menu
              anchorEl={sortAnchorEl}
              open={Boolean(sortAnchorEl)}
              onClose={handleSortClose}
            >
              {sortOptions.map((option) => (
                <MenuItem 
                  key={option.value}
                  selected={selectedSort === option.value}
                  onClick={() => handleSortSelect(option.value)}
                >
                  {option.label}
                </MenuItem>
              ))}
            </Menu>
            
            {/* Filter Menu */}
            <Menu
              anchorEl={filterAnchorEl}
              open={Boolean(filterAnchorEl)}
              onClose={handleFilterClose}
            >
              {categoryOptions.map((category) => (
                <MenuItem 
                  key={category}
                  selected={selectedCategory === category}
                  onClick={() => handleCategorySelect(category)}
                >
                  {category}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Box>
        
        {/* Search Bar and Tabs */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            variant="outlined"
            placeholder="Search complaints..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              )
            }}
            sx={{
              width: 350,
              mr: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 1
              }
            }}
          />
          
          <Tabs 
            value={currentTab} 
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
                minWidth: 100
              }
            }}
          >
            {tabFilters.map((filter, index) => (
              <Tab 
                key={index} 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {filter}
                    <Chip 
                      label={complaints.filter(c => 
                        filter === 'All' ? true : c.status === statusMap[index]
                      ).length} 
                      size="small"
                      sx={{ 
                        ml: 1, 
                        height: 20, 
                        backgroundColor: THEME.lightGray
                      }}
                    />
                  </Box>
                } 
              />
            ))}
          </Tabs>
        </Box>
      </Box>
      
      {/* Main Content */}
      <Box sx={{ 
        flexGrow: 1,
        overflow: 'auto',
        p: 3
      }}>
        {filteredComplaints.length === 0 ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%',
            flexDirection: 'column'
          }}>
            <Typography variant="h6" color={THEME.textSecondary} sx={{ mb: 2 }}>
              No complaints found
            </Typography>
            <Typography color={THEME.textSecondary}>
              Try adjusting your search or filter criteria
            </Typography>
          </Box>
        ) : (
          filteredComplaints.map((complaint) => (
            <Paper 
              key={complaint.id}
              elevation={0}
              sx={{
                p: 3,
                mb: 2,
                borderRadius: 2,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                },
                cursor: 'pointer'
              }}
              onClick={() => handleComplaintClick(complaint)}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="subtitle1" fontWeight={500}>
                    {complaint.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                    {getPriorityIcon(complaint.priority)}
                    <Typography variant="caption" color={THEME.textSecondary} sx={{ ml: 0.5 }}>
                      {complaint.priority.charAt(0).toUpperCase() + complaint.priority.slice(1)}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {getStatusChip(complaint.status)}
                  
                  <Tooltip title="Mark as resolved">
                    <IconButton 
                      size="small" 
                      sx={{ ml: 1 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusChange(complaint.id, 'resolved');
                      }}
                      disabled={complaint.status === 'resolved'}
                    >
                      <DoneIcon sx={{ color: complaint.status === 'resolved' ? THEME.success : THEME.textSecondary }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', mb: 2 }}>
                <Box sx={{ position: 'relative', mr: 2 }}>
                  <Avatar 
                    sx={{ 
                      width: 40, 
                      height: 40, 
                      bgcolor: THEME.primary,
                      fontWeight: 'bold'
                    }}
                  >
                    {complaint.resident.avatar}
                  </Avatar>
                </Box>
                
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {complaint.resident.name}
                  </Typography>
                  <Typography variant="caption" color={THEME.textSecondary}>
                    {complaint.category} • {formatDate(complaint.createdAt)}
                  </Typography>
                </Box>
              </Box>
              
              <Typography variant="body2" color={THEME.text} sx={{ mb: 2 }}>
                {complaint.description.length > 150 
                  ? `${complaint.description.substring(0, 150)}...` 
                  : complaint.description}
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {complaint.assignedTo && (
                    <Chip 
                      label={`Assigned to: ${complaint.assignedTo}`}
                      size="small"
                      sx={{ mr: 2, backgroundColor: THEME.lightBg }}
                    />
                  )}
                  
                  {complaint.comments.length > 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                      <CommentIcon sx={{ fontSize: 18, color: THEME.textSecondary, mr: 0.5 }} />
                      <Typography variant="caption" color={THEME.textSecondary}>
                        {complaint.comments.length}
                      </Typography>
                    </Box>
                  )}
                  
                  {complaint.attachments.length > 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AttachmentIcon sx={{ fontSize: 18, color: THEME.textSecondary, mr: 0.5 }} />
                      <Typography variant="caption" color={THEME.textSecondary}>
                        {complaint.attachments.length}
                      </Typography>
                    </Box>
                  )}
                </Box>
                
                <Typography variant="caption" color={THEME.textSecondary}>
                  {complaint.updatedAt > complaint.createdAt && 
                    `Updated: ${formatDate(complaint.updatedAt)}`}
                </Typography>
              </Box>
            </Paper>
          ))
        )}
      </Box>
      
      {/* Detail Dialog */}
      {selectedComplaint && (
        <Dialog
          open={detailDialogOpen}
          onClose={handleCloseDetailDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            borderBottom: `1px solid ${THEME.lightGray}`,
            pb: 2
          }}>
            <Box>
              <Typography variant="h6">
                {selectedComplaint.title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                <Typography variant="caption" color={THEME.textSecondary}>
                  ID: {selectedComplaint.id}
                </Typography>
                <Typography variant="caption" color={THEME.textSecondary} sx={{ mx: 1 }}>
                  •
                </Typography>
                <Typography variant="caption" color={THEME.textSecondary}>
                  Created: {formatDate(selectedComplaint.createdAt)}
                </Typography>
              </Box>
            </Box>
            
            <IconButton onClick={handleCloseDetailDialog}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          
          <DialogContent sx={{ px: 3, py: 2 }}>
            <Box sx={{ display: 'flex', mb: 3 }}>
              <Box sx={{ flex: 3, pr: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ position: 'relative', mr: 2 }}>
                    <Avatar 
                      sx={{ 
                        width: 40, 
                        height: 40, 
                        bgcolor: THEME.primary,
                        fontWeight: 'bold'
                      }}
                    >
                      {selectedComplaint.resident.avatar}
                    </Avatar>
                  </Box>
                  
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {selectedComplaint.resident.name}
                    </Typography>
                    <Typography variant="caption" color={THEME.textSecondary}>
                      {selectedComplaint.resident.contact}
                    </Typography>
                  </Box>
                </Box>
                
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {selectedComplaint.description}
                </Typography>
                
                {selectedComplaint.attachments.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}></Typography>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Attachments
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                      {selectedComplaint.attachments.map(attachment => (
                        <Paper
                          key={attachment.id}
                          elevation={0}
                          sx={{
                            p: 1,
                            mr: 1,
                            mb: 1,
                            display: 'flex',
                            alignItems: 'center',
                            bgcolor: THEME.lightBg,
                            borderRadius: 1
                          }}
                        >
                          <AttachmentIcon sx={{ fontSize: 18, mr: 1, color: THEME.textSecondary }} />
                          <Typography variant="caption">
                            {attachment.name}
                          </Typography>
                        </Paper>
                      ))}
                    </Box>
                  </Box>
                )}
                
                <Divider sx={{ mb: 3 }} />
                
                <Typography variant="subtitle2" sx={{ mb: 2 }}>
                  Comments & Activity
                </Typography>
                
                {selectedComplaint.comments.length === 0 ? (
                  <Typography variant="body2" color={THEME.textSecondary} sx={{ mb: 2 }}>
                    No comments yet
                  </Typography>
                ) : (
                  <Box sx={{ mb: 3 }}>
                    {selectedComplaint.comments.map(comment => (
                      <Box 
                        key={comment.id} 
                        sx={{ 
                          mb: 2,
                          p: 2,
                          bgcolor: comment.isAdmin ? THEME.sentBubble : 'white',
                          borderRadius: 2,
                          border: comment.isAdmin ? 'none' : `1px solid ${THEME.lightGray}`
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="caption" fontWeight={500}>
                            {comment.author}
                          </Typography>
                          <Typography variant="caption" color={THEME.textSecondary}>
                            {formatDate(comment.timestamp)}
                          </Typography>
                        </Box>
                        <Typography variant="body2">
                          {comment.text}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
                
                <Box sx={{ mb: 2 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2
                      }
                    }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                    <Button 
                      variant="contained" 
                      color="primary"
                      disabled={!commentText.trim()}
                      onClick={handleAddComment}
                    >
                      Comment
                    </Button>
                  </Box>
                </Box>
              </Box>
              
              <Box sx={{ flex: 1, ml: 2 }}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 2, 
                    mb: 3, 
                    bgcolor: THEME.lightBg,
                    borderRadius: 2
                  }}
                >
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>
                    Ticket Details
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color={THEME.textSecondary}>
                      Status
                    </Typography>
                    <Box sx={{ mt: 0.5 }}>
                      {getStatusChip(selectedComplaint.status)}
                    </Box>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color={THEME.textSecondary}>
                      Priority
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      {getPriorityIcon(selectedComplaint.priority)}
                      <Typography variant="body2" sx={{ ml: 0.5 }}>
                        {selectedComplaint.priority.charAt(0).toUpperCase() + selectedComplaint.priority.slice(1)}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color={THEME.textSecondary}>
                      Category
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {selectedComplaint.category}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color={THEME.textSecondary}>
                      Assigned To
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {selectedComplaint.assignedTo || 'Not assigned'}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="caption" color={THEME.textSecondary}>
                      Last Updated
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {formatDate(selectedComplaint.updatedAt)}
                    </Typography>
                  </Box>
                </Paper>
                
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Actions
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Button 
                    variant="outlined"
                    color="primary"
                    startIcon={<AccessTimeIcon />}
                    sx={{ mb: 1, justifyContent: 'flex-start' }}
                    onClick={() => handleStatusChange(selectedComplaint.id, 'inProgress')}
                    disabled={selectedComplaint.status === 'inProgress' || selectedComplaint.status === 'resolved'}
                  >
                    Mark In Progress
                  </Button>
                  
                  <Button 
                    variant="outlined"
                    color="success"
                    startIcon={<CheckCircleIcon />}
                    sx={{ mb: 1, justifyContent: 'flex-start' }}
                    onClick={() => handleStatusChange(selectedComplaint.id, 'resolved')}
                    disabled={selectedComplaint.status === 'resolved'}
                  >
                    Resolve Ticket
                  </Button>
                  
                  <Button 
                    variant="outlined"
                    color="error"
                    startIcon={<CloseIcon />}
                    sx={{ justifyContent: 'flex-start' }}
                    onClick={handleCloseDetailDialog}
                  >
                    Close
                  </Button>
                </Box>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Stats Footer */}
      <Box sx={{
        p: 2,
        bgcolor: 'white',
        borderTop: `1px solid ${THEME.lightGray}`,
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex' }}>
          <Box sx={{ mr: 3, display: 'flex', alignItems: 'center' }}>
            <PriorityHighIcon sx={{ color: THEME.error, fontSize: 18, mr: 1 }} />
            <Typography variant="body2">
              <strong>{complaints.filter(c => c.priority === 'high' && c.status !== 'resolved').length}</strong> High Priority
            </Typography>
          </Box>
          
          <Box sx={{ mr: 3, display: 'flex', alignItems: 'center' }}>
            <CircularProgress 
              variant="determinate" 
              value={Math.round((complaints.filter(c => c.status === 'resolved').length / complaints.length) * 100)} 
              size={16} 
              thickness={5}
              sx={{ mr: 1, color: THEME.success }}
            />
            <Typography variant="body2">
              <strong>{Math.round((complaints.filter(c => c.status === 'resolved').length / complaints.length) * 100)}%</strong> Resolved
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AccessTimeIcon sx={{ color: THEME.warning, fontSize: 18, mr: 1 }} />
            <Typography variant="body2">
              <strong>{complaints.filter(c => c.status === 'inProgress').length}</strong> In Progress
            </Typography>
          </Box>
        </Box>
        
        <Typography variant="body2" color={THEME.textSecondary}>
          Total: {complaints.length} complaints
        </Typography>
      </Box>
    </Box>
  );
};

export default ComplaintsPage;