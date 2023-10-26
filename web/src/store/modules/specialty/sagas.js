import { takeLatest, all, call, put, select } from "redux-saga/effects";
import {
  updateSpecialty,
  allSpecialties as allSpecialtiesAction,
  resetSpecialty,
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

export function* addSpecialty() {
  const { form, specialty, components, behavior } = yield select(
    (state) => state.specialty
  );

  try {
    yield put(updateSpecialty({ form: { ...form, saving: true } }));

    const formData = new FormData();
    formData.append(
      "specialty",
      JSON.stringify({ ...specialty, companyId: consts.companyId }));
    formData.append("companyId", consts.companyId);
    specialty.files.map((f, i) => {
      formData.append(`file_${i}`, f);
    });

    const { data: res } = yield call(
      api[behavior === "create" ? "post" : "put"],
      behavior === "create" ? "/specialties" : `/specialties/${specialty._id}`
    );

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
      `/specialties/${specialty._id}`
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

export function* removeFile(key) {
  const { form } = yield select((state) => state.specialty);

  try {
    yield put(updateSpecialty({ form: { ...form, saving: true } }));
    const { data: res } = yield call(api.post, `/specialties/delete-file/`, {
      key,
    });

    yield put(
      updateSpecialty({
        form: { ...form, saving: false },
      })
    );

    if (res.error) {
      alert(res.message);
      return false;
    }
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
