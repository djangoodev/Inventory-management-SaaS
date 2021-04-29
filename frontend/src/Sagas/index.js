import { takeLatest, all } from 'redux-saga/effects';
import { getMe } from './AuthSaga';
import { GET_ME } from '../redux/constants/';

export default function * root () {
  yield all([
    // some sagas only receive an action
    takeLatest(GET_ME, getMe),
  ]);
}
