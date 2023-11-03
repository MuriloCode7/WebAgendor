import moment from "moment";
import consts from "../../../consts";
import types from "./types";
import { produce } from "immer";

const INITIAL_STATE = {
  behavior: "create",
  components: {
    drawer: false,
    confirmDelete: false,
    defaultView: "week",
  },
  form: {
    saving: false,
    disabled: true,
    filtering: false,
  },
  schedule: {
    companyId: consts.companyId,
    customerId: null,
    colaboratorId: null,
    specialtyId: null,
    date: null,
    hour: null,
    value: 0,
  },
  customers: [],
  colaborators: [],
  specialties: [],
  schedules: [],
  calendar: {},
  availableTimeTables: [],
};

function schedule(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.SCHEDULE_UPDATE: {
      return produce(state, (draft) => {
        draft = { ...draft, ...action.payload };
        return draft;
      });
    }
    case types.SCHEDULE_RESET: {
      return produce(state, (draft) => {
        draft.schedule = INITIAL_STATE.schedule;
        return draft;
      });
    }
    default:
      return state;
  }
}

export default schedule;
