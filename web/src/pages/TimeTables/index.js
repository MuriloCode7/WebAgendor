import { useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { Drawer } from "rsuite";
import "moment/locale/pt-br";
import {
  allTimeTables,
  allSpecialties,
  updateTimeTable,
} from "../../store/modules/timeTable/actions";
import { useDispatch, useSelector } from "react-redux";

moment.locale("pt-br");
const localizer = momentLocalizer(moment);

const TimeTables = () => {
  const dispatch = useDispatch();
  const { timeTables, form, components, timeTable } = useSelector(
    (state) => state.timeTable
  );

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

  const daysWeekDate = [
    new Date(2023, 10, 22, 0, 0, 0, 0),
    new Date(2023, 10, 23, 0, 0, 0, 0),
    new Date(2023, 10, 24, 0, 0, 0, 0),
    new Date(2023, 10, 25, 0, 0, 0, 0),
    new Date(2023, 10, 26, 0, 0, 0, 0),
    new Date(2023, 10, 27, 0, 0, 0, 0),
    new Date(2023, 10, 28, 0, 0, 0, 0),
  ];

  useEffect(() => {
    dispatch(allTimeTables());
    dispatch(allSpecialties());
  }, []);

  const formatEvents = timeTables
    .map((timeTable, index) =>
      timeTable.days.map((day) => ({
        title: `${timeTable.specialties.length} espec. e ${timeTable.colaborators.length} colab. disponíveis`,
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
        onHide={() => setComponent("drawer", false)}
        onClose={() => setComponent("drawer", false)}
      >
        <Drawer.Body></Drawer.Body>
      </Drawer>
      <div className="row">
        <div className="col-12">
          <div className="w-100 d-flex justify-content-between">
            <h2 className="mb-4 mt-0">Horários de atendimento</h2>
            <div>
              <button className="btn btn-primary btn-lg" onClick={() => setComponent("drawer", true)}>
                <span className="mdi mdi-plus">Novo horário</span>
              </button>
            </div>
          </div>
          <Calendar
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
