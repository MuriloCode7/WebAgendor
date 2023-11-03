import { all, takeLatest, call, put, select } from "redux-saga/effects";
import api from "../../../services/api";
import consts from "../../../consts";
import types from "./types";
import { resetSchedule, updateSchedule } from "./actions";
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
      date: schedule.date,
      specialtyId: schedule.specialtyId,
    });

    yield put(updateSchedule({ form: { ...form, filtering: false } }));

    if (res.error) {
      alert(res.message);
      return false;
    }

    // /** Verifica se o dia escolhido possui algum colaborador com horário disponível */
    // if(!res.calendar[0]) {
    //   alert("Esse dia não tem horário disponível")
    // }
    yield put(
      updateSchedule({
        colaborators: res.colaborators.map((c) => ({
          label: c.name,
          value: c._id,
        })),
        calendar: res.calendar[0][moment(schedule.date).format("YYYY-MM-DD")],
      })
    );
    console.log(res.calendar)
  } catch (err) {
    yield put(updateSchedule({ form: { ...form, filtering: false } }));
    alert(err.message);
  }
}

export function* addSchedule() {
  const { form, schedule, components, behavior } = yield select(
    (state) => state.schedule
  );

  try {
    yield put(updateSchedule({ form: { ...form, saving: true } }));
    let res = {};

      const response = yield call(api.post, "/schedules", {
        companyId: consts.companyId,
        ...schedule,
      });
      res = response.data;
    
    yield put(updateSchedule({ form: { ...form, saving: false } }));

    if (res.error) {
      alert(res.message);
      return false;
    }

    // yield put(allTimeTablesAction());
    yield put(
      updateSchedule({ components: { ...components, drawer: false } })
    );
    yield put(resetSchedule());
  } catch (err) {
    yield put(updateSchedule({ form: { ...form, saving: false } }));
    alert(err.message);
  }
}

export default all([
  takeLatest(types.SCHEDULES_FILTER, filterSchedule),
  takeLatest(types.ALL_SPECIALTIES, allSpecialties),
  takeLatest(types.ALL_CUSTOMERS, allCustomers),
  takeLatest(types.FILTER_AVAILABLE_DAYS, filterAvailableDays),
  takeLatest(types.SCHEDULE_ADD, addSchedule),
]);
