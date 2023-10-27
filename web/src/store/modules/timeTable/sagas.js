import { takeLatest, all, call, put, select } from "redux-saga/effects";
import {
  updateTimeTable,
} from "./actions";
import types from "./types";
import api from "../../../services/api";
import consts from "../../../consts";

export function* allTimeTables() {
  const { form } = yield select((state) => state.timeTable);

  try {
    yield put(updateTimeTable({ form: { ...form, filtering: true } }));
    const { data: res } = yield call(
      api.get,
      `/timeTables/company/${consts.companyId}`
    );

    yield put(updateTimeTable({ form: { ...form, filtering: false } }));

    if (res.error) {
      alert(res.message);
      return false;
    }

    yield put(updateTimeTable({ timeTables: res.timeTables }));
  } catch (err) {
    yield put(updateTimeTable({ form: { ...form, filtering: false } }));
    alert(err.message);
  }
}

export function* allSpecialties() {
  const { form } = yield select((state) => state.timeTable);

  try {
    yield put(updateTimeTable({ form: { ...form, filtering: true } }));

    const { data: res } = yield call(
      api.get,
      `/companies/specialties/${consts.companyId}`
    );

    yield put(updateTimeTable({ form: { ...form, filtering: false } }));

    if (res.error) {
      alert(res.message);
      return false;
    }

    yield put(updateTimeTable({specialties: res.specialties}))

  } catch (err) {
    yield put(updateTimeTable({ form: { ...form, filtering: false } }));
    alert(err.message);
  }
}


export default all([
  takeLatest(types.ALL_TIMETABLES, allTimeTables),
  takeLatest(types.ALL_SPECIALTIES, allSpecialties),
]);
