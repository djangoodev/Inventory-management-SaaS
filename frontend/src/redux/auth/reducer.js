import {
    SAVE_TOKEN, CHECK_AUTH, AUTH_LOGOUT, GET_ME_SUCCESS, GET_ME_FAILED, EMAIL_CONFIRMATION
} from '../constants/';

const INIT_STATE = {
    emailConfirmationState: false,
    isAuthenticated: false,
    userInfo: null
}

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case SAVE_TOKEN:
            return saveToken(state, action.payload);
        case CHECK_AUTH:
            return checkAuth(state);
      case AUTH_LOGOUT:
            return authLogout(state);
      case GET_ME_SUCCESS:
        return getMeSuccess(state, action.payload);
      case EMAIL_CONFIRMATION:
      return setEmailConfirmationState(state, action.payload);
      case GET_ME_FAILED:
        return getMeFailed(state);
        default:
            return state;
    }

};

function saveToken(state, payload) {
  localStorage.setItem('access_token', payload.token);
  localStorage.setItem('store_name', payload.store);
  return {
    ...state, isAuthenticated: true,
  }
}

function checkAuth(state) {
  let token = localStorage.getItem('access_token');
  return {
    ...state, isAuthenticated: !!token,
  }
}

function authLogout(state) {
  localStorage.removeItem('access_token');
  localStorage.removeItem('store_name');
  return {
    ...state, isAuthenticated: false,
  }
}

function getMeSuccess(state, payload) {
  return{
    ...state, userInfo: payload
  }
}

function getMeFailed(state) {
  return {
    ...state, isAuthenticated: false,
  }
}

function setEmailConfirmationState(state, paylaod) {
  return {
    ...state, emailConfirmationState: paylaod
  }
}