import { takeLatest, all, call, put, select } from "redux-saga/effects";
import { updateCustomer } from "./actions";
import types from "./types";
import api from "../../../services/api";
import consts from "../../../consts";

export function* allCustomers() {
  const { form } = yield select((state) => state.customer);

  try {
    yield put(updateCustomer({ form: { ...form, filtering: true } }));
    const { data: res } = yield call(
      api.get,
      `/customers/company/${consts.companyId}`
    );

    yield put(updateCustomer({ form: { ...form, filtering: false } }));

    if (res.error) {
      alert(res.message);
      return false;
    }

    yield put(updateCustomer({ customers: res.customers }));
  } catch (err) {
    yield put(updateCustomer({ form: { ...form, filtering: false } }));
    alert(err.message);
  }
}

export function* filterCustomers() {
  const { form, customer } = yield select((state) => state.customer);

  try {
    yield put(updateCustomer({ form: { ...form, filtering: true } }));
    const { data: res } = yield call(
      api.post,
      '/customers/filter',
      { 
        filters: {
          email: customer.email,
          status: 'A'
        }
      }
    );

    yield put(updateCustomer({ form: { ...form, filtering: false } }));

    if (res.error) {
      alert(res.message);
      return false;
    }

    if (res.customers.length > 0) {
      yield put(
        updateCustomer({
          customer: res.customers[0], 
          form: { ...form, filtering: false, disabled: true } }));
    } else {
      yield put(updateCustomer({ form: { ...form, disabled: false } }));
    }

    yield put(updateCustomer({ customers: res.customers }));
  } catch (err) {
    yield put(updateCustomer({ form: { ...form, filtering: false } }));
    alert(err.message);
  }
}

export default all([
  takeLatest(types.ALL_CUSTOMERS, allCustomers),
  takeLatest(types.FILTER_CUSTOMERS, filterCustomers),
]);
