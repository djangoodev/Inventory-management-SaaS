import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

export default function (ComposedComponent) {
  class NotAuthentication extends Component {
    componentWillMount() {
      if (this.props.isAuthenticated === true) {
        this.context.router.history.push('/s');
      }
    }

    componentWillUpdate(nextProps) {
      if (nextProps.isAuthenticated === true) {
        this.context.router.history.push('/s');
      }
    }

    render() {
      return <ComposedComponent {...this.props} />
    }
  }

  function mapStateToProps({auth}) {
    return { isAuthenticated: auth.isAuthenticated };
  }

  NotAuthentication.contextTypes = {
    router: PropTypes.object
  }

  return connect(mapStateToProps)(NotAuthentication);
}
