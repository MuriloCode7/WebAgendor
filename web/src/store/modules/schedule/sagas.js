import { all, takeLatest, call } from "redux-saga/effects";
import api from '../../../services/api';
import consts from '../../../consts'
import types from "./types";

export function* filterSchedule({ start, end }) {
  try {
    const res = yield call(api.post('/schedules/filter', {
      companyId: consts.companyId,
      period: {
        start,
         end
      }
    }))
    console.log(res.data);
  } catch (err) {
    alert(err.message);
  }
}

export default all([takeLatest(types.SCHEDULES_FILTER, filterSchedule)]);
