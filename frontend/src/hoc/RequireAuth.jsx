import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as auth from '../redux/auth/action'
import ApiConfig from '../config/ApiConfig';


export default function (ComposedComponent) {
  class Authentication extends Component {
    componentWillMount() {
      if (this.props.isAuthenticated !== true) {
        if (process.env.NODE_ENV === 'production') {
          window.location.replace(ApiConfig.accountProUrl + '/login')
        } else {
          this.context.router.history.push('/login');
        }
      } else {
        this.props.getMe();
      }
    }

    componentWillUpdate(nextProps) {
      if (nextProps.isAuthenticated !== true) {
        if (process.env.NODE_ENV === 'production') {
          window.location.replace(ApiConfig.accountProUrl + '/login')
        } else {
          this.context.router.history.push('/login');
        }
      }
    }

    render() {
      return <ComposedComponent {...this.props} />
    }
  }

  function mapStateToProps({auth}) {
    return { isAuthenticated: auth.isAuthenticated };
  }

  const mapDispatchToProps = (dispatch) => ({
    getMe: () => dispatch(auth.getMe())
  });
  
  Authentication.contextTypes = {
    router: PropTypes.object
  }

  return connect(mapStateToProps, mapDispatchToProps)(Authentication);
}
