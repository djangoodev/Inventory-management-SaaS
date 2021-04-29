import { combineReducers } from 'redux';
import settings from './settings/reducer';
import auth from './auth/reducer';
const reducers = combineReducers({
    settings,
    auth
});
export default reducers;