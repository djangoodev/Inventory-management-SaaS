import React from 'react';
import { withRouter } from 'react-router-dom';
import * as api from '../../Api/ChildrenApi';
import { connect } from 'react-redux';
import * as authAction from '../../redux/auth/action';
import img2 from '../../assets/images/big/auth-bg.jpg';
import StoreLogin from './StoreLogin';
import EmailLogin from './EmailLogin';

const sidebarBackground = {
  backgroundImage: 'url(' + img2 + ')',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center center'
};

class LocalLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sub_domain: process.env.NODE_ENV === 'production' ? window.location.hostname.split('.')[0] : 'gui',
      out_store: false,
    };
  }

  componentDidMount() {
    this.setState({
      out_store: this.state.sub_domain === 'account'
    })
  }

  render() {
    const {out_store} = this.state;
    return (
      <div
        className="auth-wrapper  align-items-center d-flex"
        style={sidebarBackground}
      >
        <div className="container">
          {
            out_store ?
              <StoreLogin/>
              :
              <EmailLogin sub_domain={this.state.sub_domain}/>
          }
        </div>
      </div>
    );
  }
}


const mapDispatchToProps = (dispatch) => ({
  signin: (values) => api.signin(values),
  saveToken: (token) => dispatch(authAction.saveToken(token)),
});

export default withRouter(connect(null, mapDispatchToProps)(LocalLogin))
