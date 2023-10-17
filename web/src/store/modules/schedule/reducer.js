const INITIAL_STATE = {
  schedules: [],
};

function schedule(state = INITIAL_STATE, action) {
  switch(action.type) {
    case '@schedule/ALL': {
      /////
    }
    default:
      return state;
  }
}

export default schedule;