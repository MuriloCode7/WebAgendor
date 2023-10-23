import { takeLatest, all, call, put, select } from "redux-saga/effects";
import {
  updateCustomer,
  allCustomers as allCustomersAction,
  resetCustomer,
} from "./actions";
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
    const { data: res } = yield call(api.post, "/customers/filter", {
      filters: {
        email: customer.email,
        status: "A",
      },
    });

    yield put(updateCustomer({ form: { ...form, filtering: false } }));

    if (res.error) {
      alert(res.message);
      return false;
    }

    if (res.customers.length > 0) {
      yield put(
        updateCustomer({
          customer: res.customers[0],
          form: { ...form, filtering: false, disabled: true },
        })
      );
    } else {
      yield put(updateCustomer({ form: { ...form, disabled: false } }));
    }

    yield put(updateCustomer({ customers: res.customers }));
  } catch (err) {
    yield put(updateCustomer({ form: { ...form, filtering: false } }));
    alert(err.message);
  }
}

export function* addCustomer() {
  const { form, customer, components } = yield select(
    (state) => state.customer
  );

  try {
    yield put(updateCustomer({ form: { ...form, saving: true } }));
    const { data: res } = yield call(api.post, "/customers", {
      companyId: consts.companyId,
      customer,
    });

    yield put(updateCustomer({ form: { ...form, saving: false } }));

    if (res.error) {
      alert(res.message);
      return false;
    }

    yield put(allCustomersAction());
    yield put(updateCustomer({ components: { ...components, drawer: false } }));
    yield put(resetCustomer());
  } catch (err) {
    yield put(updateCustomer({ form: { ...form, saving: false } }));
    alert(err.message);
  }
}

export function* unlinkCustomer() {
  const { form, customer, components } = yield select(
    (state) => state.customer
  );

  try {
    yield put(updateCustomer({ form: { ...form, saving: true } }));
    const { data: res } = yield call(
      api.delete,
      `/customers/bond/${customer.bondId}`
    );

    yield put(
      updateCustomer({
        form: { ...form, saving: false },
      })
    );

    if (res.error) {
      alert(res.message);
      return false;
    }

    yield put(allCustomersAction());
    yield put(
      updateCustomer({
        components: { ...components, drawer: false, confirmDelete: false },
      })
    );
    yield put(resetCustomer());
  } catch (err) {
    yield put(updateCustomer({ form: { ...form, saving: false } }));
    alert(err.message);
  }
}

export default all([
  takeLatest(types.ALL_CUSTOMERS, allCustomers),
  takeLatest(types.FILTER_CUSTOMERS, filterCustomers),
  takeLatest(types.ADD_CUSTOMER, addCustomer),
  takeLatest(types.UNLINK_CUSTOMER, unlinkCustomer),
]);
