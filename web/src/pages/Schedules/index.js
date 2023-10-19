import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { useDispatch  } from "react-redux";
import { useEffect } from "react"; 

import {schedulesFilter } from '../../store/modules/schedule/actions';

const localizer = momentLocalizer(moment);

const Schedules = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(schedulesFilter(
      moment().weekday(0).format("YYYY-MM-DD"), 
      moment().weekday(6).format("YYYY-MM-DD")
      )
    );
  });

  return (
    <div className="col p-5 overflow-auto h-100">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4 mt-0">Agendamentos</h2>
          <Calendar
            localizer={localizer}
            events={[
              {
                title: "Evento teste",
                start: moment().toDate(),
                end: moment().add(30, "minutes").toDate(),
              },
            ]}
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
