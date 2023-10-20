import { produce } from "immer";
import types from "./types";

const INITIAL_STATE = {
  cutomers: [],
};

function customer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.UPDATE_CUSTOMER: {
      return produce(state, (draft) => {
        draft = { ...draft, ...action.payload };
        return draft;
      });
    }
    default:
      return state;
  }
}
export default customer;
