import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "./redux/store";
import RequireAuth from './hoc/RequireAuth';
import RequireNotAuth from './hoc/RequireNotAuth';
import StoreLayout from "./layouts/StoreLayout";
import LandingLayout from "./layouts/LandingLayout";
import NoMatch from './landing/NoMatch';

const App = () => (
    <Provider store={configureStore()}>
        <Router basename="/">
            <Switch>
                <Route path="/s" component={RequireAuth(StoreLayout)} />
                <Route path="/" component= {RequireNotAuth(LandingLayout)} />
                <Route component={NoMatch} />
            </Switch>
        </Router>
    </Provider>
);

export default App;