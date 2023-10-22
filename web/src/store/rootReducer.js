import { combineReducers } from 'redux';

import schedule from './modules/schedule/reducer';
import customer from './modules/customer/reducer';

export default combineReducers({
  schedule,
  customer
})