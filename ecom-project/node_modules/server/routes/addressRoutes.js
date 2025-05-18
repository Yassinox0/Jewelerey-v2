const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { Address } = require('../models');
const { Op } = require('sequelize');

// Get all addresses for the current user
router.get('/', protect, async (req, res) => {
  try {
    const addresses = await Address.findAll({
      where: { user_id: req.user.id },
      order: [['is_default', 'DESC'], ['created_at', 'DESC']]
    });
    res.json({ success: true, data: addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create a new address
router.post('/', protect, async (req, res) => {
  try {
    const { type, street, city, state, country, postal_code, is_default } = req.body;

    // If this is set as default, unset any existing default address
    if (is_default) {
      await Address.update(
        { is_default: false },
        { 
          where: { 
            user_id: req.user.id,
            type
          }
        }
      );
    }

    const address = await Address.create({
      user_id: req.user.id,
      type,
      street,
      city,
      state,
      country,
      postal_code,
      is_default
    });

    res.status(201).json({ success: true, data: address });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update an address
router.put('/:id', protect, async (req, res) => {
  try {
    const address = await Address.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    const { type, street, city, state, country, postal_code, is_default } = req.body;

    // If this is set as default, unset any existing default address
    if (is_default) {
      await Address.update(
        { is_default: false },
        { 
          where: { 
            user_id: req.user.id,
            type,
            id: { [Op.ne]: address.id }
          }
        }
      );
    }

    await address.update({
      type,
      street,
      city,
      state,
      country,
      postal_code,
      is_default
    });

    res.json({ success: true, data: address });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete an address
router.delete('/:id', protect, async (req, res) => {
  try {
    const address = await Address.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    await address.destroy();
    res.json({ success: true, message: 'Address deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Set an address as default
router.put('/:id/default', protect, async (req, res) => {
  try {
    const address = await Address.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    // Unset any existing default address of the same type
    await Address.update(
      { is_default: false },
      { 
        where: { 
          user_id: req.user.id,
          type: address.type,
          id: { [Op.ne]: address.id }
        }
      }
    );

    // Set this address as default
    await address.update({ is_default: true });
    res.json({ success: true, data: address });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router; 