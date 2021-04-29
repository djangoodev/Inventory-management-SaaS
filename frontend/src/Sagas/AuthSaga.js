import { call, put  } from 'redux-saga/effects';
import * as api from '../Api/ChildrenApi';
import {getMeSuccess, logout} from '../redux/auth/action';

export function * getMe() {
  try {
    const response = yield call(api.getMe);
    if(response.status === 200) {
      yield put(getMeSuccess(response.data));
    }
  } catch(e) {
    yield put(logout());
  }
}
