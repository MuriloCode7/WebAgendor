const express = require("express");
const router = express.Router();
const _ = require("lodash");
const Schedule = require("../models/Schedule");
const ColaboratorSpecialty = require("../models/relationship/ColaboratorSpecialty");

router.post("/", async (req, res) => {
  try {
    const schedule = await new Schedule(req.body).save();
    res.json({
      schedule,
    });
  } catch {
    res.json({ error: true, message: err.message });
  }
});

// Rota para listar horarios de uma empresa
router.get("/company/:companyId", async (req, res) => {
  try {
    const { companyId } = req.params;

    const schedules = await Schedule.find({
      companyId,
    });
    res.json({ error: false, schedules });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

// Rota para atualizar um horario
router.put("/:scheduleId", async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const schedule = req.body;

    await Schedule.findByIdAndUpdate(scheduleId, schedule);
    res.json({ error: false, schedule });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

// Rota para excluir um horário
router.delete("/:scheduleId", async (req, res) => {
  try {
    const { scheduleId } = req.params;

    await Schedule.findByIdAndDelete(scheduleId);
    res.json({ error: false });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

// Rota para listar todos os colaboradores que tem as especialidades informadas
router.post("/colaborators", async (req, res) => {
  try {
    const colaboratorsSpecialty = await ColaboratorSpecialty.find({
      specialtyId: { $in: req.body.specialties },
      status: "A",
    })
      .populate("colaboratorId", "name")
      .select("colaboratorId -_id");

    /* Para retornar apenas um registro de colaborador com especialidades, 
    usamos o metodo uniqBy da lib lodash */
    const listColaborators = _.uniqBy(colaboratorsSpecialty, (bond) =>
      bond.colaboratorId._id.toString()
    ).map((bond) => ({
      label: bond.colaboratorId.name,
      value: bond.colaboratorId._id,
    }));

    res.json({ error: false, colaborators: listColaborators });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

module.exports = router;
