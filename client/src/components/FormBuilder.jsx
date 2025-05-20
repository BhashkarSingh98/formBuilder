import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  IconButton,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Tooltip,
  Card,
  CardContent,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import axios from 'axios';

function FormBuilder() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [fields, setFields] = useState([{
    type: 'text',
    label: '',
    required: false
  }]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [bulkAddDialog, setBulkAddDialog] = useState(false);
  const [bulkFields, setBulkFields] = useState('');
  const hasFetched = useRef(false);

  useEffect(() => {
    if (id && !hasFetched.current) {
      fetchForm();
      hasFetched.current = true;
    }
  }, [id]);

  const fetchForm = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/forms/${id}`);
      const formData = response.data.form;
      setTitle(formData.title);
      setFields(formData.fields);
      setIsEditing(true);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching form:', error);
      setError('Error loading form data');
      setLoading(false);
      setSnackbar({
        open: true,
        message: 'Error loading form data',
        severity: 'error'
      });
    }
  };

  const addField = () => {
    setFields([
      ...fields,
      {
        type: 'text',
        label: '',
        required: false
      }
    ]);
  };

  const addMultipleFields = () => {
    const fieldLabels = bulkFields.split('\n').filter(label => label.trim() !== '');
    const newFields = fieldLabels.map(label => ({
      type: 'text',
      label: label.trim(),
      required: false
    }));
    setFields([...fields, ...newFields]);
    setBulkFields('');
    setBulkAddDialog(false);
  };

  const removeField = (index) => {
    const newFields = [...fields];
    newFields.splice(index, 1);
    setFields(newFields);
  };

  const updateField = (index, field) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], ...field };
    setFields(newFields);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || fields.length === 0) return;
    
    try {
      setLoading(true);
      if (isEditing) {
        await axios.put(`/api/forms/${id}`, {
          title,
          fields
        });
        setSnackbar({
          open: true,
          message: 'Form updated successfully',
          severity: 'success'
        });
      } else {
        await axios.post('/api/forms', {
          title,
          fields
        });
        setSnackbar({
          open: true,
          message: 'Form created successfully',
          severity: 'success'
        });
      }
      setTimeout(() => {
        navigate('/');
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error saving form:', error);
      setError('Error saving form');
      setLoading(false);
      setSnackbar({
        open: true,
        message: 'Error saving form',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          zIndex: 9999
        }}
      >
        <CircularProgress size={40} />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      width: '100%',
      maxWidth: '100%',
      overflowX: 'hidden',
      minHeight: '100vh',
      bgcolor: 'background.default'
    }}>
      <Container 
        maxWidth="lg" 
        sx={{ 
          py: { xs: 2, sm: 3, md: 4 },
          px: { xs: 1, sm: 2, md: 3 }
        }}
      >
        <Paper 
          elevation={0} 
          sx={{ 
            p: { xs: 2, sm: 3, md: 4 }, 
            borderRadius: 2, 
            bgcolor: 'background.paper',
            width: { xs: '100%', md: '70%' },
            mx: 'auto',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: { xs: 2, sm: 3, md: 4 },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 0 }
          }}>
            <IconButton 
              onClick={() => navigate('/')}
              sx={{ 
                mr: { sm: 2 },
                alignSelf: { xs: 'flex-start', sm: 'center' }
              }}
              color="primary"
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                fontWeight: 600, 
                color: 'primary.main',
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
              }}
            >
              {isEditing ? 'Edit Form' : 'Create New Form'}
            </Typography>
          </Box>

          <Divider sx={{ mb: { xs: 2, sm: 3, md: 4 } }} />

          {error && (
            <Alert severity="error" sx={{ mb: { xs: 2, sm: 3 } }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Card elevation={2} sx={{ mb: { xs: 2, sm: 3, md: 4 }, borderRadius: 2 }}>
              <CardContent>
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  sx={{ 
                    mb: { xs: 2, sm: 3 },
                    fontSize: { xs: '1.1rem', sm: '1.25rem' }
                  }}
                >
                  Form Details
                </Typography>
                <TextField
                  fullWidth
                  label="Form Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  sx={{ mb: 2 }}
                  InputProps={{
                    sx: { borderRadius: 2 }
                  }}
                />
              </CardContent>
            </Card>
            
            <Box sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: { xs: 2, sm: 3 },
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 2, sm: 0 }
              }}>
                <Typography 
                  variant="h6"
                  sx={{ 
                    fontSize: { xs: '1.1rem', sm: '1.25rem' }
                  }}
                >
                  Form Fields
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  gap: 2,
                  width: { xs: '100%', sm: 'auto' },
                  flexDirection: { xs: 'column', sm: 'row' }
                }}>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => setBulkAddDialog(true)}
                    variant="outlined"
                    sx={{ 
                      borderRadius: 2,
                      width: { xs: '100%', sm: 'auto' }
                    }}
                  >
                    Add Multiple Fields
                  </Button>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={addField}
                    variant="outlined"
                    sx={{ 
                      borderRadius: 2,
                      width: { xs: '100%', sm: 'auto' }
                    }}
                  >
                    Add Single Field
                  </Button>
                </Box>
              </Box>
              
              {fields.map((field, index) => (
                <Card 
                  key={index} 
                  elevation={2}
                  sx={{ 
                    mb: 2, 
                    borderRadius: 2,
                    transition: 'transform 0.2s',
                   
                  }}
                >
                  <CardContent>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2, 
                      flexDirection: { xs: 'column', sm: 'row' },
                      flexWrap: { sm: 'wrap' }
                    }}>
                      <FormControl sx={{ 
                        width: { xs: '100%', sm: 'auto' },
                        minWidth: { sm: 150 }
                      }}>
                        <InputLabel>Field Type</InputLabel>
                        <Select
                          value={field.type}
                          label="Field Type"
                          onChange={(e) => updateField(index, { type: e.target.value })}
                          sx={{ borderRadius: 2 }}
                        >
                          <MenuItem value="text">Text Input</MenuItem>
                          <MenuItem value="email">Email</MenuItem>
                          <MenuItem value="password">Password</MenuItem>
                          <MenuItem value="checkbox">Checkbox</MenuItem>
                        </Select>
                      </FormControl>
                      
                      <TextField
                        label="Field Label"
                        value={field.label}
                        onChange={(e) => updateField(index, { label: e.target.value })}
                        required
                        sx={{ 
                          flexGrow: 1,
                          width: { xs: '100%', sm: 'auto' }
                        }}
                        InputProps={{
                          sx: { borderRadius: 2 }
                        }}
                      />
                      
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={field.required}
                            onChange={(e) => updateField(index, { required: e.target.checked })}
                          />
                        }
                        label="Required"
                      />
                      
                      <Tooltip title="Remove Field">
                        <IconButton
                          color="error"
                          onClick={() => removeField(index)}
                          sx={{ alignSelf: { xs: 'flex-end', sm: 'center' } }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              gap: 2,
              flexDirection: { xs: 'column', sm: 'row' },
              mt: { xs: 3, sm: 4 }
            }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/')}
                sx={{ 
                  borderRadius: 2, 
                  width: { xs: '100%', sm: 'auto' }
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={!title || fields.length === 0 || loading}
                startIcon={<SaveIcon />}
                sx={{ 
                  borderRadius: 2, 
                  width: { xs: '100%', sm: 'auto' }
                }}
              >
                {isEditing ? 'Update Form' : 'Create Form'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>

      <Dialog
        open={bulkAddDialog}
        onClose={() => setBulkAddDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { 
            borderRadius: 2,
            m: { xs: 2, sm: 3 }
          }
        }}
      >
        <DialogTitle>Add Multiple Fields</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Enter one field label per line. Each line will create a new text input field.
          </Typography>
          <TextField
            multiline
            rows={6}
            fullWidth
            value={bulkFields}
            onChange={(e) => setBulkFields(e.target.value)}
            placeholder="First Name&#10;Last Name&#10;Email&#10;Phone Number"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: { xs: 2, sm: 3 } }}>
          <Button 
            onClick={() => setBulkAddDialog(false)}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={addMultipleFields}
            variant="contained"
            sx={{ borderRadius: 2 }}
          >
            Add Fields
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default FormBuilder; 