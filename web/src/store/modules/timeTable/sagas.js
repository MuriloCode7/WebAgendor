import { takeLatest, all, call, put, select } from "redux-saga/effects";
import {
  resetTimeTable,
  allTimeTables as allTimeTablesAction,
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

    yield put(updateTimeTable({ specialties: res.specialties }));
  } catch (err) {
    yield put(updateTimeTable({ form: { ...form, filtering: false } }));
    alert(err.message);
  }
}

export function* addTimeTable() {
  const { form, timeTable, components, behavior } = yield select(
    (state) => state.timeTable
  );

  try {
    yield put(updateTimeTable({ form: { ...form, saving: true } }));
    let res = {};

    if (behavior === "create") {
      const response = yield call(api.post, "/timeTables", {
        companyId: consts.companyId,
        ...timeTable,
      });
      res = response.data;
    } else {
      const response = yield call(
        api.put,
        `/timeTables/${timeTable._id}`,
        timeTable
      );
      res = response.data;
    }

    yield put(updateTimeTable({ form: { ...form, saving: false } }));

    if (res.error) {
      alert(res.message);
      return false;
    }

    yield put(allTimeTablesAction());
    yield put(
      updateTimeTable({ components: { ...components, drawer: false } })
    );
    yield put(resetTimeTable());
  } catch (err) {
    yield put(updateTimeTable({ form: { ...form, saving: false } }));
    alert(err.message);
  }
}

export function* filterColaborators() {
  const { form, timeTable } = yield select((state) => state.timeTable);

  try {
    yield put(updateTimeTable({ form: { ...form, filtering: true } }));

    const { data: res } = yield call(api.post, `/timeTables/colaborators`, {
      specialties: timeTable.specialties,
    });

    yield put(updateTimeTable({ form: { ...form, filtering: false } }));

    if (res.error) {
      alert(res.message);
      return false;
    }

    yield put(updateTimeTable({ colaborators: res.colaborators }));
  } catch (err) {
    yield put(updateTimeTable({ form: { ...form, filtering: false } }));
    alert(err.message);
  }
}

export function* removeTimeTable() {
  const { form, timeTable, components } = yield select(
    (state) => state.timeTable
  );
  try {
    yield put(updateTimeTable({ form: { ...form, filtering: true } }));
    console.log(timeTable);
    const { data: res } = yield call(
      api.delete,
      `/timeTables/${timeTable._id}`
    );

    yield put(updateTimeTable({ form: { ...form, filtering: false } }));

    if (res.error) {
      alert(res.message);
      return false;
    }

    yield put(allTimeTablesAction());
    yield put(
      updateTimeTable({
        components: { ...components, drawer: false, confirmDelete: false },
      })
    );
    yield put(resetTimeTable());
  } catch (err) {
    yield put(updateTimeTable({ form: { ...form, filtering: false } }));
    alert(err.message);
  }
}

export default all([
  takeLatest(types.ALL_TIMETABLES, allTimeTables),
  takeLatest(types.ALL_SPECIALTIES, allSpecialties),
  takeLatest(types.ADD_TIMETABLE, addTimeTable),
  takeLatest(types.FILTER_COLABORATORS, filterColaborators),
  takeLatest(types.REMOVE_TIMETABLE, removeTimeTable),
]);
