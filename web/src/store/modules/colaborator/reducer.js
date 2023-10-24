import { produce } from "immer";
import types from "./types";

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
  colaborators: [],
  specialties: [],
  colaborator: {
    name: "",
    email: "",
    phone: "",
    dateBirth: "M",
    gender: "",
    bond: "A",
    specialties: [],
    bakAccount: {
      titular: "",
      cpfCnpj: "",
      bank: "",
      type: "",
      agency: "",
      number: "",
      dv: "",
    },
  },
};

function colaborator(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.UPDATE_COLABORATOR: {
      return produce(state, (draft) => {
        draft = { ...draft, ...action.payload };
        return draft;
      });
    }
    case types.RESET_COLABORATOR: {
      return produce(state, (draft) => {
        draft.colaborator = INITIAL_STATE.colaborator;
        return draft;
      });
    }
    default:
      return state;
  }
}
export default colaborator;
