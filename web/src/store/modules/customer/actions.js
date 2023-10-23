import types from "./types";

export function allCustomers() {
  return { type: types.ALL_CUSTOMERS };
}

export function updateCustomer(payload) {
  return { type: types.UPDATE_CUSTOMER, payload };
}

export function filterCustomers() {
  return { type: types.FILTER_CUSTOMERS };
}

export function addCustomer() {
  return { type: types.ADD_CUSTOMER };
}

export function resetCustomer() {
  return { type: types.RESET_CUSTOMER };
}

export function unlinkCustomer() {
  return { type: types.UNLINK_CUSTOMER };
}