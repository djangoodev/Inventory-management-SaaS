import React from 'react';
import PropTypes from 'prop-types';
import { Spin } from 'antd';
import './style.scss';
// set display name for component
const displayName = 'CommonLoader';

// validate component properties
const propTypes = {
  isLoading: PropTypes.bool,
  error: PropTypes.object,
};

const LoadingComponent = ({isLoading, error}) => {
  // Handle the loading state
  if (isLoading) {
    return <div className="spinner_custom" style={{position:'fixed', zIndex:'5000', width: '100vw', height: '100vh', bottom: '0'}}><Spin size="large" style={{position: "absolute", left: '50%', top: '50%', transform: "translate(-50%, -50%)"}}/>;</div>
  }
  // Handle the error state
  else if (error) {
    return <div>Sorry, there was a problem loading the page.</div>;
  }
  else {
    return null;
  }
};

LoadingComponent.displayName = displayName;
LoadingComponent.propTypes = propTypes;

export default LoadingComponent;
