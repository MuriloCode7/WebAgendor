const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const moment = require("moment");
//const pagarme = require("../services/pagarme");

const Customer = require("../models/Customer");
const Company = require("../models/Company");
const Specialty = require("../models/Specialty");
const Colaborator = require("../models/Colaborator");
const Schedule = require("../models/Schedule");
//const utils = require("../services/utils");
//const keys = require("../data/keys.json");

// Rota para criar um agendamento
router.post("/", async (req, res) => {
  const db = mongoose.connection;
  const session = await db.startSession();
  session.startTransaction();
  try {
    const { customerId, companyId, specialtyId, colaboratorId } = req.body;

    /*
      FAZER VERIFICACAO SE AINDA EXISTE AQUELE HORARIO DISPONIVEL
    */

    //Recuperar o cliente
    const customer = await Customer.findById(customerId).select(
      "nome address customerId"
    );

    //Recuperar o salao
    const company = await Company.findById(companyId).select("recipientId");

    //Recuperar o servico
    const specialty = await Specialty.findById(specialtyId).select(
      "price title commission"
    );

    //Recuperar o colaborador
    const colaborator = await Colaborator.findById(colaboratorId).select(
      "recipientId"
    );

    // Criar pagamento
    /*
    
    // O pagarme pede o valor em centavos
    const finalPrice = utils.toCents(specialty.price) * 100;

    //Colaborador split rules
    const colaboratorSplitRules = {
      recipient_id: colaborator.recipientId,
      amount: parseInt(finalPrice * (specialty.commission / 100)),
    };

    const createPayment = await pagarme("/transactions", {
      // Total
      amount: finalPrice,

      //Dados do cartao
      card_number: "4111111111111111",
      card_cvv: "123",
      card_expiration_date: "0830",
      card_holder_name: "Morpheus Fishburne",

      //Dados do cliente
      customer: {
        id: customer.customerId,
      },

      //Dados de endereco do cliente
      billing: {
        name: customer.name,
        address: {
          country: customer.address.country,
          state: customer.address.uf,
          city: customer.address.city,
          street: customer.address.street,
          street_number: customer.address.number,
          zipcode: customer.address.cep,
        },
      },

      //Itens da venda
      items: [
        {
          id: specialtyId,
          title: specialty.title,
          unit_price: finalPrice,
          quantity: 1,
          tangible: false,
        },
      ],
      split_rules: [
        // Taxa do salao
        {
          recipient_id: company.recipientId,
          amount: finalPrice - keys.app_fee - colaboratorSplitRule.amount,
        },
        // Taxa do colaborador
        colaboratorSplitRules,
        // Taxa do APP
        {
          recipient_id: keys.recipient_id,
          amount: keys.app_fee
        },
      ],
    });

    if (createPayment.error) {
      throw createPayment;
    }
     */

    //Criar agendamento
    const schedule = await new Schedule({
      ...req.body,
      //transactionId: createPayment.data.id,
      commission: specialty.commission,
      value: specialty.price,
    }).save({ session });

    await session.commitTransaction();
    session.endSession();

    res.json({ error: false, schedule });
  } catch (err) {
    await session.commitTransaction();
    session.endSession();
    res.json({ error: true, message: err.message });
  }
});

// Rota para listar todos os agendamentos de uma empresa dentro de um periodo
router.post("/filter", async (req, res) => {
  try {
    const { period, companyId } = req.body;

    const schedules = await Schedule.find({
      companyId,
      date: {
        $gte: moment(period.start).startOf("day"),
        $lte: moment(period.end).endOf("day"),
      },
    }).populate({path: 'specialtyId', select: 'title duration'})
      .populate({path: 'colaboratorId', select: 'name'})
      .populate({path: 'customerId', select: 'name'});
    res.json({ error: false, schedules });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

module.exports = router;
