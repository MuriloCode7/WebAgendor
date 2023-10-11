const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Colaborator = require('../models/Colaborator');

router.post('/', async (req, res) => {
  /**Para a criacao do colaborador é necessario criar uma sessao para
   * validar se todas as partes do cadastro foram bem sucedidas,
   * como a vinculacao com o pagarme. Em caso de erro a sessao é interrompida
   * e as alteracoes no bd sao desfeitas*/
  const db = mongoose.connection;
  const session = await db.startSession();

  try {
    const { colaborator, companyId } = req.body;

    // Verificar se o colaborator já existe pelo email ou pelo telefone
    const existsColaborator = await Colaborator.findOne({
      $or: [{ email: colaborator.email }, { phone: colaborator.phone }],
    });

    if(!existsColaborator){
      //Criar conta bancária
      const { bankAccount } = colaborator.bankAccount;

      

      //Criar recebedor
    }

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.json({ error: true, message: err.message });
  }
});

module.exports = router;
