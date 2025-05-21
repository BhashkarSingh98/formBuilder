import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Alert,
  Divider,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

function FormView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [editingResponse, setEditingResponse] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      fetchForm();
      hasFetched.current = true;
    }
  }, [id]);

  const fetchForm = async () => {
    try {
      const response = await axios.get(`/api/forms/${id}?fetchFormResponse=true`);
      setForm(response.data.form);
      setResponses(response.data.responses);
      setLoading(false);
    } catch (error) {
      setError('Error loading form');
      setLoading(false);
    }
  };

  const handleInputChange = (fieldId, value) => {
    setFormData({
      ...formData,
      [fieldId]: value
    });
  };

  const handleEditInputChange = (fieldId, value) => {
    setEditFormData({
      ...editFormData,
      [fieldId]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate required fields
      const formElement = e.target;
      if (!formElement.checkValidity()) {
        formElement.reportValidity();
        return;
      }

      setSubmitting(true);
      setError(null);

      const responseData = form.fields.map(field => ({
        fieldId: field._id,
        value: formData[field._id] || ''
      }));

      await axios.post(`/api/forms/${id}/responses`, {
        responses: responseData
      });

      setFormData({});
      await fetchForm();
      setSubmitting(false);
    } catch (error) {
      setError('Error submitting form');
      setSubmitting(false);
    }
  };

  const handleEditResponse = (response) => {
    const initialData = {};
    response.responses.forEach(item => {
      initialData[item.fieldId] = item.value;
    });
    setEditFormData(initialData);
    setEditingResponse(response);
    setEditDialogOpen(true);
  };

  const handleUpdateResponse = async () => {
    try {
      const responseData = form.fields.map(field => ({
        fieldId: field._id,
        value: editFormData[field._id] || ''
      }));

      await axios.put(`/api/forms/${id}/responses/${editingResponse._id}`, {
        responses: responseData
      });

      setEditDialogOpen(false);
      setEditingResponse(null);
      await fetchForm();
    } catch (error) {
      setError('Error updating response');
    }
  };

  const handleDeleteResponse = async (responseId) => {
    if (window.confirm('Are you sure you want to delete this response?')) {
      try {
        await axios.delete(`/api/forms/${id}/responses/${responseId}`);
        await fetchForm();
      } catch (error) {
        setError('Error deleting response');
      }
    }
  };

  const ResponsesTable = ({ responses, form, onEdit, onDelete }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

    return (
      <Box sx={{ width: '100%', mt: 4 }}>
        <Box sx={{ overflowX: 'auto' }}>
          <TableContainer 
            component={Paper} 
            sx={{ 
              boxShadow: '0 2px 12px 0 rgba(0,0,0,0.05)',
              minWidth: isMobile ? 650 : '100%',
              maxWidth: '100%'
            }}
          >
            <Table sx={{ minWidth: 650 }} aria-label="responses table">
              <TableHead>
                <TableRow sx={{ bgcolor: 'primary.dark' }}>
                  <TableCell 
                    sx={{ 
                      color: 'white', 
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      minWidth: isMobile ? '120px' : 'auto'
                    }}
                  >
                    Submitted Date
                  </TableCell>
                  {form.fields.map((field) => (
                    <TableCell 
                      key={field._id} 
                      sx={{ 
                        color: 'white', 
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        minWidth: isMobile ? '120px' : 'auto'
                      }}
                    >
                      {field.label}
                    </TableCell>
                  ))}
                  <TableCell 
                    sx={{ 
                      color: 'white', 
                      fontWeight: 600, 
                      align: 'right',
                      whiteSpace: 'nowrap',
                      minWidth: isMobile ? '100px' : 'auto'
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {responses
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((response, index) => (
                    <TableRow
                      key={response._id}
                      sx={{ 
                        '&:nth-of-type(odd)': { bgcolor: 'action.hover' },
                        '&:hover': { bgcolor: 'action.selected' }
                      }}
                    >
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>
                        {new Date(response.submittedAt).toLocaleString()}
                      </TableCell>
                      {form.fields.map((field) => {
                        const responseItem = response.responses.find(r => r.fieldId === field._id);
                        return (
                          <TableCell 
                            key={field._id}
                            sx={{ 
                              maxWidth: isMobile ? '200px' : 'none',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {field.type === 'checkbox' ? (
                              <Chip
                                label={responseItem?.value ? 'Yes' : 'No'}
                                color={responseItem?.value ? 'success' : 'default'}
                                size="small"
                              />
                            ) : (
                              <Typography 
                                sx={{ 
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {responseItem?.value || '-'}
                              </Typography>
                            )}
                          </TableCell>
                        );
                      })}
                      <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                        <Box sx={{ 
                          display: 'flex', 
                          gap: 1, 
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}>
                          <Tooltip title="Edit Response">
                            <IconButton
                              size="small"
                              onClick={() => onEdit(response)}
                              color="primary"
                              sx={{
                                '&:hover': {
                                  bgcolor: 'primary.light',
                                  color: 'white'
                                }
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Response">
                            <IconButton
                              size="small"
                              onClick={() => onDelete(response._id)}
                              color="error"
                              sx={{
                                '&:hover': {
                                  bgcolor: 'error.light',
                                  color: 'white'
                                }
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={responses.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            '.MuiTablePagination-select': {
              m: 0
            },
            '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
              m: 0
            }
          }}
        />
      </Box>
    );
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!form) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">Form not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: { xs: 2, sm: 3, md: 4 }, mb: { xs: 2, sm: 3, md: 4 }, px: { xs: 2, sm: 3 } }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: { xs: 2, sm: 3, md: 4 }, 
          borderRadius: 3, 
          bgcolor: 'background.default',
          boxShadow: '0 2px 12px 0 rgba(0,0,0,0.05)'
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2, 
          mb: { xs: 2, sm: 3 } 
        }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 600, 
              color: 'primary.main',
              fontSize: { xs: '1.5rem', sm: '2rem' }
            }}
          >
            {form.title}
          </Typography>
        </Box>

        <Divider sx={{ mb: { xs: 2, sm: 3, md: 4 } }} />

        <form onSubmit={handleSubmit}>
          {form.fields.map((field) => (
            <Box 
              key={field._id} 
              sx={{ 
                mb: { xs: 1, sm: 1, md: 1 },
                '& .MuiFormControl-root': {
                  width: '100%'
                }
              }}
            >
              {field.type === 'checkbox' ? (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData[field._id] || false}
                      onChange={(e) => handleInputChange(field._id, e.target.checked)}
                      required={field.required}
                      sx={{
                        '&.Mui-checked': {
                          color: 'primary.main',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body1" color="text.primary">
                      {field.label}
                    </Typography>
                  }
                />
              ) : (
                <TextField
                  fullWidth
                  type={field.type}
                  label={field.label}
                  value={formData[field._id] || ''}
                  onChange={(e) => handleInputChange(field._id, e.target.value)}
                  required={field.required}
                  margin="normal"
                  InputProps={{
                    sx: { 
                      borderRadius: 2,
                      bgcolor: 'background.paper'
                    }
                  }}
                  InputLabelProps={{
                    sx: { color: 'text.secondary' }
                  }}
                />
              )}
            </Box>
          ))}

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            gap: { xs: 1, sm: 2 }, 
            mt: { xs: 2, sm: 3, md: 4 },
            flexDirection: { xs: 'column', sm: 'row' }
          }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/')}
              sx={{ 
                borderRadius: 2, 
                px: 3,
                py: 1.5,
                width: { xs: '100%', sm: 'auto' }
              }}
            >
              Back to Forms
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              sx={{ 
                borderRadius: 2, 
                px: 3,
                py: 1.5,
                width: { xs: '100%', sm: 'auto' }
              }}
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </Button>
          </Box>
        </form>

        {responses.length > 0 && (
          <Box sx={{ mt: { xs: 4, sm: 6, md: 8 } }}>
            <Typography 
              variant="h5" 
              gutterBottom 
              sx={{ 
                fontWeight: 600,
                color: 'text.primary',
                mb: { xs: 2, sm: 3 },
                fontSize: { xs: '1.25rem', sm: '1.5rem' }
              }}
            >
              Previous Responses
            </Typography>
            <Divider sx={{ mb: { xs: 2, sm: 3, md: 4 } }} />
            <ResponsesTable 
              responses={responses}
              form={form}
              onEdit={handleEditResponse}
              onDelete={handleDeleteResponse}
            />
          </Box>
        )}
      </Paper>

      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { 
            p: 1,
            width: { xs: '95%', sm: 'auto' },
            maxWidth: '600px'
          }
        }}
      >
        <DialogTitle sx={{ 
          fontWeight: 600,
          color: 'primary.main',
          fontSize: { xs: '1.25rem', sm: '1.5rem' }
        }}>
          Edit Response
        </DialogTitle>
        <DialogContent sx={{ px: { xs: 2, sm: 3 }, width: isMobile ? 'auto' : '350px' }}>
          {form?.fields.map((field) => (
            <Box key={field._id} sx={{ mb: { xs: 2, sm: 3 }, mt: { xs: 1, sm: 2 } }}>
              {field.type === 'checkbox' ? (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={editFormData[field._id] || false}
                      onChange={(e) => handleEditInputChange(field._id, e.target.checked)}
                      required={field.required}
                      sx={{
                        '&.Mui-checked': {
                          color: 'primary.main',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body1" color="text.primary">
                      {field.label}
                    </Typography>
                  }
                />
              ) : (
                
                <TextField
                  fullWidth
                  type={field.type}
                  label={field.label}
                  value={editFormData[field._id] || ''}
                  onChange={(e) => handleEditInputChange(field._id, e.target.value)}
                  required={field.required}
                  InputProps={{
                    sx: { 
                      borderRadius: 2,
                      bgcolor: 'background.paper'
                    }
                  }}
                  InputLabelProps={{
                    sx: { color: 'text.secondary' }
                  }}
                />
              )}
            </Box>
          ))}
        </DialogContent>
        <DialogActions sx={{ p: { xs: 2, sm: 3 } }}>
          <Button 
            onClick={() => setEditDialogOpen(false)}
            sx={{ 
              borderRadius: 2,
              px: 3,
              width: { xs: '100%', sm: 'auto' }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUpdateResponse}
            variant="contained"
            sx={{ 
              borderRadius: 2,
              px: 3,
              width: { xs: '100%', sm: 'auto' }
            }}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default FormView; 