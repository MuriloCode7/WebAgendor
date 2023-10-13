const express = require("express");
const router = express.Router();
const _ = require("lodash");
const TimeTable = require("../models/TimeTable");
const ColaboratorSpecialty = require("../models/relationship/ColaboratorSpecialty");

router.post("/", async (req, res) => {
  try {
    const timeTable = await new TimeTable(req.body).save();
    res.json({
      timeTable,
    });
  } catch {
    res.json({ error: true, message: err.message });
  }
});

// Rota para listar horarios de uma empresa
router.get("/company/:companyId", async (req, res) => {
  try {
    const { companyId } = req.params;

    const timeTables = await TimeTable.find({
      companyId,
    });
    res.json({ error: false, timeTables });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

// Rota para atualizar um horario
router.put("/:timeTableId", async (req, res) => {
  try {
    const { timeTableId } = req.params;
    const timeTable = req.body;

    await TimeTable.findByIdAndUpdate(timeTableId, timeTable);
    res.json({ error: false, timeTable });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

// Rota para excluir um horário
router.delete("/:timeTableId", async (req, res) => {
  try {
    const { timeTableId } = req.params;

    await TimeTable.findByIdAndDelete(timeTableId);
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
