import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { Drawer } from "rsuite";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import utils from "../../utils";
import "moment/locale/pt-br";

import {
  resetSchedule,
  schedulesFilter,
  updateSchedule,
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
  } = useSelector((state) => state.schedule);

  const formatEvents = schedules.map((schedule) => ({
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

  useEffect(() => {
    dispatch(
      schedulesFilter(
        moment().weekday(0).format("YYYY-MM-DD"),
        moment().weekday(6).format("YYYY-MM-DD")
      )
    );
  }, []);

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
