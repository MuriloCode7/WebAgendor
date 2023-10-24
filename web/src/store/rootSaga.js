import {all} from 'redux-saga/effects';

import schedule from './modules/schedule/sagas';
import customer from './modules/customer/sagas';
import colaborator from './modules/colaborator/sagas';

export default function* rootSaga() {
  return yield all([schedule, customer, colaborator])
}