import { takeLatest, all, call, put, select } from "redux-saga/effects";
import {
  updateSpecialty,
  allSpecialties as allSpecialtiesAction,
  resetSpecialty,
  addSpecialty,
} from "./actions";
import types from "./types";
import api from "../../../services/api";
import consts from "../../../consts";

export function* allSpecialties() {
  const { form } = yield select((state) => state.specialty);

  try {
    yield put(updateSpecialty({ form: { ...form, filtering: true } }));
    const { data: res } = yield call(
      api.get,
      `/specialties/company/${consts.companyId}`
    );

    yield put(updateSpecialty({ form: { ...form, filtering: false } }));

    if (res.error) {
      alert(res.message);
      return false;
    }

    yield put(updateSpecialty({ specialties: res.specialties }));
  } catch (err) {
    yield put(updateSpecialty({ form: { ...form, filtering: false } }));
    alert(err.message);
  }
}

export function* addColaborator() {
  const { form, specialty, components, behavior } = yield select(
    (state) => state.specialty
  );

  try {
    yield put(updateSpecialty({ form: { ...form, saving: true } }));
    let res = {};

    if(behavior === 'create') {
      const response = yield call(api.post, "/specialties", {
        companyId: consts.companyId,
        specialty,
      });
      res = response.data;
    } else {
      const response = yield call(api.put, `/specialties/${specialty._id}`, {
        bond: specialty.bond,
        bondId: specialty.bondId,
        specialties: specialty.specialties
      });
      res = response.data;
    }
    

    yield put(updateSpecialty({ form: { ...form, saving: false } }));

    if (res.error) {
      alert(res.message);
      return false;
    }

    yield put(allSpecialtiesAction());
    yield put(
      updateSpecialty({ components: { ...components, drawer: false } })
    );
    yield put(resetSpecialty());
  } catch (err) {
    yield put(updateSpecialty({ form: { ...form, saving: false } }));
    alert(err.message);
  }
}

export function* removeSpecialty() {
  const { form, specialty, components } = yield select(
    (state) => state.specialty
  );

  try {
    yield put(updateSpecialty({ form: { ...form, saving: true } }));
    const { data: res } = yield call(
      api.delete,
      `/specialties/bond/${specialty.bondId}`
    );

    yield put(
      updateSpecialty({
        form: { ...form, saving: false },
      })
    );

    if (res.error) {
      alert(res.message);
      return false;
    }

    yield put(allSpecialtiesAction());
    yield put(
      updateSpecialty({
        components: { ...components, drawer: false, confirmDelete: false },
      })
    );
    yield put(resetSpecialty());
  } catch (err) {
    yield put(updateSpecialty({ form: { ...form, saving: false } }));
    alert(err.message);
  }
}

export function* removeFile() {
  const { form, specialty, components } = yield select(
    (state) => state.specialty
  );

  try {
    yield put(updateSpecialty({ form: { ...form, saving: true } }));
    const { data: res } = yield call(
      api.delete,
      `/specialties/bond/${specialty.bondId}`
    );

    yield put(
      updateSpecialty({
        form: { ...form, saving: false },
      })
    );

    if (res.error) {
      alert(res.message);
      return false;
    }

    yield put(allSpecialtiesAction());
    yield put(
      updateSpecialty({
        components: { ...components, drawer: false, confirmDelete: false },
      })
    );
    yield put(resetSpecialty());
  } catch (err) {
    yield put(updateSpecialty({ form: { ...form, saving: false } }));
    alert(err.message);
  }
}


export default all([
  takeLatest(types.ALL_SPECIALTIES, allSpecialties),
  takeLatest(types.ADD_SPECIALTY, addSpecialty),
  takeLatest(types.REMOVE_FILE, removeFile),
  takeLatest(types.REMOVE_SPECIALTY, removeSpecialty),
]);
