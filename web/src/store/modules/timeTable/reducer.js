import { produce } from "immer";
import types from "./types";
import moment from "moment";

const INITIAL_STATE = {
  behavior: "create",
  components: {
    drawer: false,
    confirmDelete: false,
    defaultView: 'week'
  },
  form: {
    filtering: false,
    disabled: true,
    saving: false,
  },
  colaborators: [],
  specialties: [],
  timeTables: [],
  timeTable: {
    days: [],
    startTime: new Date(moment()),
    endTime: new Date(moment().add(30, 'minutes')),
    specialties: [],
    colaborators: [],
  },
};

function timeTable(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.UPDATE_TIMETABLE: {
      return produce(state, (draft) => {
        draft = { ...draft, ...action.payload };
        return draft;
      });
    }
    case types.RESET_TIMETABLE: {
      return produce(state, (draft) => {
        draft.timeTable = INITIAL_STATE.timeTable;
        return draft;
      });
    }
    default:
      return state;
  }
}
export default timeTable;
