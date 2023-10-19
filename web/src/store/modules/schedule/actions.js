import types from './types';

export function schedulesFilter(start, end) {
  return {
    type: types.SCHEDULES_FILTER,
    start,
    end
  }
}