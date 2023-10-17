import {all} from 'redux-saga/effects';

import schedule from './modules/schedule/sagas';

export default function* rootSaga() {
  return yield all([schedule])
}