import React, { useState, useEffect } from "react";
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
  useTheme,
  Tooltip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import DownloadIcon from "@mui/icons-material/Download";
import SearchIcon from "@mui/icons-material/Search";
import ArticleIcon from "@mui/icons-material/Article";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderIcon from "@mui/icons-material/Folder";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { api } from "../services/authService"; // <-- Use your axios instance with interceptors

const fileTypeIcons = {
  pdf: <ArticleIcon sx={{ color: "#e91e63" }} />,
  doc: <ArticleIcon sx={{ color: "#2196f3" }} />,
  docx: <ArticleIcon sx={{ color: "#2196f3" }} />,
  xls: <ArticleIcon sx={{ color: "#4caf50" }} />,
  xlsx: <ArticleIcon sx={{ color: "#4caf50" }} />,
  img: <ArticleIcon sx={{ color: "#9c27b0" }} />,
};

// Document categories
const categories = [
  { id: "rental", name: "Rental Agreements", icon: <FolderIcon sx={{ color: "#1976d2" }} /> },
  { id: "works", name: "Help/Works Documents", icon: <FolderIcon sx={{ color: "#388e3c" }} /> },
  { id: "resident", name: "Resident Identity Proofs", icon: <FolderIcon sx={{ color: "#d32f2f" }} /> },
  { id: "guards", name: "Security Staff Identity Proofs", icon: <FolderIcon sx={{ color: "#7b1fa2" }} /> },
  { id: "maids", name: "Household Staff Documents", icon: <FolderIcon sx={{ color: "#f57c00" }} /> },
  { id: "society", name: "Society Rules & Regulations", icon: <FolderIcon sx={{ color: "#0097a7" }} /> },
  { id: "meeting", name: "Meeting Minutes", icon: <FolderIcon sx={{ color: "#c2185b" }} /> },
];

