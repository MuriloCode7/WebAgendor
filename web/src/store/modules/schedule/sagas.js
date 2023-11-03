import { all, takeLatest, call, put, select } from "redux-saga/effects";
import api from "../../../services/api";
import consts from "../../../consts";
import types from "./types";
import { updateSchedule } from "./actions";
import moment from "moment";

export function* filterSchedule({ start, end }) {
  try {
    const { data: res } = yield call(api.post, "/schedules/filter", {
      companyId: consts.companyId,
      period: {
        start,
        end,
      },
    });

    if (res.error) {
      alert(res.message);
      return false;
    }

    yield put(updateSchedule({ schedules: res.schedules }));
  } catch (err) {
    alert(err.message);
  }
}

export function* allSpecialties() {
  const { form } = yield select((state) => state.schedule);

  try {
    yield put(updateSchedule({ form: { ...form, filtering: true } }));

    const { data: res } = yield call(
      api.get,
      `/companies/specialties/${consts.companyId}`
    );

    yield put(updateSchedule({ form: { ...form, filtering: false } }));

    if (res.error) {
      alert(res.message);
      return false;
    }

    yield put(updateSchedule({ specialties: res.specialties }));
  } catch (err) {
    yield put(updateSchedule({ form: { ...form, filtering: false } }));
    alert(err.message);
  }
}

export function* allCustomers() {
  const { form } = yield select((state) => state.schedule);

  try {
    yield put(updateSchedule({ form: { ...form, filtering: true } }));

    const { data: res } = yield call(
      api.get,
      `/customers/company/${consts.companyId}`
    );

    yield put(updateSchedule({ form: { ...form, filtering: false } }));

    if (res.error) {
      alert(res.message);
      return false;
    }

    yield put(
      updateSchedule({
        customers: res.customers.map((c) => ({ label: c.name, value: c._id })),
      })
    );
  } catch (err) {
    yield put(updateSchedule({ form: { ...form, filtering: false } }));
    alert(err.message);
  }
}

export function* filterAvailableDays() {
  const { form, schedule } = yield select((state) => state.schedule);

  try {
    yield put(updateSchedule({ form: { ...form, filtering: true } }));

    const { data: res } = yield call(api.post, "/schedules/availableDays", {
      companyId: consts.companyId,
      date: moment(),
      specialtyId: schedule.specialtyId,
    });

    yield put(updateSchedule({ form: { ...form, filtering: false } }));

    if (res.error) {
      alert(res.message);
      return false;
    }

    console.log(res);
    yield put(updateSchedule({
      colaborators: res.colaborators.map((c) => ({ label: c.name, value: c._id })),
    }))
  } catch (err) {
    yield put(updateSchedule({ form: { ...form, filtering: false } }));
    alert(err.message);
  }
}

export default all([
  takeLatest(types.SCHEDULES_FILTER, filterSchedule),
  takeLatest(types.ALL_SPECIALTIES, allSpecialties),
  takeLatest(types.ALL_CUSTOMERS, allCustomers),
  takeLatest(types.FILTER_AVAILABLE_DAYS, filterAvailableDays),
]);
