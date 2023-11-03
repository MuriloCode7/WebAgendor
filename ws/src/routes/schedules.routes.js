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
const timeTable = require("../models/TimeTable");
const TimeTable = require("../models/TimeTable");
const utils = require("../services/utils");
const _ = require("lodash");
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
    })
      .populate({ path: "specialtyId", select: "title duration" })
      .populate({ path: "colaboratorId", select: "name" })
      .populate({ path: "customerId", select: "name" });
    res.json({ error: false, schedules });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

/* IMPORTANTE: Rota responsavel por atraves de um servico ver na agenda quais são os
dias disponiveis, os horarios disponiveis para esses dias e os colaboradores
*/
router.post("/availableDays", async (req, res) => {
  try {
    const { date, companyId, specialtyId } = req.body;
    const timeTables = await TimeTable.find({ companyId });
    const specialty = await Specialty.findById(specialtyId).select("duration");

    let calendar = [];
    let firstDay = moment(date);
    let colaborators = [];

    // Duracao do servico sendo convertida para minutos
    const specialtyMinutes = utils.hourToMinutes(
      moment(specialty.duration).format("HH:mm")
    );

    /* Chama a funcao que calcula quantos slots da agenda serão necessarios
    para colocar o servico 
    1 - Essa funcao recebe a duracao do servico como um DateTime e define como horario inicial
    2 - Passa o horario final sendo a duracao + ele mesmo ex.: 01:30 + 01:30 = 03:00
    3 - Passa o intervalo que a agenda é formada, ex: de 30min em 30 min
    4 - Calcula quantos espacos de 30 minutos cabem desse intervalo de horarios
    5 - Por fim, retorna a quantidade de espacos
    */
    const specialtySlots = utils.sliceMinutes(
      specialty.duration, // inicio
      moment(specialty.duration).add(specialtyMinutes, "minutes"),
      utils.SLOT_DURATION
    ).length;

    /* Procurar dias disponiveis no intervalo de um ano até a o numero de dias disponiveis ser
    igual a 7 */
    //for (let i = 0; i <= 365 && calendar.length < 7; i++) {
    const validTimeTables = timeTables.filter((timeTable) => {
      // Recebe true se o dia da semana escolhido está disponivel no horario
      const availableDaysWeek = timeTable.days.includes(moment(firstDay).day());

      // Recebe true se o servico stá disponivel no horario
      const availableSpecialty = timeTable.specialties.includes(specialtyId);

      return availableDaysWeek && availableSpecialty;
    });

    /*
        Todos os colaboradores disponiveis no dia e seus horarios
        */
    if (validTimeTables.length > 0) {
      let allTimeTablesDay = {};

      for (let timeTable of validTimeTables) {
        for (let colaboratorId of timeTable.colaborators) {
          /* Se nao existir horarios definidos para o colaborador que esta sendo verifica, 
            estes serao definidos */
          if (!allTimeTablesDay[colaboratorId]) {
            allTimeTablesDay[colaboratorId] = [];
          }

          // Pega todos os horarios validos e joga para dentro do colaborador
          allTimeTablesDay[colaboratorId] = [
            ...allTimeTablesDay[colaboratorId],
            ...utils.sliceMinutes(
              utils.mergeDateTime(firstDay, timeTable.startTime),
              utils.mergeDateTime(firstDay, timeTable.endTime),
              utils.SLOT_DURATION
            ),
          ];
        }
      }

      /* Ocupacao de cada colaborador no dia  */
      for (let colaboratorId of Object.keys(allTimeTablesDay)) {
        // Recuperar agendamentos
        const schedules = await Schedule.find({
          colaboratorId,
          date: {
            $gte: moment(firstDay).startOf("day"),
            $lte: moment(firstDay).endOf("day"),
          },
        })
          .select("date specialtyId -_id")
          .populate("specialtyId", "duration");

        // Recuperar horarios agendados/indisponiveis
        let unavailableTimeTables = schedules.map((schedule) => ({
          startTime: moment(schedule.date),
          endTime: moment(schedule.date).add(
            utils.hourToMinutes(
              moment(schedule.specialtyId.duration).format("HH:mm")
            ),
            "minutes"
          ),
        }));

        // Conversao dos horarios ocupados para a hora de cada slot da agenda, ex: ['07:30', '08:00', '08:30']
        unavailableTimeTables = unavailableTimeTables
          .map(
            (timeTable) =>
              utils.sliceMinutes(
                timeTable.startTime,
                timeTable.endTime,
                utils.SLOT_DURATION
              )
            /* O flat() une arrays */
          )
          .flat();

        // Removendo todos os horarios cupados
        let freeTimeTables = utils
          .splitByValue(
            allTimeTablesDay[colaboratorId].map((freeTimeTable) => {
              return unavailableTimeTables.includes(freeTimeTable)
                ? "-"
                : freeTimeTable;
            }),
            "-"
          )
          .filter((freeTimeTable) => freeTimeTable.length > 0);

        // Verificando se existe espaço suficiente nos horarios disponiveis
        freeTimeTables = freeTimeTables.filter(
          (timeTable) => timeTable.length >= specialtySlots
        );

        /* Verificando se os horarios dentro do slot tem a continuidade necessaria */
        freeTimeTables = freeTimeTables
          .map((slot) =>
            slot.filter(
              (timeTable, index) => slot.length - index >= specialtySlots
            )
          )
          .flat();

        /* formatando os horarios de 2 em 2 para exibicao no app */
        freeTimeTables = _.chunk(freeTimeTables, 2);

        /* Remover colaborador caso não tenha disponibilidade */
        if (freeTimeTables.length === 0) {
          allTimeTablesDay = _.omit(allTimeTablesDay, colaboratorId);
        } else {
          allTimeTablesDay[colaboratorId] = freeTimeTables;
        }

        /*
          Atribui para o colaborador somente os horários que foram calculados como
          disponiveis tendo como base a duracao do servico
          */
        allTimeTablesDay[colaboratorId] = freeTimeTables;
      }

      /* Verificar se tem colaboradores disponiveis naquele dia */
      const totalColaborators = Object.keys(allTimeTablesDay).length;

      if (totalColaborators > 0) {
        colaborators.push(Object.keys(allTimeTablesDay));
        calendar.push({
          [firstDay.format("YYYY-MM-DD")]: allTimeTablesDay,
        });
      }
    }

    firstDay = firstDay.add(1, "day");
    //}

    /* Recuperando dados dos colaboradores */
    colaborators = _.uniq(colaborators.flat());

    colaborators = await Colaborator.find({
      _id: { $in: colaborators },
    }).select("name avatar");

    colaborators = colaborators.map((c) => ({
      ...c._doc,
    }));

    res.json({
      error: false,
      colaborators,
      calendar,
    });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

router.delete("/:scheduleId", async (req, res) => {
  try {
    const { scheduleId } = req.params;

    await Schedule.findByIdAndDelete(scheduleId);
    res.json({ error: false });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

module.exports = router;
