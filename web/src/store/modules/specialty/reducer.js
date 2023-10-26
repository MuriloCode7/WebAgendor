import { produce } from "immer";
import types from "./types";
import moment from 'moment'

const INITIAL_STATE = {
  behavior: "create",
  components: {
    drawer: false,
    confirmDelete: false,
  },
  form: {
    filtering: false,
    disabled: true,
    saving: false,
  },
  specialties: [],
  specialty: {
    title: "",
    preco: 0,
    commission: 0,
    duration: moment('00:30', 'HH:mm').format(),
    recurrence: "",
    description: "",
    status: "A",
    files: [],
  },
};

function specialty(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.UPDATE_SPECIALTY: {
      return produce(state, (draft) => {
        draft = { ...draft, ...action.payload };
        return draft;
      });
    }
    case types.RESET_SPECIALTY: {
      return produce(state, (draft) => {
        draft.specialty = INITIAL_STATE.specialty;
        return draft;
      });
    }
    default:
      return state;
  }
}
export default specialty;
