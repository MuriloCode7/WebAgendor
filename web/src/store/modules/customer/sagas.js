import { takeLatest, all, call, put } from "redux-saga/effects";
import { updateCustomer } from "./actions";
import types from "./types";
import api from "../../../services/api";
import consts from "../../../consts";

export function* allCustomers() {
  try {
    const { data: res } = yield call(
      api.get,
      `/customers/company/${consts.companyId}`
    );
    if (res.error) {
      alert(res.message);
      return false;
    }

    yield put(updateCustomer({ customers: res.customers }));
  } catch (err) {
    alert(err.message);
  }
}

export default all([takeLatest(types.ALL_CUSTOMERS, allCustomers)]);
