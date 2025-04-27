import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  TextField,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Chip,
  useTheme
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DownloadIcon from '@mui/icons-material/Download';
import SearchIcon from '@mui/icons-material/Search';
import ArticleIcon from '@mui/icons-material/Article';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderIcon from '@mui/icons-material/Folder';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const fileTypeIcons = {
  pdf: <ArticleIcon sx={{ color: '#e91e63' }} />,
  doc: <ArticleIcon sx={{ color: '#2196f3' }} />,
  xls: <ArticleIcon sx={{ color: '#4caf50' }} />,
  img: <ArticleIcon sx={{ color: '#9c27b0' }} />,
};

// Document categories
const categories = [
  { id: 'rental', name: 'Rental Agreements', icon: <FolderIcon sx={{ color: '#1976d2' }} /> },
  { id: 'works', name: 'Help/Works Documents', icon: <FolderIcon sx={{ color: '#388e3c' }} /> },
  { id: 'resident', name: 'Resident Identity Proofs', icon: <FolderIcon sx={{ color: '#d32f2f' }} /> },
  { id: 'guards', name: 'Security Staff Identity Proofs', icon: <FolderIcon sx={{ color: '#7b1fa2' }} /> },
  { id: 'maids', name: 'Household Staff Documents', icon: <FolderIcon sx={{ color: '#f57c00' }} /> },
  { id: 'society', name: 'Society Rules & Regulations', icon: <FolderIcon sx={{ color: '#0097a7' }} /> },
  { id: 'meeting', name: 'Meeting Minutes', icon: <FolderIcon sx={{ color: '#c2185b' }} /> },
];

