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
