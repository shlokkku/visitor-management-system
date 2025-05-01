import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, IconButton, InputAdornment, Paper, Chip, Button, Menu, MenuItem,
  Dialog, DialogTitle, DialogContent, Avatar, Tabs, Tab, Divider, CircularProgress, Tooltip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import CommentIcon from '@mui/icons-material/Comment';
import AttachmentIcon from '@mui/icons-material/Attachment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { api } from '../services/authService'; // <--- use your axios instance

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

const STATUS_COLORS = {
  open: THEME.error,
  inProgress: THEME.warning,
  resolved: THEME.success,
};
const STATUS_LABELS = { open: 'Open', inProgress: 'In Progress', resolved: 'Resolved' };
const PRIORITY_LABELS = { high: 'High', medium: 'Medium', low: 'Low' };

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (diffDays === 1) return 'Yesterday ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}
function getPriorityIcon(priority) {
  switch (priority) {
    case 'high': return <PriorityHighIcon sx={{ color: THEME.error, fontSize: 18 }} />;
    case 'medium': return <PriorityHighIcon sx={{ color: THEME.warning, fontSize: 18 }} />;
    case 'low': return <PriorityHighIcon sx={{ color: THEME.success, fontSize: 18 }} />;
    default: return null;
  }
}
function getStatusChip(status) {
  const label = STATUS_LABELS[status] || status;
  const color = STATUS_COLORS[status] || THEME.textSecondary;
  return (
    <Chip
      label={label}
      size="small"
      sx={{
        backgroundColor: color + '20',
        color: color,
        fontWeight: 500,
        borderRadius: 1,
        '& .MuiChip-label': { px: 1 }
      }}
    />
  );
}

const ComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTab, setCurrentTab] = useState(0);
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const tabFilters = ['All', 'Open', 'In Progress', 'Resolved'];
  const statusMap = { 0: 'all', 1: 'open', 2: 'inProgress', 3: 'resolved' };
  const sortOptions = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Oldest First', value: 'oldest' },
    { label: 'Priority: High to Low', value: 'priority-desc' },
    { label: 'Priority: Low to High', value: 'priority-asc' }
  ];
  const [selectedSort, setSelectedSort] = useState(sortOptions[0].value);
  const [categories, setCategories] = useState(['All Categories']);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  // Fetch all complaints for admin
  useEffect(() => {
    setLoading(true);
    api.get('/api/complaints')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : [];
        setComplaints(data);
        setFilteredComplaints(data);
        const cats = ['All Categories', ...Array.from(new Set(data.map(c => c.category)))];
        setCategories(cats);
        setLoading(false);
      })
      .catch(() => {
        setComplaints([]);
        setFilteredComplaints([]);
        setLoading(false);
      });
  }, []);

  // Filtering, searching, sorting
  useEffect(() => {
    let result = [...complaints];
    if (statusMap[currentTab] !== 'all') {
      result = result.filter(complaint => complaint.status === statusMap[currentTab]);
    }
    if (selectedCategory !== 'All Categories') {
      result = result.filter(complaint => complaint.category === selectedCategory);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(complaint =>
        (complaint.title || '').toLowerCase().includes(query) ||
        (complaint.description || '').toLowerCase().includes(query) ||
        (complaint.residentName || '').toLowerCase().includes(query) ||
        (complaint.category || '').toLowerCase().includes(query)
      );
    }
    result.sort((a, b) => {
      switch (selectedSort) {
        case 'newest': return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest': return new Date(a.createdAt) - new Date(b.createdAt);
        case 'priority-desc':
          return ({ high: 3, medium: 2, low: 1 }[b.priority] - { high: 3, medium: 2, low: 1 }[a.priority]);
        case 'priority-asc':
          return ({ high: 3, medium: 2, low: 1 }[a.priority] - { high: 3, medium: 2, low: 1 }[b.priority]);
        default: return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
    setFilteredComplaints(result);
  }, [searchQuery, currentTab, selectedSort, selectedCategory, complaints]);

  // UI Handlers
  const handleSearchChange = (event) => setSearchQuery(event.target.value);
  const handleTabChange = (event, newValue) => setCurrentTab(newValue);
  const handleSortClick = (event) => setSortAnchorEl(event.currentTarget);
  const handleSortClose = () => setSortAnchorEl(null);
  const handleFilterClick = (event) => setFilterAnchorEl(event.currentTarget);
  const handleFilterClose = () => setFilterAnchorEl(null);
  const handleSortSelect = (value) => { setSelectedSort(value); handleSortClose(); };
  const handleCategorySelect = (value) => { setSelectedCategory(value); handleFilterClose(); };
  const handleComplaintClick = (complaint) => { fetchComplaintDetails(complaint._id); };
  const handleCloseDetailDialog = () => setDetailDialogOpen(false);

  // Fetch single complaint details (with comments, attachments)
  function fetchComplaintDetails(id) {
    api.get(`/api/complaints/${id}`)
      .then(res => {
        setSelectedComplaint(res.data);
        setDetailDialogOpen(true);
      });
  }

  // Update status (admin endpoint)
  function handleStatusChange(complaintId, newStatus) {
    api.put(`/api/complaints/${complaintId}/status`, { status: newStatus })
      .then(res => {
        const updated = res.data;
        setComplaints(complaints => complaints.map(c => c._id === complaintId ? updated : c));
        setSelectedComplaint(updated);
        setDetailDialogOpen(false);
      });
  }

  // Add comment (admin endpoint)
  function handleAddComment() {
    if (!commentText.trim() || !selectedComplaint) return;
    api.post(`/api/complaints/${selectedComplaint._id}/comment`, { text: commentText })
      .then(res => {
        const comment = res.data;
        setSelectedComplaint(complaint => ({
          ...complaint,
          comments: [...(complaint.comments || []), comment],
          updatedAt: new Date().toISOString()
        }));
        setComplaints(complaints => complaints.map(c => c._id === selectedComplaint._id
          ? { ...c, comments: [...(c.comments || []), comment], updatedAt: new Date().toISOString() }
          : c
        ));
        setCommentText('');
      });
  }

  // Map backend fields to frontend display
  function getResidentAvatar(complaint) {
    if (complaint.residentName) return complaint.residentName[0];
    if (complaint.wing) return complaint.wing[0];
    return '?';
  }
  function getResidentDisplay(complaint) {
    if (complaint.residentName && complaint.flat_number)
      return `${complaint.residentName} (${complaint.wing} Wing ${complaint.flat_number})`;
    if (complaint.residentName) return complaint.residentName;
    return '';
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: THEME.backgroundGray, overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ p: 3, bgcolor: 'white', borderBottom: `1px solid ${THEME.lightGray}` }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" fontWeight={500} color={THEME.text}>Complaints Management</Typography>
          <Box>
            <Button variant="contained" color="primary" startIcon={<FilterListIcon />} onClick={handleFilterClick} sx={{ mr: 1 }}>
              Filter
            </Button>
            <Button variant="outlined" startIcon={<SortIcon />} onClick={handleSortClick}>Sort</Button>
            <Menu anchorEl={sortAnchorEl} open={Boolean(sortAnchorEl)} onClose={handleSortClose}>
              {sortOptions.map((option) => (
                <MenuItem key={option.value} selected={selectedSort === option.value} onClick={() => handleSortSelect(option.value)}>
                  {option.label}
                </MenuItem>
              ))}
            </Menu>
            <Menu anchorEl={filterAnchorEl} open={Boolean(filterAnchorEl)} onClose={handleFilterClose}>
              {categories.map((category) => (
                <MenuItem key={category} selected={selectedCategory === category} onClick={() => handleCategorySelect(category)}>
                  {category}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Box>
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
            sx={{ width: 350, mr: 3, '& .MuiOutlinedInput-root': { borderRadius: 1 } }}
          />
          <Tabs value={currentTab} onChange={handleTabChange}
            sx={{ '& .MuiTab-root': { textTransform: 'none', fontWeight: 500, minWidth: 100 } }}>
            {tabFilters.map((filter, index) => (
              <Tab key={index} label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {filter}
                  <Chip
                    label={complaints.filter(c => filter === 'All' ? true : c.status === statusMap[index]).length}
                    size="small"
                    sx={{ ml: 1, height: 20, backgroundColor: THEME.lightGray }}
                  />
                </Box>
              } />
            ))}
          </Tabs>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, overflow: 'auto', p: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : filteredComplaints.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', flexDirection: 'column' }}>
            <Typography variant="h6" color={THEME.textSecondary} sx={{ mb: 2 }}>No complaints found</Typography>
            <Typography color={THEME.textSecondary}>Try adjusting your search or filter criteria</Typography>
          </Box>
        ) : (
          filteredComplaints.map((complaint) => (
            <Paper key={complaint._id} elevation={0}
              sx={{
                p: 3, mb: 2, borderRadius: 2, transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' },
                cursor: 'pointer'
              }}
              onClick={() => handleComplaintClick(complaint)}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="subtitle1" fontWeight={500}>{complaint.title}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                    {getPriorityIcon(complaint.priority)}
                    <Typography variant="caption" color={THEME.textSecondary} sx={{ ml: 0.5 }}>
                      {PRIORITY_LABELS[complaint.priority] || complaint.priority}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {getStatusChip(complaint.status)}
                  <Tooltip title="Mark as resolved">
                    <IconButton
                      size="small"
                      sx={{ ml: 1 }}
                      onClick={e => { e.stopPropagation(); handleStatusChange(complaint._id, 'resolved'); }}
                      disabled={complaint.status === 'resolved'}
                    >
                      <DoneIcon sx={{ color: complaint.status === 'resolved' ? THEME.success : THEME.textSecondary }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', mb: 2 }}>
                <Box sx={{ position: 'relative', mr: 2 }}>
                  <Avatar sx={{ width: 40, height: 40, bgcolor: THEME.primary, fontWeight: 'bold' }}>
                    {getResidentAvatar(complaint)}
                  </Avatar>
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{getResidentDisplay(complaint)}</Typography>
                  <Typography variant="caption" color={THEME.textSecondary}>
                    {complaint.category} • {formatDate(complaint.createdAt)}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color={THEME.text} sx={{ mb: 2 }}>
                {complaint.description && complaint.description.length > 150
                  ? `${complaint.description.substring(0, 150)}...`
                  : complaint.description}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {(complaint.assignedToName || complaint.assignedToUserId) && (
                    <Chip
                      label={`Assigned to: ${complaint.assignedToName || complaint.assignedToUserId}`}
                      size="small"
                      sx={{ mr: 2, backgroundColor: THEME.lightBg }}
                    />
                  )}
                  {complaint.comments && complaint.comments.length > 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                      <CommentIcon sx={{ fontSize: 18, color: THEME.textSecondary, mr: 0.5 }} />
                      <Typography variant="caption" color={THEME.textSecondary}>
                        {complaint.comments.length}
                      </Typography>
                    </Box>
                  )}
                  {complaint.attachments && complaint.attachments.length > 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AttachmentIcon sx={{ fontSize: 18, color: THEME.textSecondary, mr: 0.5 }} />
                      <Typography variant="caption" color={THEME.textSecondary}>
                        {complaint.attachments.length}
                      </Typography>
                    </Box>
                  )}
                </Box>
                <Typography variant="caption" color={THEME.textSecondary}>
                  {complaint.updatedAt > complaint.createdAt && `Updated: ${formatDate(complaint.updatedAt)}`}
                </Typography>
              </Box>
            </Paper>
          ))
        )}
      </Box>

      {/* Detail Dialog */}
      {selectedComplaint && (
        <Dialog open={detailDialogOpen} onClose={handleCloseDetailDialog} maxWidth="md" fullWidth>
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${THEME.lightGray}`, pb: 2 }}>
            <Box>
              <Typography variant="h6">{selectedComplaint.title}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                <Typography variant="caption" color={THEME.textSecondary}>ID: {selectedComplaint._id}</Typography>
                <Typography variant="caption" color={THEME.textSecondary} sx={{ mx: 1 }}>•</Typography>
                <Typography variant="caption" color={THEME.textSecondary}>Created: {formatDate(selectedComplaint.createdAt)}</Typography>
              </Box>
            </Box>
            <IconButton onClick={handleCloseDetailDialog}><CloseIcon /></IconButton>
          </DialogTitle>
          <DialogContent sx={{ px: 3, py: 2 }}>
            <Box sx={{ display: 'flex', mb: 3 }}>
              <Box sx={{ flex: 3, pr: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ position: 'relative', mr: 2 }}>
                    <Avatar sx={{ width: 40, height: 40, bgcolor: THEME.primary, fontWeight: 'bold' }}>
                      {getResidentAvatar(selectedComplaint)}
                    </Avatar>
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {getResidentDisplay(selectedComplaint)}
                    </Typography>
                    <Typography variant="caption" color={THEME.textSecondary}>
                      {selectedComplaint.residentRole && `${selectedComplaint.residentRole} • `}
                      {selectedComplaint.flatId || ''}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body1" sx={{ mb: 2 }}>{selectedComplaint.description}</Typography>
                {selectedComplaint.attachments && selectedComplaint.attachments.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Attachments</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                      {selectedComplaint.attachments.map(attachment => (
                        <Paper key={attachment._id || attachment.id} elevation={0}
                          sx={{ p: 1, mr: 1, mb: 1, display: 'flex', alignItems: 'center', bgcolor: THEME.lightBg, borderRadius: 1 }}>
                          <AttachmentIcon sx={{ fontSize: 18, mr: 1, color: THEME.textSecondary }} />
                          <a href={attachment.url} target="_blank" rel="noopener noreferrer">
                            <Typography variant="caption">{attachment.name}</Typography>
                          </a>
                        </Paper>
                      ))}
                    </Box>
                  </Box>
                )}
                <Divider sx={{ mb: 3 }} />
                <Typography variant="subtitle2" sx={{ mb: 2 }}>Comments & Activity</Typography>
                {!selectedComplaint.comments || selectedComplaint.comments.length === 0 ? (
                  <Typography variant="body2" color={THEME.textSecondary} sx={{ mb: 2 }}>No comments yet</Typography>
                ) : (
                  <Box sx={{ mb: 3 }}>
                    {selectedComplaint.comments.map(comment => (
                      <Box key={comment._id || comment.id}
                        sx={{
                          mb: 2, p: 2, bgcolor: comment.authorUserType === 'Admin' ? THEME.sentBubble : 'white',
                          borderRadius: 2, border: comment.authorUserType === 'Admin' ? 'none' : `1px solid ${THEME.lightGray}`
                        }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="caption" fontWeight={500}>{comment.authorName || comment.author}</Typography>
                          <Typography variant="caption" color={THEME.textSecondary}>
                            {formatDate(comment.createdAt || comment.timestamp)}
                          </Typography>
                        </Box>
                        <Typography variant="body2">{comment.text}</Typography>
                      </Box>
                    ))}
                  </Box>
                )}
                <Box sx={{ mb: 2 }}>
                  <TextField
                    fullWidth multiline rows={2} placeholder="Add a comment..."
                    value={commentText} onChange={e => setCommentText(e.target.value)}
                    variant="outlined" sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                    <Button variant="contained" color="primary" disabled={!commentText.trim()} onClick={handleAddComment}>
                      Comment
                    </Button>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ flex: 1, ml: 2 }}>
                <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: THEME.lightBg, borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>Ticket Details</Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color={THEME.textSecondary}>Status</Typography>
                    <Box sx={{ mt: 0.5 }}>{getStatusChip(selectedComplaint.status)}</Box>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color={THEME.textSecondary}>Priority</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      {getPriorityIcon(selectedComplaint.priority)}
                      <Typography variant="body2" sx={{ ml: 0.5 }}>{PRIORITY_LABELS[selectedComplaint.priority] || selectedComplaint.priority}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color={THEME.textSecondary}>Category</Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>{selectedComplaint.category}</Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color={THEME.textSecondary}>Assigned To</Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {selectedComplaint.assignedToName || selectedComplaint.assignedToUserId || 'Not assigned'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color={THEME.textSecondary}>Last Updated</Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>{formatDate(selectedComplaint.updatedAt)}</Typography>
                  </Box>
                </Paper>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Actions</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Button variant="outlined" color="primary" startIcon={<AccessTimeIcon />}
                    sx={{ mb: 1, justifyContent: 'flex-start' }}
                    onClick={() => handleStatusChange(selectedComplaint._id, 'inProgress')}
                    disabled={selectedComplaint.status === 'inProgress' || selectedComplaint.status === 'resolved'}>
                    Mark In Progress
                  </Button>
                  <Button variant="outlined" color="success" startIcon={<CheckCircleIcon />}
                    sx={{ mb: 1, justifyContent: 'flex-start' }}
                    onClick={() => handleStatusChange(selectedComplaint._id, 'resolved')}
                    disabled={selectedComplaint.status === 'resolved'}>
                    Resolve Ticket
                  </Button>
                  <Button variant="outlined" color="error" startIcon={<CloseIcon />}
                    sx={{ justifyContent: 'flex-start' }}
                    onClick={handleCloseDetailDialog}>
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
        p: 2, bgcolor: 'white', borderTop: `1px solid ${THEME.lightGray}`,
        display: 'flex', justifyContent: 'space-between'
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
              value={complaints.length ? Math.round((complaints.filter(c => c.status === 'resolved').length / complaints.length) * 100) : 0}
              size={16} thickness={5} sx={{ mr: 1, color: THEME.success }}
            />
            <Typography variant="body2">
              <strong>{complaints.length ? Math.round((complaints.filter(c => c.status === 'resolved').length / complaints.length) * 100) : 0}%</strong> Resolved
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