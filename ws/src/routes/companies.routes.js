const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const Specialty = require('../models/Specialty');
const turf = require('@turf/turf');

// Rota para criacao de uma empresa
router.post('/', async (req, res) => {
  try {
    const company = await new Company(req.body).save();
    res.json({ company });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

// Rota para listar todos as especialidades nao excluidas de uma empresa
router.get('/specialties/:companyId', async (req, res) => {
  try {
    const { companyId } = req.params;
    const specialties = await Specialty.find({
      companyId,
      status: { $ne: 'E' },
    }).select('_id title');

    res.json({
      specialties: specialties.map(s => ({ label: s.title, value: s._id })),
    });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

//Rota para listar uma empresa pelo id
router.get('/:id', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id).select(
      'cover name address.city geo.coordinates phone',
    );
    
    /**Calculo da distancia do usuario até a empresa */
    const distance = turf.distance(
      turf.point(company.geo.coordinates),
      turf.point([-30.043858, -51.103487])
    );

    res.json({
      error: false,
      company,
      distance
    });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

module.exports = router;
