const express = require('express');
const router = express.Router();
const Form = require('../models/Form');
const FormResponse = require('../models/FormResponse');

// Get all forms
router.get('/', async (req, res) => {
  try {
    const forms = await Form.find().sort({ createdAt: -1 });
    res.json(forms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific form with its responses
router.get('/:id', async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    let responses;
    if (req.query.fetchFormResponse == 'true') {
      responses = await FormResponse.find({ formId: req.params.id }).sort({ submittedAt: -1 });
    }
    res.json({ form, responses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new form
router.post('/', async (req, res) => {
  const form = new Form({
    title: req.body.title,
    fields: req.body.fields
  });

  try {
    const newForm = await form.save();
    res.status(201).json(newForm);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a form
router.put('/:id', async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    form.title = req.body.title;
    form.fields = req.body.fields;
    form.updatedAt = Date.now();

    const updatedForm = await form.save();
    res.json(updatedForm);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a form
router.delete('/:id', async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    await form.deleteOne();
    res.json({ message: 'Form deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit a form response
router.post('/:id/responses', async (req, res) => {
  const response = new FormResponse({
    formId: req.params.id,
    responses: req.body.responses
  });

  try {
    const newResponse = await response.save();
    res.status(201).json(newResponse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a form response
router.put('/:formId/responses/:responseId', async (req, res) => {
  try {
    const { formId, responseId } = req.params;
    const { responses } = req.body;

    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    const response = await FormResponse.findById(responseId);
    if (!response) {
      return res.status(404).json({ message: 'Response not found' });
    }

    // Validate that all required fields are present
    const requiredFields = form.fields.filter(field => field.required);
    const missingRequired = requiredFields.filter(field => {
      const responseField = responses.find(r => r.fieldId === field._id.toString());
      return !responseField || !responseField.value;
    });

    if (missingRequired.length > 0) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        missingFields: missingRequired.map(field => field.label)
      });
    }

    // Update the response
    response.responses = responses;
    response.updatedAt = new Date();
    await response.save();

    res.json({ 
      message: 'Response updated successfully',
      response
    });
  } catch (error) {
    console.error('Error updating response:', error);
    res.status(500).json({ message: 'Error updating response' });
  }
});

// Delete a form response
router.delete('/:formId/responses/:responseId', async (req, res) => {
  try {
    const { formId, responseId } = req.params;

    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    const response = await FormResponse.findById(responseId);
    if (!response) {
      return res.status(404).json({ message: 'Response not found' });
    }

    await FormResponse.deleteOne({ _id: responseId });
    res.json({ message: 'Response deleted successfully' });
  } catch (error) {
    console.error('Error deleting response:', error);
    res.status(500).json({ message: 'Error deleting response' });
  }
});

module.exports = router; 