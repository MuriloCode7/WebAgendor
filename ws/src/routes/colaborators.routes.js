const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
//const pagarme = require("../services/pagarme");
const Colaborator = require("../models/Colaborator");
const CompanyColaborator = require("../models/relationship/CompanyColaborator");
const ColaboratorSpecialty = require("../models/relationship/ColaboratorSpecialty");

// Rota de criacao de colaborador
router.post("/", async (req, res) => {
  /**Para a criacao do colaborador é necessario criar uma sessao para
   * validar se todas as partes do cadastro foram bem sucedidas,
   * como a vinculacao com o pagarme. Em caso de erro a sessao é interrompida
   * e as alteracoes no bd sao desfeitas*/
  const db = mongoose.connection;
  const session = await db.startSession();
  session.startTransaction();

  try {
    const { colaborator, companyId } = req.body;
    let newColaborator = null;

    // Verificar se o colaborator já existe pelo email ou pelo telefone
    const existsColaborator = await Colaborator.findOne({
      $or: [{ email: colaborator.email }, { phone: colaborator.phone }],
    });

    if (!existsColaborator) {
      //Criar conta bancária
      /*
      const { bankAccount } = colaborator;
      const pagarmeBankAccount = await pagarme("bank_accounts", {
        agencia: bankAccount.agency,
        bank_code: bankAccount.bank,
        conta: bankAccount.number,
        conta_dv: bankAccount.dv,
        type: bankAccount.type,
        document_number: bankAccount.cpfCnpj,
        legal_name: bankAccount.holder,
      });

      if (pagarmeBankAccount.error) {
        throw pagarmeBankAccount;
      }

      //Criar recebedor
      const pagarmeRecipient = await pagarme("/recipients", {
        transfer_interval: "daily",
        transfer_enabled: true,
        bank_account_id: pagarmeBankAccount.data.id,
      });

      if (pagarmeRecipient.error) {
        throw pagarmeRecipient;
      }
      */

      // Criar colaborator
      newColaborator = await Colaborator({
        ...colaborator,
        //recipientId: pagarmeRecipient.data.id,
      }).save({ session });
    }

    // Relacionamento
    /** Atribuindo valor a uma variavel com condicional simplificada */
    const colaboratorId = existsColaborator
      ? existsColaborator._id // Se existir um colaborador pega o id dele
      : newColaborator._id; // Senão pega o id do criado no momento

    // Verifica se já existe o relacionamento com a empresa
    const existsRelationship = await CompanyColaborator.findOne({
      companyId,
      colaboratorId,
      status: { $ne: "E" },
    });

    // Se não está vinculado
    if (existsRelationship) {
      await CompanyColaborator.findOneAndUpdate(
        {
          companyId,
          colaboratorId,
        },
        { status: colaborator.statusBond },
        { session }
      );
    } else {
      await new CompanyColaborator({
        companyId,
        colaboratorId,
        status: colaborator.statusBond,
      }).save({ session });
    }

    //Relacionamento com as especialidades
    await ColaboratorSpecialty.insertMany(
      colaborator.specialties.map(
        (specialtyId) => ({
          specialtyId,
          colaboratorId,
        }),
        { session }
      )
    );

    await session.commitTransaction();
    session.endSession();

    if (existsColaborator && existsRelationship) {
      res.json({
        error: true,
        message: "Colaborator já cadastrado nessa empresa.",
      });
    } else {
      res.json({ error: false });
    }
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.json({ error: true, message: err.message });
  }
});

// Rota de update das infos do colaborador
router.put("/:colaboratorId", async (req, res) => {
  try {
    const { statusBond, bondId, specialties } = req.body;

    const { colaboratorId } = req.params;

    //Atualizando status do vinculo
    await CompanyColaborator.findByIdAndUpdate(bondId, { status: statusBond });

    //Atualizando especialidades do colaborador
    await ColaboratorSpecialty.deleteMany({ colaboratorId });

    await ColaboratorSpecialty.insertMany(
      specialties.map((specialtyId) => ({
        specialtyId,
        colaboratorId,
      }))
    );

    res.json({ error: false });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

//Rota para desvinculacao de colaborador com empresa
router.delete("/bond/:bondId", async (req, res) => {
  try {
    const { bondId } = req.params;

    await CompanyColaborator.findByIdAndUpdate(bondId, { status: "E" });

    res.json({ error: false, message: "Desvinculado com sucesso." });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

module.exports = router;
