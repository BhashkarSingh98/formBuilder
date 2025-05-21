const express = require('express');
const router = express.Router();
const {
  getAllForms,
  getFormById,
  createForm,
  updateForm,
  deleteForm,
  submitFormResponse,
  updateFormResponse,
  deleteFormResponse
} = require('../controllers/formController');

// Get all forms
router.get('/', getAllForms);

// Get a specific form with its responses
router.get('/:id', getFormById);

// Create a new form
router.post('/', createForm);

// Update a form
router.put('/:id', updateForm);

// Delete a form
router.delete('/:id', deleteForm);

// Submit a form response
router.post('/:id/responses', submitFormResponse);

// Update a form response
router.put('/:formId/responses/:responseId', updateFormResponse);

// Delete a form response
router.delete('/:formId/responses/:responseId', deleteFormResponse);

module.exports = router; 