import types from "./types";

export function allColaborators() {
  return { type: types.ALL_COLABORATORS };
}

export function updateColaborator(payload) {
  return { type: types.UPDATE_COLABORATOR, payload };
}

export function filterColaborators() {
  return { type: types.FILTER_COLABORATORS };
}

export function addColaborator() {
  return { type: types.ADD_COLABORATOR };
}

export function resetColaborator() {
  return { type: types.RESET_COLABORATOR };
}

export function unlinkColaborator() {
  return { type: types.UNLINK_COLABORATOR };
}

export function allSpecialties() {
  return { type: types.allSpecialties };
}