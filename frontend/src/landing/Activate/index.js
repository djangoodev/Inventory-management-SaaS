import React, { Component } from "react";
import { connect } from 'react-redux';
import * as api from '../../Api/ChildrenApi';
import * as setting from '../../redux/settings/action';
import './style.scss';
import ApiConfig from "../../config/ApiConfig";
import {withRouter} from "react-router-dom";


class Activate extends Component{
  static self;
  constructor(props) {
    super(props)
    Activate.self = this;
    this.state = {
      uid: null,
      token: null,
      confirmed: false,
      got_response: false
    }
  }
  
  componentWillMount() {
    const { uid } = this.props.match.params;
    const { token } = this.props.match.params;
    this.setState({
      uid: uid,
      token: token,
    }, () => {
      this.confirmAccount();
    });
  }
  
  confirmAccount = () => {
    const request = {
      uid: this.state.uid,
      token: this.state.token
    };
    this.props.setLoader(true);
    this.props.activate(request).then(resp => {
      this.props.setLoader(false);
      this.setState({
        confirmed: true,
        got_response: true
      })
      setTimeout(function () {
        if (process.env.NODE_ENV === 'production') {
          window.location.replace(ApiConfig.accountProUrl + '/login')
        } else {
          Activate.self.props.history.push('/login');
        }
      }, 1500)
    }).catch(e => {
      this.props.setLoader(false);
      this.setState({
        got_response: true
      })
    })
  }
  
  
  render() {
    const { confirmed, got_response } = this.state;
    return(
      <div className='_active'>
        {
          got_response
          ?
            <div>
            {
              confirmed
              ?
                'Congratulation! Your email is confirmed'
              :
                'Sorry, your email is not approved'
            }
            </div>
          :
            <div>
              Please wait for a moment
            </div>
        }
      </div>
    )
  }
}


const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
  activate: (params) => api.activate(params),
  setLoader: (boolean) => dispatch(setting.setLoading(boolean)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Activate))
