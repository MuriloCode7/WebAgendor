import {all} from 'redux-saga/effects';

import schedule from './modules/schedule/sagas';
import customers from './modules/customer/sagas';

export default function* rootSaga() {
  return yield all([schedule, customers])
}