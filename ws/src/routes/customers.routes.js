const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
//const pagarme = require("../services/pagarme");
const Customer = require("../models/Customer");
const CompanyCustomer = require("../models/relationship/CompanyCustomer");

// Rota para criacao de um cliente
router.post("/", async (req, res) => {
  /**Para a criacao do colaborador é necessario criar uma sessao para
   * validar se todas as partes do cadastro foram bem sucedidas,
   * como a vinculacao com o pagarme. Em caso de erro a sessao é interrompida
   * e as alteracoes no bd sao desfeitas*/
  const db = mongoose.connection;
  const session = await db.startSession();
  //session.startTransaction();

  try {
    const { customer, companyId } = req.body;
    let newCustomer = null;

    // Verificar se o customer já existe pelo email ou pelo telefone
    const existsCustomer = await Customer.findOne({
      $or: [{ email: customer.email }, { phone: customer.phone }],
    });

    if (!existsCustomer) {
      /* Para a criacao do cliente, nao criamos o id do cliente automaticamente
      pois precisamos de um id já cadastrado para criar o cliente no pagarme */
      const _id = new mongoose.Types.ObjectId();

      /*
      //Criar customer no pagarm
      const pagarmeCustomer = await pagarme("/customers", {
        external_id: _id,
        name: customer.name,
        type: customer.document.type === 'cpf' ? 'individual' : 'corporation',
        country: customer.address.country,
        email: customer.email,
        documents: [
          {
            type: customer.document.type,
            number: customer.document.number,
          },
        ],
        phone_numbers: [customer.phone],
        birthday: customer.dateBirth,
      });

      if (pagarmeCustomer.error) {
        throw pagarmeCustomer;
      }
      */

      // Criar cliente
      newCustomer = await Customer({
        ...customer,
        _id,
        customerId: _id, // Com o pagarme trocar pela linha debaixo
        //customerId: pagarmeCustomer.data.id,
      }).save({ session });
    }

    // Relacionamento
    /** Atribuindo valor a uma variavel com condicional simplificada */
    const customerId = existsCustomer
      ? existsCustomer._id // Se existir um colaborador pega o id dele
      : newCustomer._id; // Senão pega o id do criado no momento

    // Verifica se já existe o relacionamento com a empresa
    const existsRelationship = await CompanyCustomer.findOne({
      companyId,
      customerId,
      status: { $ne: "E" },
    });

    // Se não está vinculado
    if (existsRelationship) {
      await CompanyCustomer.findOneAndUpdate(
        {
          companyId,
          customerId,
        },
        { status: "A" },
        { session }
      );
    } else {
      await new CompanyCustomer({
        companyId,
        customerId, // Com o pagarme trocar pela linha debaixo
        //customerId: pagarmeCustomer.data.id,
      }).save({ session });
    }

    //await session.commitTransaction();
    session.endSession();

    if (existsCustomer && existsRelationship) {
      res.json({
        error: true,
        message: "Customer já cadastrado nessa empresa.",
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

//Rota para buscar clientes a partir de qualquer filtro.
router.post("/filter", async (req, res) => {
  try {
    const customers = await Customer.find(req.body.filters);

    res.json({ error: false, customers });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

//Rota para listar todos os clientes de uma empresa
router.get("/company/:companyId", async (req, res) => {
  try {
    const { companyId } = req.params;

    const customers = await CompanyCustomer.find({
      companyId,
      status: { $ne: "E" },
      /* Para que seja mostrado os dados do colaborador na busca, 
      damos um populate no id dele, que é uma chave estrangeira */
    })
      .populate("customerId")
      .select("customerId dateRegister");

    res.json({
      error: false,
      customers: customers.map((bond) => ({
        ...bond.customerId._doc,
        bondId: bond._id,
        dateRegister: bond.dateRegister,
      })),
    });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

//Rota para desvinculacao de cliente com empresa
router.delete("/bond/:bondId", async (req, res) => {
  try {
    const { bondId } = req.params;

    await CompanyCustomer.findByIdAndUpdate(bondId, { status: "E" });

    res.json({ error: false, message: "Desvinculado com sucesso." });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

module.exports = router;
