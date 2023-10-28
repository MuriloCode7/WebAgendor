import { produce } from "immer";
import types from "./types";

const INITIAL_STATE = {
  behavior: "create",
  components: {
    drawer: false,
    confirmDelete: false
  },
  form: {
    filtering: false,
    disabled: true,
    saving: false
  },
  cutomers: [],
  customer: {
    name: "",
    email: "",
    phone: "",
    dateBirth: "",
    gender: "M",
    document: {
      type: "cpf",
      number: "",  
    },
    address: {
      city: "",
      uf: "",
      cep: "",
      number: "",
      country: "BR",
      street: "",
    }
  },
};

function customer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.UPDATE_CUSTOMER: {
      return produce(state, (draft) => {
        draft = { ...draft, ...action.payload };
        return draft;
      });
    }
    case types.RESET_CUSTOMER: {
      return produce(state, (draft) => {
        draft.customer = INITIAL_STATE.customer;
        return draft;
      });
    }
    default:
      return state;
  }
}
export default customer;