const LegalDocuments = () => {
  const theme = useTheme();
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState('rental');
  const [selectedCategory, setSelectedCategory] = useState('rental');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryStats, setCategoryStats] = useState({});

  // Mock data to match real-world scenario
  useEffect(() => {
    const mockFiles = [
      {
        id: 1,
        name: 'Rent Agreement (B-301)',
        size: '200 KB',
        dateUploaded: 'Jan 4, 2022',
        lastUpdated: 'Jan 4, 2022',
        uploadedBy: 'Olivia Rhye',
        type: 'pdf',
        category: 'rental',
        unit: 'B-301'
      },
      {
        id: 2,
        name: 'Rent Agreement (A-205)',
        size: '180 KB',
        dateUploaded: 'Jan 6, 2022',
        lastUpdated: 'Jan 6, 2022',
        uploadedBy: 'Demi Wilkinson',
        type: 'pdf',
        category: 'rental',
        unit: 'A-205'
      },
      {
        id: 3,
        name: 'Rent Agreement (C-102)',
        size: '210 KB',
        dateUploaded: 'Feb 15, 2022',
        lastUpdated: 'Feb 15, 2022',
        uploadedBy: 'Phoenix Baker',
        type: 'pdf',
        category: 'rental',
        unit: 'C-102'
      },
      {
        id: 4,
        name: 'Society Rules and Bylaws',
        size: '720 KB',
        dateUploaded: 'Dec 12, 2021',
        lastUpdated: 'Jan 4, 2022',
        uploadedBy: 'Admin',
        type: 'pdf',
        category: 'society'
      },
      {
        id: 5,
        name: 'Parking Regulations',
        size: '320 KB',
        dateUploaded: 'Dec 15, 2021',
        lastUpdated: 'Dec 15, 2021',
        uploadedBy: 'Admin',
        type: 'pdf',
        category: 'society'
      },
      {
        id: 6,
        name: 'Annual General Meeting Minutes',
        size: '16 MB',
        dateUploaded: 'Mar 2, 2022',
        lastUpdated: 'Mar 2, 2022',
        uploadedBy: 'Lana Steiner',
        type: 'xls',
        category: 'meeting'
      },
      {
        id: 7,
        name: 'Emergency Committee Meeting',
        size: '4.2 MB',
        dateUploaded: 'Apr 6, 2022',
        lastUpdated: 'Apr 6, 2022',
        uploadedBy: 'Demi Wilkinson',
        type: 'doc',
        category: 'meeting'
      },
      {
        id: 8,
        name: 'Aadhar Cards - Maids (Compiled)',
        size: '4.5 MB',
        dateUploaded: 'Jan 8, 2022',
        lastUpdated: 'Jan 8, 2022',
        uploadedBy: 'Candice Wu',
        type: 'pdf',
        category: 'maids'
      },
      {
        id: 9,
        name: 'Police Verification - Maids',
        size: '2.8 MB',
        dateUploaded: 'Jan 10, 2022',
        lastUpdated: 'Feb 2, 2022',
        uploadedBy: 'Candice Wu',
        type: 'pdf',
        category: 'maids'
      },
      {
        id: 10,
        name: 'Security Guards - ID Cards',
        size: '12 MB',
        dateUploaded: 'Jan 6, 2022',
        lastUpdated: 'Jan 6, 2022',
        uploadedBy: 'Natali Craig',
        type: 'pdf',
        category: 'guards'
      },
      {
        id: 11,
        name: 'Security Staff Contact Details',
        size: '800 KB',
        dateUploaded: 'Jan 4, 2022',
        lastUpdated: 'Apr 10, 2022',
        uploadedBy: 'Drew Cano',
        type: 'xls',
        category: 'guards'
      },
      {
        id: 12,
        name: 'Plumbing Maintenance Contract',
        size: '1.2 MB',
        dateUploaded: 'Feb 8, 2022',
        lastUpdated: 'Feb 8, 2022',
        uploadedBy: 'Admin',
        type: 'pdf',
        category: 'works'
      },
      {
        id: 13,
        name: 'Electrical Maintenance Schedule',
        size: '950 KB',
        dateUploaded: 'Feb 10, 2022',
        lastUpdated: 'Mar 15, 2022',
        uploadedBy: 'Admin',
        type: 'xls',
        category: 'works'
      },
      {
        id: 14,
        name: 'Resident ID Cards - Tower A',
        size: '8.5 MB',
        dateUploaded: 'Dec 20, 2021',
        lastUpdated: 'Jan 15, 2022',
        uploadedBy: 'Admin',
        type: 'pdf',
        category: 'resident'
      },
      {
        id: 15,
        name: 'Resident ID Cards - Tower B',
        size: '9.2 MB',
        dateUploaded: 'Dec 22, 2021',
        lastUpdated: 'Jan 16, 2022',
        uploadedBy: 'Admin',
        type: 'pdf',
        category: 'resident'
      },
    ];

    setFiles(mockFiles);

    // Calculate category statistics
    const stats = {};
    categories.forEach(category => {
      const categoryFiles = mockFiles.filter(file => file.category === category.id);
      stats[category.id] = {
        count: categoryFiles.length,
        totalSize: categoryFiles.reduce((sum, file) => {
          const size = parseFloat(file.size.split(' ')[0]);
          const unit = file.size.split(' ')[1];
          const sizeInKB = unit === 'MB' ? size * 1024 : size;
          return sum + sizeInKB;
        }, 0)
      };
    });
    setCategoryStats(stats);
  }, []);

  const formatSize = (sizeInKB) => {
    if (sizeInKB >= 1024) {
      return `${(sizeInKB / 1024).toFixed(1)} MB`;
    }
    return `${Math.round(sizeInKB)} KB`;
  };

  const handleAccordionChange = (category) => (event, isExpanded) => {
    setExpandedCategory(isExpanded ? category : false);
  };

  const handleSelectAll = (category) => (event) => {
    const categoryFiles = files.filter(file => file.category === category);
    
    if (event.target.checked) {
      setSelectedFiles([...new Set([...selectedFiles, ...categoryFiles.map(file => file.id)])]);
    } else {
      setSelectedFiles(selectedFiles.filter(id => !categoryFiles.map(file => file.id).includes(id)));
    }
  };

  const handleSelectFile = (id) => {
    const selectedIndex = selectedFiles.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selectedFiles, id];
    } else {
      newSelected = selectedFiles.filter(fileId => fileId !== id);
    }

    setSelectedFiles(newSelected);
  };

  const handleOpenUploadDialog = () => {
    setOpenUploadDialog(true);
  };

  const handleCloseUploadDialog = () => {
    setOpenUploadDialog(false);
    setFileToUpload(null);
    setUploadProgress(0);
  };

  const handleFileSelect = (e) => {
    if (e.target.files.length > 0) {
      setFileToUpload(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!fileToUpload) return;

    setUploading(true);
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        
        // Add file to the list
        const newFile = {
          id: Math.max(...files.map(f => f.id)) + 1,
          name: fileToUpload.name,
          size: `${Math.round(fileToUpload.size / 1024)} KB`,
          dateUploaded: new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          }),
          lastUpdated: new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          }),
          uploadedBy: 'Current Admin',
          type: fileToUpload.name.split('.').pop() === 'pdf' ? 'pdf' : 
                 fileToUpload.name.split('.').pop() === 'doc' ? 'doc' :
                 fileToUpload.name.split('.').pop() === 'xls' ? 'xls' : 'img',
          category: selectedCategory
        };
        
        const updatedFiles = [newFile, ...files];
        setFiles(updatedFiles);
        
        // Update category stats
        const newStats = {...categoryStats};
        newStats[selectedCategory].count += 1;
        newStats[selectedCategory].totalSize += parseInt(newFile.size);
        setCategoryStats(newStats);
        
        setUploading(false);
        handleCloseUploadDialog();

        // Auto-expand the category where the file was added
        setExpandedCategory(selectedCategory);
      }
    }, 300);
  };

  const handleDownloadSelected = (category) => {
    // In a real app, this would trigger downloads of selected files
    const categoryFiles = files.filter(file => file.category === category);
    const selectedCategoryFiles = categoryFiles.filter(file => selectedFiles.includes(file.id));
    console.log("Downloading files:", selectedCategoryFiles.map(file => file.name));
  };

  const handleContextMenu = (event, file) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedFile(file);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedFile(null);
  };

  const handleDeleteFile = () => {
    if (selectedFile) {
      // Remove file from the list
      const updatedFiles = files.filter(file => file.id !== selectedFile.id);
      setFiles(updatedFiles);
      
      // Update category stats
      const deletedFileSize = parseFloat(selectedFile.size.split(' ')[0]);
      const deletedFileUnit = selectedFile.size.split(' ')[1];
      const sizeInKB = deletedFileUnit === 'MB' ? deletedFileSize * 1024 : deletedFileSize;
      
      const newStats = {...categoryStats};
      newStats[selectedFile.category].count -= 1;
      newStats[selectedFile.category].totalSize -= sizeInKB;
      setCategoryStats(newStats);
      
      // Remove from selected files if present
      setSelectedFiles(selectedFiles.filter(id => id !== selectedFile.id));
    }
    handleCloseMenu();
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredFiles = searchTerm 
    ? files.filter(file => 
        file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (file.unit && file.unit.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : files;

  const getCategoryFiles = (categoryId) => {
    return filteredFiles.filter(file => file.category === categoryId);
  };

  const isSelected = (id) => selectedFiles.indexOf(id) !== -1;

  const areAllCategoryFilesSelected = (category) => {
    const categoryFiles = files.filter(file => file.category === category);
    return categoryFiles.length > 0 && categoryFiles.every(file => selectedFiles.includes(file.id));
  };

  const areSomeCategoryFilesSelected = (category) => {
    const categoryFiles = files.filter(file => file.category === category);
    return categoryFiles.some(file => selectedFiles.includes(file.id)) && 
           !categoryFiles.every(file => selectedFiles.includes(file.id));
  };

  return (
    <Box sx={{ 
      padding: 3, 
      bgcolor: "#f5f7fa", 
      minHeight: "100vh" 
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1" sx={{ color: "#2c3e50", fontWeight: "bold" }}>
          Legal Documents Repository
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'white', borderRadius: 1, px: 1, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', width: 250 }}>
            <SearchIcon sx={{ color: '#2c3e50' }} />
            <TextField 
              variant="standard" 
              placeholder="Search files, uploader, unit..." 
              InputProps={{ disableUnderline: true }}
              sx={{ ml: 1, color: 'black', width: '100%' }}
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </Box>
          
          <Button 
            variant="contained" 
            sx={{ 
              bgcolor: "#2c3e50", 
              "&:hover": { bgcolor: "#1a252f" } 
            }}
            startIcon={<FileUploadIcon />}
            onClick={handleOpenUploadDialog}
          >
            Upload Document
          </Button>
        </Box>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 1, color: '#555' }}>
          Categories
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {categories.map((category) => (
            <Paper 
              key={category.id}
              elevation={1}
              sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                p: 2, 
                width: 150,
                borderRadius: 2,
                cursor: 'pointer',
                bgcolor: expandedCategory === category.id ? '#e3f2fd' : 'white',
                '&:hover': { bgcolor: '#f0f7ff' }
              }}
              onClick={() => setExpandedCategory(category.id)}
            >
              {category.icon}
              <Typography variant="body2" sx={{ mt: 1, textAlign: 'center', fontWeight: 'medium' }}>
                {category.name}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {categoryStats[category.id]?.count || 0} files
              </Typography>
            </Paper>
          ))}
        </Box>
      </Box>

      {categories.map((category) => {
        const categoryFiles = getCategoryFiles(category.id);
        const hasFiles = categoryFiles.length > 0;
        
        return (
          <Accordion 
            key={category.id}
            expanded={expandedCategory === category.id}
            onChange={handleAccordionChange(category.id)}
            sx={{ 
              mb: 2,
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              borderRadius: '8px !important',
              '&:before': {
                display: 'none',
              },
              overflow: 'hidden'
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ 
                bgcolor: '#e8f4fc',
                '&.Mui-expanded': {
                  minHeight: 64,
                  borderBottom: '1px solid #cce5ff'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                {category.icon}
                <Typography sx={{ ml: 2, fontWeight: 'medium', color: '#2c3e50', flexGrow: 1 }}>
                  {category.name}
                </Typography>
                <Chip 
                  label={`${categoryFiles.length} files`} 
                  size="small"
                  sx={{ mr: 2, bgcolor: '#bbdefb', color: '#1565c0' }}
                />
                {categoryStats[category.id] && (
                  <Typography variant="body2" sx={{ color: 'text.secondary', mr: 2 }}>
                    {formatSize(categoryStats[category.id].totalSize)}
                  </Typography>
                )}
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              {hasFiles ? (
                <TableContainer>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead sx={{ bgcolor: '#f5f9ff' }}>
                      <TableRow>
                        <TableCell padding="checkbox">
                          <Checkbox
                            indeterminate={areSomeCategoryFilesSelected(category.id)}
                            checked={areAllCategoryFilesSelected(category.id)}
                            onChange={handleSelectAll(category.id)}
                            sx={{
                              color: "#2c3e50",
                              '&.Mui-checked': {
                                color: "#2c3e50",
                              },
                              '&.MuiCheckbox-indeterminate': {
                                color: "#2c3e50",
                              }
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontWeight: "medium", color: "#2c3e50" }}>File name</TableCell>
                        {category.id === 'rental' && (
                          <TableCell sx={{ fontWeight: "medium", color: "#2c3e50" }}>Unit</TableCell>
                        )}
                        <TableCell sx={{ fontWeight: "medium", color: "#2c3e50" }}>File size</TableCell>
                        <TableCell sx={{ fontWeight: "medium", color: "#2c3e50" }}>Date uploaded</TableCell>
                        <TableCell sx={{ fontWeight: "medium", color: "#2c3e50" }}>Last updated</TableCell>
                        <TableCell sx={{ fontWeight: "medium", color: "#2c3e50" }}>Uploaded by</TableCell>
                        <TableCell align="right">
                          <Button
                            size="small"
                            startIcon={<DownloadIcon />}
                            disabled={!categoryFiles.some(file => selectedFiles.includes(file.id))}
                            onClick={() => handleDownloadSelected(category.id)}
                            sx={{ 
                              color: "#2c3e50",
                              "&.Mui-disabled": {
                                color: "rgba(44, 62, 80, 0.5)",
                              }
                            }}
                          >
                            Download
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {categoryFiles.map((file) => {
                        const isItemSelected = isSelected(file.id);
                        
                        return (
                          <TableRow
                            key={file.id}
                            hover
                            onClick={() => handleSelectFile(file.id)}
                            role="checkbox"
                            aria-checked={isItemSelected}
                            selected={isItemSelected}
                            sx={{ 
                              '&.Mui-selected': {
                                backgroundColor: 'rgba(44, 62, 80, 0.08)',
                              },
                              '&.Mui-selected:hover': {
                                backgroundColor: 'rgba(44, 62, 80, 0.12)',
                              },
                              '&:hover': {
                                backgroundColor: 'rgba(44, 62, 80, 0.04)',
                              }
                            }}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={isItemSelected}
                                onClick={(e) => e.stopPropagation()}
                                onChange={() => handleSelectFile(file.id)}
                                sx={{
                                  color: "#2c3e50",
                                  '&.Mui-checked': {
                                    color: "#2c3e50",
                                  }
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', color: '#2c3e50' }}>
                                {fileTypeIcons[file.type] || <InsertDriveFileIcon sx={{ color: '#9e9e9e' }} />}
                                <Typography sx={{ ml: 2, color: '#2c3e50' }}>{file.name}</Typography>
                              </Box>
                            </TableCell>
                            {category.id === 'rental' && (
                              <TableCell sx={{ color: '#2c3e50' }}>{file.unit || '-'}</TableCell>
                            )}
                            <TableCell sx={{ color: '#2c3e50' }}>{file.size}</TableCell>
                            <TableCell sx={{ color: '#2c3e50' }}>{file.dateUploaded}</TableCell>
                            <TableCell sx={{ color: '#2c3e50' }}>{file.lastUpdated}</TableCell>
                            <TableCell sx={{ color: '#2c3e50' }}>{file.uploadedBy}</TableCell>
                            <TableCell align="right">
                              <IconButton 
                                size="small" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleContextMenu(e, file);
                                }}
                                sx={{ color: '#2c3e50' }}
                              >
                                <MoreVertIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
                  <InsertDriveFileIcon sx={{ color: '#ccc', fontSize: 48, mb: 2 }} />
                  <Typography variant="body1" sx={{ color: '#777', mb: 2 }}>
                    No documents found in this category
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      handleOpenUploadDialog();
                    }}
                  >
                    Add documents
                  </Button>
                </Box>
              )}
            </AccordionDetails>
          </Accordion>
        );
      })}

      {/* File context menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        sx={{ '& .MuiPaper-root': { boxShadow: '0 4px 20px rgba(0,0,0,0.15)' } }}
      >
        <MenuItem onClick={handleCloseMenu}>
          <DownloadIcon fontSize="small" sx={{ mr: 1, color: "#2c3e50" }} />
          Download
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDeleteFile}>
          <DeleteIcon fontSize="small" sx={{ mr: 1, color: "#d32f2f" }} />
          <Typography color="#d32f2f">Delete</Typography>
        </MenuItem>
      </Menu>

      {/* Upload Dialog */}
      <Dialog open={openUploadDialog} onClose={handleCloseUploadDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: "#f8f9fa", color: "#2c3e50" }}>Upload Document</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', p: 3 }}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="category-select-label">Document Category</InputLabel>
              <Select
                labelId="category-select-label"
                id="category-select"
                value={selectedCategory}
                label="Document Category"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {category.icon}
                      <Typography sx={{ ml: 1 }}>{category.name}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            {!fileToUpload ? (
              <Box 
                sx={{ 
                  border: '2px dashed #bbdefb', 
                  borderRadius: 2, 
                  p: 5, 
                  textAlign: 'center',
                  width: '100%',
                  bgcolor: '#e3f2fd'
                }}
                component="label"
              >
                <input
                  type="file"
                  hidden
                  onChange={handleFileSelect}
                />
                <FileUploadIcon sx={{ fontSize: 40, color: '#2c3e50', mb: 2 }} />
                <Typography sx={{ color: "#2c3e50" }}>
                  Drag and drop files here or click to browse
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Supported formats: PDF, DOC, XLS, JPG, PNG
                </Typography>
              </Box>
            ) : (
              <Box sx={{ width: '100%' }}>
                <Paper sx={{ p: 2, bgcolor: '#f8faff', border: '1px solid #e0e7ff', borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {fileTypeIcons[fileToUpload.name.split('.').pop() === 'pdf' ? 'pdf' : 
                     fileToUpload.name.split('.').pop() === 'doc' ? 'doc' :
                     fileToUpload.name.split('.').pop() === 'xls' ? 'xls' : 'img'] || 
                    <InsertDriveFileIcon sx={{ color: "#2c3e50" }} />}
                    <Typography sx={{ ml: 1, color: '#2c3e50', fontWeight: 'medium' }}>{fileToUpload.name}
</Typography>
<Typography sx={{ ml: 1, color: '#2c3e50', fontWeight: 'medium', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {fileToUpload.name}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Size: {Math.round(fileToUpload.size / 1024)} KB
                  </Typography>
                  
                  {uploading && (
                    <Box sx={{ width: '100%', mt: 2 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </Typography>
                      <Box sx={{ width: '100%', backgroundColor: '#e0e0e0', borderRadius: 5, height: 8, mt: 1 }}>
                        <Box
                          sx={{
                            backgroundColor: '#2c3e50',
                            height: '100%',
                            borderRadius: 5,
                            width: `${uploadProgress}%`,
                            transition: 'width 0.3s ease'
                          }}
                        />
                      </Box>
                    </Box>
                  )}
                </Paper>

                {selectedCategory === 'rental' && !uploading && (
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Unit Number"
                    placeholder="e.g. A-101, B-203"
                    size="small"
                    sx={{ mt: 2 }}
                  />
                )}
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ bgcolor: "#f8f9fa", p: 2 }}>
          <Button onClick={handleCloseUploadDialog} sx={{ color: '#2c3e50' }}>Cancel</Button>
          <Button 
            onClick={handleUpload} 
            variant="contained" 
            disabled={!fileToUpload || uploading}
            sx={{ 
              bgcolor: "#2c3e50", 
              "&:hover": { bgcolor: "#1a252f" },
              "&.Mui-disabled": {
                bgcolor: "rgba(44, 62, 80, 0.3)",
              }
            }}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LegalDocuments;                     