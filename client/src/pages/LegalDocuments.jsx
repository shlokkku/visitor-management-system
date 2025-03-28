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
  useTheme
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DownloadIcon from '@mui/icons-material/Download';
import SearchIcon from '@mui/icons-material/Search';
import ArticleIcon from '@mui/icons-material/Article';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DeleteIcon from '@mui/icons-material/Delete';

const fileTypeIcons = {
  pdf: <ArticleIcon sx={{ color: '#e91e63' }} />,
  doc: <ArticleIcon sx={{ color: '#2196f3' }} />,
  xls: <ArticleIcon sx={{ color: '#4caf50' }} />,
  img: <ArticleIcon sx={{ color: '#9c27b0' }} />,
};

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

  // Mock data to match your screenshot
  useEffect(() => {
    setFiles([
      {
        id: 1,
        name: 'Rent Agreement(B-301)',
        size: '200 KB',
        dateUploaded: 'Jan 4, 2022',
        lastUpdated: 'Jan 4, 2022',
        uploadedBy: 'Olivia Rhye',
        type: 'pdf'
      },
      {
        id: 2,
        name: 'Society Rules',
        size: '720 KB',
        dateUploaded: 'Jan 4, 2022',
        lastUpdated: 'Jan 4, 2022',
        uploadedBy: 'Phoenix Baker',
        type: 'img'
      },
      {
        id: 3,
        name: 'Meeting Discussions',
        size: '16 MB',
        dateUploaded: 'Jan 2, 2022',
        lastUpdated: 'Jan 2, 2022',
        uploadedBy: 'Lana Steiner',
        type: 'xls'
      },
      {
        id: 4,
        name: 'Rent Agreement(A-205)',
        size: '4.2 MB',
        dateUploaded: 'Jan 6, 2022',
        lastUpdated: 'Jan 6, 2022',
        uploadedBy: 'Demi Wilkinson',
        type: 'xls'
      },
      {
        id: 5,
        name: 'Aadhar copy maids',
        size: '400 KB',
        dateUploaded: 'Jan 8, 2022',
        lastUpdated: 'Jan 8, 2022',
        uploadedBy: 'Candice Wu',
        type: 'pdf'
      },
      {
        id: 6,
        name: 'Aadhar copy Security guards',
        size: '12 MB',
        dateUploaded: 'Jan 6, 2022',
        lastUpdated: 'Jan 6, 2022',
        uploadedBy: 'Natali Craig',
        type: 'img'
      },
      {
        id: 7,
        name: 'Security guards holiday',
        size: '800 KB',
        dateUploaded: 'Jan 4, 2022',
        lastUpdated: 'Jan 4, 2022',
        uploadedBy: 'Drew Cano',
        type: 'img'
      },
    ]);
  }, []);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedFiles(files.map(file => file.id));
    } else {
      setSelectedFiles([]);
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
          id: files.length + 1,
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
          uploadedBy: 'Current User',
          type: fileToUpload.name.split('.').pop() === 'pdf' ? 'pdf' : 
                 fileToUpload.name.split('.').pop() === 'doc' ? 'doc' :
                 fileToUpload.name.split('.').pop() === 'xls' ? 'xls' : 'img'
        };
        
        setFiles([newFile, ...files]);
        setUploading(false);
        handleCloseUploadDialog();
      }
    }, 300);
  };

  const handleDownloadAll = () => {
    // In a real app, this would trigger downloads of all selected files
    console.log("Downloading files:", selectedFiles.map(id => files.find(file => file.id === id).name));
  };

  const handleContextMenu = (event, file) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
    setSelectedFile(file);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedFile(null);
  };

  const handleDeleteFile = () => {
    if (selectedFile) {
      setFiles(files.filter(file => file.id !== selectedFile.id));
      setSelectedFiles(selectedFiles.filter(id => id !== selectedFile.id));
    }
    handleCloseMenu();
  };

  const isSelected = (id) => selectedFiles.indexOf(id) !== -1;

  return (
    <Box sx={{ 
      padding: 3, 
      bgcolor: "#f8f9fa", 
      minHeight: "100vh" 
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1" sx={{ color: "#2c3e50", fontWeight: "bold" }}>
          Legal Documents
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'white', borderRadius: 1, px: 1, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <SearchIcon sx={{ color: '#2c3e50' }} />
            <TextField 
              variant="standard" 
              placeholder="Search files..." 
              InputProps={{ disableUnderline: true }}
              sx={{ ml: 1, color: 'black' }}
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
            Upload
          </Button>
        </Box>
      </Box>

      <Paper sx={{ 
        width: '100%', 
        overflow: 'hidden', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)', 
        borderRadius: 2,
        bgcolor: '#e3f2fd' // Changed the entire Paper background to light blue
      }}>
        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          borderBottom: '1px solid #cce5ff'
        }}>
          <Typography variant="subtitle1" component="div" fontWeight="medium" sx={{ color: "#2c3e50" }}>
            Files uploaded
          </Typography>
          <Button
            size="small"
            startIcon={<DownloadIcon />}
            disabled={selectedFiles.length === 0}
            onClick={handleDownloadAll}
            sx={{ 
              color: "#2c3e50",
              "&.Mui-disabled": {
                color: "rgba(44, 62, 80, 0.5)",
              }
            }}
          >
            Download all
          </Button>
        </Box>
        
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: '#bbdefb' }}>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selectedFiles.length > 0 && selectedFiles.length < files.length}
                    checked={files.length > 0 && selectedFiles.length === files.length}
                    onChange={handleSelectAll}
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
                <TableCell sx={{ fontWeight: "medium", color: "#2c3e50" }}>File size</TableCell>
                <TableCell sx={{ fontWeight: "medium", color: "#2c3e50" }}>Date uploaded</TableCell>
                <TableCell sx={{ fontWeight: "medium", color: "#2c3e50" }}>Last updated</TableCell>
                <TableCell sx={{ fontWeight: "medium", color: "#2c3e50" }}>Uploaded by</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {files.map((file) => {
                const isItemSelected = isSelected(file.id);
                
                return (
                  <TableRow
                    key={file.id}
                    hover
                    onClick={() => handleSelectFile(file.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    selected={isItemSelected}
                    onContextMenu={(e) => handleContextMenu(e, file)}
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
                    <TableCell sx={{ color: '#2c3e50' }}>{file.size}</TableCell>
                    <TableCell sx={{ color: '#2c3e50' }}>{file.dateUploaded}</TableCell>
                    <TableCell sx={{ color: '#2c3e50' }}>{file.lastUpdated}</TableCell>
                    <TableCell sx={{ color: '#2c3e50' }}>{file.uploadedBy}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={(e) => {
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
      </Paper>

      {/* File context menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleCloseMenu}>
          <DownloadIcon fontSize="small" sx={{ mr: 1, color: "#2c3e50" }} />
          Download
        </MenuItem>
        <MenuItem onClick={handleDeleteFile}>
          <DeleteIcon fontSize="small" sx={{ mr: 1, color: "#2c3e50" }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Upload Dialog */}
      <Dialog open={openUploadDialog} onClose={handleCloseUploadDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: "#f8f9fa", color: "#2c3e50" }}>Upload Document</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
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
              <Box sx={{ width: '100%', textAlign: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <InsertDriveFileIcon sx={{ mr: 1, color: "#2c3e50" }} />
                  <Typography sx={{ color: '#2c3e50' }}>{fileToUpload.name}</Typography>
                </Box>
                
                {uploading && (
                  <Box sx={{ width: '100%', mt: 2 }}>
                    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                      <CircularProgress 
                        variant="determinate" 
                        value={uploadProgress} 
                        sx={{
                          color: "#2c3e50"
                        }}
                      />
                      <Box
                        sx={{
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          position: 'absolute',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography variant="caption" component="div" color="text.secondary">
                          {`${Math.round(uploadProgress)}%`}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ bgcolor: "#f8f9fa" }}>
          <Button onClick={handleCloseUploadDialog}>Cancel</Button>
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
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LegalDocuments;