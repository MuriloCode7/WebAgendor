import types from "./types";

export function updateTimeTable(payload) {
  return { type: types.UPDATE_TIMETABLE, payload };
}

export function addTimeTable() {
  return { type: types.ADD_TIMETABLE };
}

export function resetTimeTable() {
  return { type: types.RESET_TIMETABLE };
}

export function removeTimeTable() {
  return { type: types.REMOVE_TIMETABLE };
}

export function allTimeTables() {
  return { type: types.ALL_TIMETABLES };
}

export function allSpecialties() {
  return { type: types.ALL_SPECIALTIES };
}

export function filterColaborators() {
  return { type: types.FILTER_COLABORATORS };
}
