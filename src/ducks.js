import { createAction } from 'redux-actions';

const SET_PMNTS = 'ampere/payments/setPayments';
const RESET = 'ampere/payments/reset';

export const setPayments = createAction(SET_PMNTS);
export const reset = createAction(RESET);

const INITIAL_STATE = {
  paymentsQueue: [],
};

export default function paymentsReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
  case SET_PMNTS: {
    const { paymentsData } = state;
    const newPayments = Array.from(paymentsData);
    newPayments.push(action.payload);
    return {
      ...state,
      paymentsData: newPayments,
    };
  }
  case RESET: {
    return {
      ...state,
      ...INITIAL_STATE,
    };
  }
  default:
    return state;
  }
}