const formatFileSize = (size) => {
  if (size >= 1024 * 1024) return `${(size / 1024 / 1024).toFixed(2)} MB`;
  if (size >= 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${size} B`;
};

const LegalDocuments = () => {
  const theme = useTheme();
  const [documents, setDocuments] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [uploadCategory, setUploadCategory] = useState("rental");
  const [uploadUnit, setUploadUnit] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState("rental");
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch all documents from backend
  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/documents");
      setDocuments(res.data);
    } catch (err) {
      setMessage("Error fetching documents");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Upload document to backend
  const handleUpload = async () => {
    if (!fileToUpload || !uploadCategory) {
      setMessage("Please select a file and category.");
      return;
    }
    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", fileToUpload);
    formData.append("category", uploadCategory);
    if (uploadCategory === "rental" && uploadUnit) {
      formData.append("unit", uploadUnit);
    }

    try {
      const res = await api.post("/api/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (evt) => {
          if (evt.total > 0) setUploadProgress(Math.round((evt.loaded / evt.total) * 100));
        },
      });
      setMessage("Upload successful!");
      setOpenUploadDialog(false);
      setFileToUpload(null);
      setUploadCategory("rental");
      setUploadUnit("");
      fetchDocuments();
    } catch (err) {
      setMessage(err.response?.data?.message || "Error uploading document");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Download file
  const handleDownload = async (doc) => {
    try {
      const res = await api.get(`/api/documents/download/${doc._id}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.originalName || doc.name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error downloading file");
    }
  };

  // Delete file
  const handleDelete = async (doc) => {
    if (!window.confirm(`Delete "${doc.originalName || doc.name}"?`)) return;
    try {
      await api.delete(`/api/documents/${doc._id}`);
      setMessage("Deleted!");
      fetchDocuments();
    } catch (err) {
      setMessage(err.response?.data?.message || "Error deleting file");
    }
  };

  // Filtering and grouping
  const filteredDocuments = searchTerm
    ? documents.filter(
        (doc) =>
          doc.originalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.uploadedByName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.unit?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : documents;

  // Group by category
  const getCategoryDocs = (catId) =>
    filteredDocuments.filter((doc) => doc.category === catId);

  // Table selection logic
  const isSelected = (id) => selectedFiles.indexOf(id) !== -1;

  const handleSelectFile = (id) => {
    setSelectedFiles((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (catId) => (e) => {
    const catDocs = getCategoryDocs(catId);
    if (e.target.checked) {
      setSelectedFiles((prev) => [
        ...new Set([...prev, ...catDocs.map((d) => d._id)]),
      ]);
    } else {
      setSelectedFiles((prev) =>
        prev.filter((fid) => !catDocs.map((d) => d._id).includes(fid))
      );
    }
  };

  const handleDownloadSelected = async (catId) => {
    const catDocs = getCategoryDocs(catId).filter((d) => selectedFiles.includes(d._id));
    catDocs.forEach(handleDownload);
  };

  // Context menu
  const handleContextMenu = (e, file) => {
    e.preventDefault();
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
    setSelectedFile(file);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedFile(null);
  };

  // Upload dialog logic
  const handleOpenUploadDialog = (catId) => {
    setUploadCategory(catId || "rental");
    setOpenUploadDialog(true);
  };

  // Category stats
  const categoryStats = {};
  categories.forEach((cat) => {
    const docs = getCategoryDocs(cat.id);
    categoryStats[cat.id] = {
      count: docs.length,
      totalSize: docs.reduce((sum, d) => sum + (d.size || 0), 0),
    };
  });

  return (
    <Box sx={{ padding: 3, bgcolor: "#f5f7fa", minHeight: "100vh" }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" fontWeight="bold" color="#2c3e50">
          Legal Documents Repository
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              bgcolor: "white",
              borderRadius: 1,
              px: 1,
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              width: 250,
            }}
          >
            <SearchIcon sx={{ color: "#2c3e50" }} />
            <TextField
              variant="standard"
              placeholder="Search files, uploader, unit..."
              InputProps={{ disableUnderline: true }}
              sx={{ ml: 1, color: "black", width: "100%" }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Box>
          <Button
            variant="contained"
            sx={{ bgcolor: "#2c3e50", "&:hover": { bgcolor: "#1a252f" } }}
            startIcon={<FileUploadIcon />}
            onClick={() => handleOpenUploadDialog("rental")}
          >
            Upload Document
          </Button>
        </Box>
      </Box>

      {/* Categories */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 1, color: "#555" }}>
          Categories
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {categories.map((cat) => (
            <Paper
              key={cat.id}
              elevation={1}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                p: 2,
                width: 150,
                borderRadius: 2,
                cursor: "pointer",
                bgcolor: expandedCategory === cat.id ? "#e3f2fd" : "white",
                "&:hover": { bgcolor: "#f0f7ff" },
              }}
              onClick={() => setExpandedCategory(cat.id)}
            >
              {cat.icon}
              <Typography variant="body2" sx={{ mt: 1, textAlign: "center", fontWeight: "medium" }}>
                {cat.name}
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                {categoryStats[cat.id]?.count || 0} files
              </Typography>
            </Paper>
          ))}
        </Box>
      </Box>

      {/* Accordions for categories */}
      {categories.map((cat) => {
        const catDocs = getCategoryDocs(cat.id);
        const hasFiles = catDocs.length > 0;
        const allSelected = catDocs.length > 0 && catDocs.every((d) => selectedFiles.includes(d._id));
        const someSelected =
          catDocs.some((d) => selectedFiles.includes(d._id)) && !allSelected;

        return (
          <Accordion
            key={cat.id}
            expanded={expandedCategory === cat.id}
            onChange={() => setExpandedCategory(expandedCategory === cat.id ? false : cat.id)}
            sx={{
              mb: 2,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              borderRadius: "8px !important",
              "&:before": { display: "none" },
              overflow: "hidden",
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                bgcolor: "#e8f4fc",
                "&.Mui-expanded": {
                  minHeight: 64,
                  borderBottom: "1px solid #cce5ff",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
                {cat.icon}
                <Typography sx={{ ml: 2, fontWeight: "medium", color: "#2c3e50", flexGrow: 1 }}>
                  {cat.name}
                </Typography>
                <Chip
                  label={`${catDocs.length} files`}
                  size="small"
                  sx={{ mr: 2, bgcolor: "#bbdefb", color: "#1565c0" }}
                />
                <Typography variant="body2" sx={{ color: "text.secondary", mr: 2 }}>
                  {formatFileSize(categoryStats[cat.id]?.totalSize || 0)}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              {hasFiles ? (
                <TableContainer>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead sx={{ bgcolor: "#f5f9ff" }}>
                      <TableRow>
                        <TableCell padding="checkbox">
                          <Checkbox
                            indeterminate={someSelected}
                            checked={allSelected}
                            onChange={handleSelectAll(cat.id)}
                            sx={{
                              color: "#2c3e50",
                              "&.Mui-checked": { color: "#2c3e50" },
                              "&.MuiCheckbox-indeterminate": { color: "#2c3e50" },
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ fontWeight: "medium", color: "#2c3e50" }}>File name</TableCell>
                        {cat.id === "rental" && (
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
                            disabled={!catDocs.some((f) => selectedFiles.includes(f._id))}
                            onClick={() => handleDownloadSelected(cat.id)}
                            sx={{
                              color: "#2c3e50",
                              "&.Mui-disabled": { color: "rgba(44, 62, 80, 0.5)" },
                            }}
                          >
                            Download
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {catDocs.map((file) => {
                        const ext = (file.type || "").toLowerCase();
                        return (
                          <TableRow
                            key={file._id}
                            hover
                            onClick={() => handleSelectFile(file._id)}
                            role="checkbox"
                            aria-checked={isSelected(file._id)}
                            selected={isSelected(file._id)}
                            sx={{
                              "&.Mui-selected": { backgroundColor: "rgba(44, 62, 80, 0.08)" },
                              "&.Mui-selected:hover": { backgroundColor: "rgba(44, 62, 80, 0.12)" },
                              "&:hover": { backgroundColor: "rgba(44, 62, 80, 0.04)" },
                            }}
                            onContextMenu={(e) => handleContextMenu(e, file)}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={isSelected(file._id)}
                                onClick={(e) => e.stopPropagation()}
                                onChange={() => handleSelectFile(file._id)}
                                sx={{
                                  color: "#2c3e50",
                                  "&.Mui-checked": { color: "#2c3e50" },
                                }}
                              />
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: "flex", alignItems: "center", color: "#2c3e50" }}>
                                {fileTypeIcons[ext] || <InsertDriveFileIcon sx={{ color: "#9e9e9e" }} />}
                                <Tooltip title={file.originalName || file.name}>
                                  <Typography sx={{ ml: 2, color: "#2c3e50", maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {file.originalName || file.name}
                                  </Typography>
                                </Tooltip>
                              </Box>
                            </TableCell>
                            {cat.id === "rental" && (
                              <TableCell sx={{ color: "#2c3e50" }}>{file.unit || "-"}</TableCell>
                            )}
                            <TableCell sx={{ color: "#2c3e50" }}>{formatFileSize(file.size)}</TableCell>
                            <TableCell sx={{ color: "#2c3e50" }}>
                              {file.dateUploaded
                                ? new Date(file.dateUploaded).toLocaleDateString()
                                : "-"}
                            </TableCell>
                            <TableCell sx={{ color: "#2c3e50" }}>
                              {file.lastUpdated
                                ? new Date(file.lastUpdated).toLocaleDateString()
                                : "-"}
                            </TableCell>
                            <TableCell sx={{ color: "#2c3e50" }}>
                              {file.uploadedByName || file.uploadedBy}
                            </TableCell>
                            <TableCell align="right">
                              <IconButton
                                size="small"
                                onClick={(e) => handleContextMenu(e, file)}
                                sx={{ color: "#2c3e50" }}
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
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 4 }}>
                  <InsertDriveFileIcon sx={{ color: "#ccc", fontSize: 48, mb: 2 }} />
                  <Typography variant="body1" sx={{ color: "#777", mb: 2 }}>
                    No documents found in this category
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={() => handleOpenUploadDialog(cat.id)}
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
        sx={{ "& .MuiPaper-root": { boxShadow: "0 4px 20px rgba(0,0,0,0.15)" } }}
      >
        <MenuItem
          onClick={() => {
            handleDownload(selectedFile);
            handleCloseMenu();
          }}
        >
          <DownloadIcon fontSize="small" sx={{ mr: 1, color: "#2c3e50" }} />
          Download
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            handleDelete(selectedFile);
            handleCloseMenu();
          }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1, color: "#d32f2f" }} />
          <Typography color="#d32f2f">Delete</Typography>
        </MenuItem>
      </Menu>

      {/* Upload Dialog */}
      <Dialog open={openUploadDialog} onClose={() => setOpenUploadDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: "#f8f9fa", color: "#2c3e50" }}>Upload Document</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", p: 3 }}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="category-select-label">Document Category</InputLabel>
              <Select
                labelId="category-select-label"
                id="category-select"
                value={uploadCategory}
                label="Document Category"
                onChange={(e) => setUploadCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {category.icon}
                      <Typography sx={{ ml: 1 }}>{category.name}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box
              sx={{
                border: "2px dashed #bbdefb",
                borderRadius: 2,
                p: 5,
                textAlign: "center",
                width: "100%",
                bgcolor: "#e3f2fd",
                mb: 3,
              }}
              component="label"
            >
              <input
                type="file"
                hidden
                onChange={(e) => setFileToUpload(e.target.files[0])}
              />
              <FileUploadIcon sx={{ fontSize: 40, color: "#2c3e50", mb: 2 }} />
              <Typography sx={{ color: "#2c3e50" }}>
                {fileToUpload?.name || "Drag and drop files here or click to browse"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Supported formats: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG
              </Typography>
            </Box>

            {uploadCategory === "rental" && (
              <TextField
                fullWidth
                margin="normal"
                label="Unit Number"
                placeholder="e.g. A-101, B-203"
                size="small"
                value={uploadUnit}
                onChange={(e) => setUploadUnit(e.target.value)}
                sx={{ mt: 2 }}
              />
            )}

            {uploading && (
              <Box sx={{ width: "100%", mt: 2 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </Typography>
                <Box
                  sx={{
                    width: "100%",
                    backgroundColor: "#e0e0e0",
                    borderRadius: 5,
                    height: 8,
                    mt: 1,
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: "#2c3e50",
                      height: "100%",
                      borderRadius: 5,
                      width: `${uploadProgress}%`,
                      transition: "width 0.3s ease",
                    }}
                  />
                </Box>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ bgcolor: "#f8f9fa", p: 2 }}>
          <Button onClick={() => setOpenUploadDialog(false)} sx={{ color: "#2c3e50" }}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            variant="contained"
            disabled={!fileToUpload || uploading}
            sx={{
              bgcolor: "#2c3e50",
              "&:hover": { bgcolor: "#1a252f" },
              "&.Mui-disabled": { bgcolor: "rgba(44, 62, 80, 0.3)" },
            }}
          >
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notifications */}
      {message && (
        <Paper
          sx={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            bgcolor: message.toLowerCase().includes("error") ? "#ffebee" : "#e3fcec",
            color: message.toLowerCase().includes("error") ? "#d32f2f" : "#2e7d32",
            px: 3,
            py: 2,
            zIndex: 2000,
            minWidth: 200,
            textAlign: "center",
          }}
          elevation={3}
        >
          {message}
          <IconButton
            size="small"
            onClick={() => setMessage("")}
            sx={{ ml: 2, color: "inherit" }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Paper>
      )}

      {loading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            bgcolor: "rgba(255,255,255,0.65)",
            zIndex: 3000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress size={64} sx={{ color: "#1976d2" }} />
        </Box>
      )}
    </Box>
  );
};

export default LegalDocuments;