import { createStore, applyMiddleware, compose } from 'redux';
import { createLogger } from 'redux-logger';
import reducers from './reducers';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import * as auth from "./auth/action";
import rootSaga from '../Sagas';

export function configureStore(initialState) {
    const sagaMiddleware = createSagaMiddleware();
    const enhancers = [
      applyMiddleware(sagaMiddleware),
    ];
    enhancers.push(applyMiddleware(createLogger()));

    const store = createStore(
        reducers,
        initialState,
        composeWithDevTools(compose(...enhancers))
    );
    sagaMiddleware.run(rootSaga);
    store.dispatch(auth.checkAuth());
    return store;
}
