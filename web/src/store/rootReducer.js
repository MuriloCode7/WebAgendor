import { combineReducers } from 'redux';

import schedule from './modules/schedule/reducer';
import customer from './modules/customer/reducer';
import colaborator from './modules/colaborator/reducer';

export default combineReducers({
  schedule,
  customer,
  colaborator
})