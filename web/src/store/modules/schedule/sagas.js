import { all, takeLatest, call, put } from "redux-saga/effects";
import api from "../../../services/api";
import consts from "../../../consts";
import types from "./types";
import { scheduleUpdate } from "./actions";

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

    yield put(scheduleUpdate(res.schedules));
  } catch (err) {
    alert(err.message);
  }
}

export default all([takeLatest(types.SCHEDULES_FILTER, filterSchedule)]);
