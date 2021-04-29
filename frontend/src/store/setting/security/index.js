import React, { Component } from 'react';
import './style.scss';
import * as api from "../../../Api/ChildrenApi";
import * as setting from "../../../redux/settings/action";
import {connect} from "react-redux";
import ResetPwd from './ResetPwd';
import Security from './Security';

class SecuritySetting extends Component{
  constructor(props) {
    super(props)
    this.state = {
      confirmDirty: false,
    }
  }

  render() {
    return(
      <div className='security'>
        <ResetPwd></ResetPwd>
        <Security/>
      </div>
    )
  }
}


const mapStateToProps = (state) => ({
  userInfo: state.auth.userInfo,
});
const mapDispatchToProps = (dispatch) => ({
  getSecurityQuestions: () => api.getSecurityQuestions(),
  setLoading: (val) => dispatch(setting.setLoading(val))
});
export default connect(mapStateToProps, mapDispatchToProps)(SecuritySetting)
