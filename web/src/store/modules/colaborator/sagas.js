import { takeLatest, all, call, put, select } from "redux-saga/effects";
import {
  updateColaborator,
  allColaborators as allColaboratorsAction,
  resetColaborator,
} from "./actions";
import types from "./types";
import api from "../../../services/api";
import consts from "../../../consts";

export function* allColaborators() {
  const { form } = yield select((state) => state.colaborator);

  try {
    yield put(updateColaborator({ form: { ...form, filtering: true } }));
    const { data: res } = yield call(
      api.get,
      `/colaborators/company/${consts.companyId}`
    );

    yield put(updateColaborator({ form: { ...form, filtering: false } }));

    if (res.error) {
      alert(res.message);
      return false;
    }

    yield put(updateColaborator({ colaborators: res.colaborators }));
  } catch (err) {
    yield put(updateColaborator({ form: { ...form, filtering: false } }));
    alert(err.message);
  }
}

export function* filterColaborators() {
  const { form, colaborator } = yield select((state) => state.colaborator);

  try {
    yield put(updateColaborator({ form: { ...form, filtering: true } }));
    const { data: res } = yield call(api.post, "/colaborators/filter", {
      filters: {
        email: colaborator.email,
        status: "A",
      },
    });

    yield put(updateColaborator({ form: { ...form, filtering: false } }));

    if (res.error) {
      alert(res.message);
      return false;
    }

    if (res.colaborators.length > 0) {
      yield put(
        updateColaborator({
          colaborator: res.colaborators[0],
          form: { ...form, filtering: false, disabled: true },
        })
      );
    } else {
      yield put(updateColaborator({ form: { ...form, disabled: false } }));
    }

    yield put(updateColaborator({ colaborators: res.colaborators }));
  } catch (err) {
    yield put(updateColaborator({ form: { ...form, filtering: false } }));
    alert(err.message);
  }
}

export function* addColaborator() {
  const { form, colaborator, components, behavior } = yield select(
    (state) => state.colaborator
  );

  try {
    yield put(updateColaborator({ form: { ...form, saving: true } }));
    let res = {};

    if(behavior === 'create') {
      const response = yield call(api.post, "/colaborators", {
        companyId: consts.companyId,
        colaborator,
      });
      res = response.data;
    } else {
      const response = yield call(api.put, `/colaborators/${colaborator._id}`, {
        bond: colaborator.bond,
        bondId: colaborator.bondId,
        specialties: colaborator.specialties
      });
      res = response.data;
    }
    

    yield put(updateColaborator({ form: { ...form, saving: false } }));

    if (res.error) {
      alert(res.message);
      return false;
    }

    yield put(allColaboratorsAction());
    yield put(
      updateColaborator({ components: { ...components, drawer: false } })
    );
    yield put(resetColaborator());
  } catch (err) {
    yield put(updateColaborator({ form: { ...form, saving: false } }));
    alert(err.message);
  }
}

export function* unlinkColaborator() {
  const { form, colaborator, components } = yield select(
    (state) => state.colaborator
  );

  try {
    yield put(updateColaborator({ form: { ...form, saving: true } }));
    const { data: res } = yield call(
      api.delete,
      `/colaborators/bond/${colaborator.bondId}`
    );

    yield put(
      updateColaborator({
        form: { ...form, saving: false },
      })
    );

    if (res.error) {
      alert(res.message);
      return false;
    }

    yield put(allColaboratorsAction());
    yield put(
      updateColaborator({
        components: { ...components, drawer: false, confirmDelete: false },
      })
    );
    yield put(resetColaborator());
  } catch (err) {
    yield put(updateColaborator({ form: { ...form, saving: false } }));
    alert(err.message);
  }
}

export function* allSpecialties() {
  const { form } = yield select((state) => state.colaborator);

  try {
    yield put(updateColaborator({ form: { ...form, filtering: true } }));

    const { data: res } = yield call(
      api.get,
      `/companies/specialties/${consts.companyId}`
    );

    yield put(updateColaborator({ form: { ...form, filtering: false } }));

    if (res.error) {
      alert(res.message);
      return false;
    }

    yield put(updateColaborator({specialties: res.specialties}))

  } catch (err) {
    yield put(updateColaborator({ form: { ...form, filtering: false } }));
    alert(err.message);
  }
}

export default all([
  takeLatest(types.ALL_COLABORATORS, allColaborators),
  takeLatest(types.FILTER_COLABORATORS, filterColaborators),
  takeLatest(types.ADD_COLABORATOR, addColaborator),
  takeLatest(types.UNLINK_COLABORATOR, unlinkColaborator),
  takeLatest(types.ALL_SPECIALTIES, allSpecialties),
]);
