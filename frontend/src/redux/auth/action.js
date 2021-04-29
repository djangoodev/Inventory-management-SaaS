import {
    SAVE_TOKEN, CHECK_AUTH, AUTH_LOGOUT, GET_ME_SUCCESS, GET_ME, EMAIL_CONFIRMATION
} from '../constants/';

export const saveToken = (payload) => {
    return {
        type: SAVE_TOKEN,
        payload
    }
};

export const logout = (payload) => {
    return {
        type: AUTH_LOGOUT,
        payload
    }
};

export const checkAuth = (payload) => {
    return {
        type: CHECK_AUTH,
        payload
    }
};

export function getMe() {
  return{
    type: GET_ME
  }
}

export function getMeSuccess(payload) {
  return{
    type: GET_ME_SUCCESS,
    payload
  }
}


export function emailConfirmAction(payload) {
  return{
    type: EMAIL_CONFIRMATION,
    payload
  }
}