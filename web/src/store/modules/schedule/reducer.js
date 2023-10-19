import types from "./types";
import { produce } from "immer";

const INITIAL_STATE = {
  schedules: [],
};

function schedule(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.SCHEDULE_UPDATE: {
      return produce(state, (draft) => {
        draft.schedules = action.schedules;
      });
    }
    default:
      return state;
  }
}

export default schedule;
