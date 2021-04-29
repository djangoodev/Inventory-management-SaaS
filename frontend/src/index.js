import React from 'react';
import ReactDOM from 'react-dom';
import './assets/scss/style.scss';
import "antd/dist/antd.css";
import './index.scss';

const App = require('./app').default;

ReactDOM.render(
	<App /> , document.getElementById('root')
);