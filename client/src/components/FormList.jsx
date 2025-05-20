import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Alert,
  Box,
  Paper,
  IconButton,
  Tooltip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';

function FormList() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formToDelete, setFormToDelete] = useState(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      fetchForms();
      hasFetched.current = true;
    }
  }, []);

  const fetchForms = async () => {
    try {
      const response = await axios.get('/api/forms');
      setForms(response.data);
      setLoading(false);
    } catch (error) {
      setError('Error loading forms');
      setLoading(false);
    }
  };

  const handleDeleteClick = (form) => {
    setFormToDelete(form);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/api/forms/${formToDelete._id}`);
      setForms(forms.filter(form => form._id !== formToDelete._id));
      setDeleteDialogOpen(false);
      setFormToDelete(null);
    } catch (error) {
      console.error('Error deleting form:', error);
    }
  };

  const handleEditClick = (formId) => {
    navigate(`/edit/${formId}`);
  };

  const handleViewClick = (formId) => {
    navigate(`/form/${formId}`);
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

  return (
    <Container maxWidth="lg" sx={{ mt: { xs: 2, sm: 3, md: 4 }, mb: { xs: 2, sm: 3, md: 4 }, px: { xs: 2, sm: 3 } }}>
      <Paper elevation={0} sx={{ borderRadius: 2, bgcolor: 'background.default' }}>
        <Box sx={{
          mt: { xs: 4, sm: 5, md: 6 },
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: { xs: 2, sm: 0 },
          mb: 3,
          pt: 0
        }}>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 600, 
              color: 'primary.main',
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
            }}
          >
            Available Forms
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/create')}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              px: 3,
              width: { xs: '100%', sm: 'auto' }
            }}
          >
            Create New Form
          </Button>
        </Box>

        <Divider sx={{ mb: { xs: 2, sm: 3, md: 4 } }} />
        
        {forms.length === 0 ? (
          <Box sx={{ 
            textAlign: 'center', 
            py: { xs: 4, sm: 6, md: 8 },
            px: { xs: 2, sm: 3 },
            bgcolor: 'background.paper',
            borderRadius: 2,
            border: '2px dashed',
            borderColor: 'divider',
            mx: { xs: 1, sm: 2 }
          }}>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              No Forms Available
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
              Get started by creating your first form
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => navigate('/create')}
              sx={{ borderRadius: 2 }}
            >
              Create Form
            </Button>
          </Box>
        ) : (
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {forms.map((form) => (
              <Grid item xs={12} sm={6} md={4} key={form._id}>
                <Card 
                  elevation={2}
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    bgcolor: 'background.paper',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }}>
                    <Typography 
                      variant="h6" 
                      gutterBottom 
                      sx={{ 
                        fontWeight: 500,
                        fontSize: { xs: '1.1rem', sm: '1.25rem' }
                      }}
                    >
                      {form.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                      {form.fields.length} {form.fields.length === 1 ? 'field' : 'fields'}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Created {new Date(form.createdAt).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                  <Divider />
                  <CardActions sx={{ 
                    p: { xs: 1.5, sm: 2 }, 
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 1
                  }}>
                    <Tooltip title="View Form">
                      <IconButton 
                        color="primary"
                        onClick={() => handleViewClick(form._id)}
                        size={isMobile ? "medium" : "small"}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Form">
                      <IconButton 
                        color="secondary"
                        onClick={() => handleEditClick(form._id)}
                        size={isMobile ? "medium" : "small"}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Form">
                      <IconButton 
                        color="error"
                        onClick={() => handleDeleteClick(form)}
                        size={isMobile ? "medium" : "small"}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: { 
            borderRadius: 2,
            width: { xs: '90%', sm: 'auto' },
            maxWidth: '500px'
          }
        }}
      >
        <DialogTitle>Delete Form</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{formToDelete?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 3 } }}>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            sx={{ borderRadius: 2 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default FormList; 