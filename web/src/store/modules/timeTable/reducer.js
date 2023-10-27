import { produce } from "immer";
import types from "./types";

const INITIAL_STATE = {
  behavior: "create",
  components: {
    drawer: false,
    confirmDelete: false,
    view: 'week'
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
    startTime: "",
    endTime: "",
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
    case types.REMOVE_TIMETABLE: {
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
