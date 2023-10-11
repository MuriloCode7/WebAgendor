const express = require('express');
const router = express.Router();
const Schedule = require('../models/Schedule');

router.post('/', async (req, res) => {
  try {
    const schedule = await new Schedule(req.body).save();
    res.json({
      schedule,
    });
  } catch {
    res.json({ error: true, message: err.message });
  }
});

module.exports = router;
