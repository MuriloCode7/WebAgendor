import types from "./types";

export function updateSpecialty(payload) {
  return { type: types.UPDATE_SPECIALTY, payload };
}

export function addSpecialty() {
  return { type: types.ADD_SPECIALTY };
}

export function resetSpecialty() {
  return { type: types.RESET_SPECIALTY };
}

export function allSpecialties() {
  return { type: types.ALL_SPECIALTIES };
}

export function removeFile() {
  return { type: types.REMOVE_FILE };
}

export function removeSpecialty() {
  return { type: types.REMOVE_SPECIALTY };
}

