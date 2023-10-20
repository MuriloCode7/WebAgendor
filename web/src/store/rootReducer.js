import { combineReducers } from 'redux';

import schedule from './modules/schedule/reducer';
import customers from './modules/customer/reducer';

export default combineReducers({
  schedule,
  customers
})