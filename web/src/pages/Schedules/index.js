import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { Button, DatePicker, Drawer, SelectPicker } from "rsuite";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import utils from "../../utils";
import "moment/locale/pt-br";

import {
  resetSchedule,
  schedulesFilter,
  updateSchedule,
  allSpecialties,
  allCustomers,
  filterAvailableDays,
  addSchedule,
} from "../../store/modules/schedule/actions";

moment.locale("pt-br");
const localizer = momentLocalizer(moment);

const Schedules = () => {
  const dispatch = useDispatch();
  const {
    schedules,
    components,
    form,
    schedule,
    colaborators,
    specialties,
    customers,
    behavior,
    calendar,
    availableTimeTables,
  } = useSelector((state) => state.schedule);

  const formatEvents = schedules.map((schedule) => ({
    resource: schedule,
    title: `${schedule.specialtyId.title} - ${schedule.customerId.name} - ${schedule.colaboratorId.name}`,
    start: moment(schedule.date).toDate(),
    end: moment(schedule.date)
      .add(
        utils.hourToMinutes(
          moment(schedule.specialtyId.duration).format("HH:mm")
        ),
        "minutes"
      )
      .toDate(),
  }));

  const formatRange = (period) => {
    let finalRange = {};
    if (Array.isArray(period)) {
      finalRange = {
        start: moment(period[0]).format("YYYY-MM-DD"),
        end: moment(period[period.length - 1]).format("YYYY-MM-DD"),
      };
    } else {
      finalRange = {
        start: moment(period.start).format("YYYY-MM-DD"),
        end: moment(period.end).format("YYYY-MM-DD"),
      };
    }
    return finalRange;
  };

  const setComponent = (component, state) => {
    dispatch(
      updateSchedule({
        components: { ...components, [component]: state },
      })
    );
  };

  const setSchedule = (key, value) => {
    dispatch(
      updateSchedule({
        schedule: { ...schedule, [key]: value },
      })
    );
  };

  const save = () => {
    dispatch(addSchedule());
  };

  const formatSchedule = (schedule) => {
    let scheduleFormatted = {
      companyId: schedule.companyId,
      specialtyId: schedule.specialtyId._id,
      customerId: schedule.customerId._id,
      colaboratorId: schedule.colaboratorId._id,
      date: new Date(schedule.date),
      value: schedule.value,
    };

    return scheduleFormatted;
  };

  const formatTimeTablesDay = () => {
    let allTimeTablesDay = [];
    for (let timeTable in calendar[schedule.colaboratorId]) {
      for (let hour in calendar[schedule.colaboratorId][timeTable]) {
        let pieces = calendar[schedule.colaboratorId][timeTable][hour].split(':')
        console.log('data: ', moment(schedule.date).format('HH:mm').toString())
        
        let formattedHour = {
          label: calendar[schedule.colaboratorId][timeTable][hour],
          value: new Date(moment(schedule.date)).setHours(parseInt(pieces[0]), parseInt(pieces[1]), 0)
        };
        allTimeTablesDay.push(formattedHour);
      }
    }
    console.log("Alltimetablesday", allTimeTablesDay);
    return allTimeTablesDay;
  };

  useEffect(() => {
    dispatch(
      schedulesFilter(
        moment().weekday(0).format("YYYY-MM-DD"),
        moment().weekday(6).format("YYYY-MM-DD")
      )
    );
    dispatch(allSpecialties());
    dispatch(allCustomers());
  }, []);

  /* Busca os dias e colaboradores disponíveis sempre que o usuário
  seleciona um serviço ou data diferente */
  useEffect(() => {
    if (schedule.specialtyId !== null && schedule.date !== null) {
      dispatch(filterAvailableDays());
    }
  }, [schedule.specialtyId, schedule.date]);

  return (
    <div className="col p-5 overflow-auto h-100">
      <Drawer
        open={components.drawer}
        size="sm"
        onClose={() => setComponent("drawer", false)}
      >
        <Drawer.Body>
          <h3>
            {behavior === "create" ? "Criar novo" : "Atualizar"} agendamento
          </h3>
          <div className="row mt-3">
            <div className="form-group col-12 mb-3">
              <b>Cliente</b>
              <SelectPicker
                value={schedule.customerId}
                placeholder="Nome do cliente"
                onChange={(customerId) => setSchedule("customerId", customerId)}
                block
                size="lg"
                data={customers}
              />
            </div>
            <div className="form-group col-12 mb-3">
              <b>Serviço</b>
              <SelectPicker
                value={schedule.specialtyId}
                placeholder="Nome do serviço"
                onChange={(specialtyId) =>
                  setSchedule("specialtyId", specialtyId)
                }
                block
                size="lg"
                data={specialties}
              />
            </div>
            <div className="col-12 mb-3">
              <b className="d-block"> Dia </b>
              {/* <DatePicker
                block
                format="dd/MM/yyyy"
                placeholder="Selecione um serviço para ver os dias disponíveis"
                value={schedule.date}
                onChange={(e) => setSchedule("date", e)}
              /> */}
              <SelectPicker
                
              />
            </div>
            <div className="form-group col-12 mb-3">
              <b>Colaboradores disponíveis no dia</b>
              <SelectPicker
                disabled={schedule.date === null ? true : false}
                value={schedule.colaboratorId}
                placeholder={
                  colaborators.length > 0
                    ? "Selecione um colaborador"
                    : "Sem colaboradores disponíveis nesse dia"
                }
                onChange={(colaboratorId) =>
                  setSchedule("colaboratorId", colaboratorId)
                }
                block
                size="lg"
                data={colaborators}
                loading={form.filtering}
              />
            </div>
            <div className="col-12 mb-3">
              <b className="d-block">
                {" "}
                Horários disponíveis para esse colaborador{" "}
              </b>
              <SelectPicker
                disabled={schedule.colaboratorId === null ? true : false}
                value={moment(schedule.date).format('HH:mm').toString()}
                placeholder="Selecione um horário"
                onChange={(date) => setSchedule("date", date)}
                block
                size="lg"
                data={
                  Object.keys(calendar).length === 0
                    ? []
                    : formatTimeTablesDay()
                }
                loading={form.filtering}
              />
            </div>
            <Button
              loading={form.saving}
              color={behavior === "create" ? "green" : "blue"}
              appearance="primary"
              size="lg"
              block
              onClick={() => save()}
              className="mt-3"
            >
              Salvar Agendamento
            </Button>
            {behavior === "update" && (
              <Button
                loading={form.saving}
                color="red"
                appearance="primary"
                size="lg"
                block
                onClick={() => setComponent("confirmDelete", true)}
                className="mt-1"
              >
                Excluir agendamento
              </Button>
            )}
          </div>
        </Drawer.Body>
      </Drawer>
      <div className="row">
        <div className="col-12">
          <div className="w-100 d-flex justify-content-between">
            <h2 className="mb-4 mt-0">Agendamentos</h2>
            <div>
              <button
                className="btn btn-primary btn-lg"
                onClick={() => {
                  dispatch(
                    updateSchedule({
                      behavior: "create",
                    })
                  );
                  dispatch(resetSchedule());
                  setComponent("drawer", true);
                }}
              >
                <span className="mdi mdi-plus">Novo Agendamento</span>
              </button>
            </div>
          </div>
          <Calendar
            onSelectEvent={(e) => {
              dispatch(
                updateSchedule({
                  behavior: "update",
                })
              );

              dispatch(
                updateSchedule({
                  schedule: formatSchedule(e.resource),
                })
              );
              setComponent("drawer", true);
            }}
            localizer={localizer}
            onRangeChange={(period) => {
              const { start, end } = formatRange(period);
              dispatch(schedulesFilter(start, end));
            }}
            events={formatEvents}
            defaultView="week"
            selectable
            popup
            style={{ height: 600 }}
          />
        </div>
      </div>
    </div>
  );
};

export default Schedules;
