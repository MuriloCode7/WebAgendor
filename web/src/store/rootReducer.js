import { combineReducers } from "redux";

import schedule from "./modules/schedule/reducer";
import customer from "./modules/customer/reducer";
import colaborator from "./modules/colaborator/reducer";
import specialty from "./modules/specialty/reducer";
import timeTable from "./modules/timeTable/reducer";

export default combineReducers({
  schedule,
  customer,
  colaborator,
  specialty,
  timeTable,
});
