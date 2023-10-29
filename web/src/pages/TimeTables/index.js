import { useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import {
  Button,
  DatePicker,
  Drawer,
  TagPicker,
  Modal,
  IconButton,
} from "rsuite";
import "moment/locale/pt-br";
import {
  allTimeTables,
  updateTimeTable,
  filterColaborators,
  addTimeTable,
  removeTimeTable,
  resetTimeTable,
  allSpecialties
} from "../../store/modules/timeTable/actions";

import { useDispatch, useSelector } from "react-redux";

moment.locale("pt-br");
const localizer = momentLocalizer(moment);

const TimeTables = () => {
  const dispatch = useDispatch();
  const {
    timeTables,
    form,
    behavior,
    components,
    timeTable,
    specialties,
    colaborators,
  } = useSelector((state) => state.timeTable);

  const setComponent = (component, state) => {
    dispatch(
      updateTimeTable({
        components: { ...components, [component]: state },
      })
    );
  };

  const setTimeTable = (key, value) => {
    dispatch(
      updateTimeTable({
        timeTable: { ...timeTable, [key]: value },
      })
    );
  };

  const save = () => {
    dispatch(addTimeTable());
  };

  const remove = () => {
    dispatch(removeTimeTable());
  };

  const daysWeekDate = [
    new Date(2023, 10, 19, 0, 0, 0, 0),
    new Date(2023, 10, 20, 0, 0, 0, 0),
    new Date(2023, 10, 21, 0, 0, 0, 0),
    new Date(2023, 10, 22, 0, 0, 0, 0),
    new Date(2023, 10, 23, 0, 0, 0, 0),
    new Date(2023, 10, 24, 0, 0, 0, 0),
    new Date(2023, 10, 25, 0, 0, 0, 0),
  ];

  const daysOfWeek = [
    "domingo",
    "segunda-feira",
    "terça-feira",
    "quarta-feira",
    "quinta-feira",
    "sexta-feira",
    "sábado",
  ];

  /* Roda após qualquer alteração na página */
  useEffect(() => {
    dispatch(allTimeTables());
    dispatch(allSpecialties());
  }, []);

  /* Roda apenas quando há mudancas nas especialidades selecionadas */
  useEffect(() => {
    dispatch(filterColaborators());
  }, [timeTable.specialties]);

  const formatEvents = timeTables
    .map((timeTable) =>
      timeTable.days.map((day) => ({
        resource: timeTable,
        title: `${timeTable.specialties.length} especs. e ${timeTable.colaborators.length} colabs. disponíveis`,
        start: new Date(
          daysWeekDate[day].setHours(
            parseInt(moment(timeTable.startTime).format("HH")),
            parseInt(moment(timeTable.startTime).format("mm"))
          )
        ),
        end: new Date(
          daysWeekDate[day].setHours(
            parseInt(moment(timeTable.endTime).format("HH")),
            parseInt(moment(timeTable.endTime).format("mm"))
          )
        ),
      }))
    )
    .flat();

  return (
    <div className="col p-5 overflow-auto h-100">
      <Drawer
        open={components.drawer}
        size="sm"
        onClose={() => setComponent("drawer", false)}
      >
        <Drawer.Body>
          <h3>
            {behavior === "create" ? "Criar um novo" : "Atualizar"} horário de
            atendimento
          </h3>

          <div className="row mt-3">
            <div className="col-12">
              <b>Dias da semana</b>
              <TagPicker
                size="lg"
                block
                value={timeTable.days}
                data={daysOfWeek.map((label, value) => ({ label, value }))}
                onChange={(value) => {
                  setTimeTable("days", value);
                }}
              />
            </div>
            <div className="col-6 mt-3">
              <b className="d-block">Horário Inicial</b>
              <DatePicker
                block
                format="HH:mm"
                hideMinutes={(min) => ![0, 30].includes(min)}
                value={new Date(timeTable.startTime)}
                onChange={(e) => setTimeTable("startTime", e)}
              />
            </div>
            <div className="col-6 mt-3">
              <b className="d-block">Horário Final</b>
              <DatePicker
                block
                format="HH:mm"
                hideMinutes={(min) => ![0, 30].includes(min)}
                value={new Date(timeTable.endTime)}
                onChange={(e) => setTimeTable("endTime", e)}
              />
            </div>
            <div className="col-12 mt-3">
              <b>Especialidades disponíveis</b>
              <TagPicker
                size="lg"
                block
                value={timeTable.specialties}
                data={specialties}
                onChange={(e) => {
                  setTimeTable("specialties", e);
                }}
              />
            </div>
            <div className="col-12 mt-3">
              <b>Colaboradores disponíveis</b>
              <TagPicker
                size="lg"
                block
                value={timeTable.colaborators}
                data={colaborators}
                onChange={(e) => {
                  setTimeTable("colaborators", e);
                }}
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
              Salvar Horário de Atendimento
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
                Remover Horário de Atendimento
              </Button>
            )}
          </div>
        </Drawer.Body>
      </Drawer>

      <Modal
        open={components.confirmDelete}
        onHide={() => setComponent("confirmDelete", false)}
        size="xs"
      >
        <Modal.Body>
          <IconButton
            icon="remind"
            style={{
              color: "#ffb300",
              fontSize: 24,
            }}
          />
          {"  "} <br></br>Tem certeza que deseja excluir? <br></br>Essa ação
          será irreversível!
        </Modal.Body>
        <Modal.Footer>
          <Button
            loading={form.saving}
            onClick={() => remove()}
            color="red"
            appearance="primary"
          >
            Sim, tenho certeza!
          </Button>
          <Button
            onClick={() => setComponent("confirmDelete", false)}
            appearance="subtle"
          >
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="row">
        <div className="col-12">
          <div className="w-100 d-flex justify-content-between">
            <h2 className="mb-4 mt-0">Horários de atendimento</h2>
            <div>
              <button
                className="btn btn-primary btn-lg"
                onClick={() => {
                  dispatch(
                    updateTimeTable({
                      behavior: "create",
                    })
                  );
                  dispatch(resetTimeTable());
                  setComponent("drawer", true);
                }}
              >
                <span className="mdi mdi-plus">Novo horário</span>
              </button>
            </div>
          </div>
          <Calendar
            onSelectEvent={(e) => {
              dispatch(
                updateTimeTable({
                  behavior: "update",
                })
              );
              dispatch(
                updateTimeTable({
                  timeTable: e.resource,
                })
              );
              setComponent("drawer", true);
            }}
            onSelectSlot={(slotInfo) => {
              const { start, end } = slotInfo;
              dispatch(
                updateTimeTable({
                  behavior: "create",
                  timeTable: {
                    ...timeTable,
                    days: [moment(start).day()],
                    startTime: start,
                    endTime: end,
                  },
                })
              );
              setComponent("drawer", true);
            }}
            localizer={localizer}
            toolbar={false}
            formats={{
              dateFormat: "dd",
              dayFormat: (date, culture, localizer) =>
                localizer.format(date, "dddd", culture),
            }}
            popup
            selectable
            defaultView="week"
            events={formatEvents}
            date={daysWeekDate[moment().day()]}
            onNavigate={() => {}}
            style={{ height: 600 }}
          />
        </div>
      </div>
    </div>
  );
};

export default TimeTables;
