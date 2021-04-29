import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {connect} from "react-redux";
import * as action from "../../../redux/auth/action";
import * as setting from "../../../redux/settings/action";

class GetStarted extends Component {
  static self;
	constructor(props) {
		super(props);
    GetStarted.self = this;
		this.state = {
			savedToCloud: null
		};
	}

	getStarted = e => {
	  this.props.setLoading(true);
	  setTimeout(function () {
      GetStarted.self.props.setLoading(false);
      GetStarted.self.props.userInfo.status = 3;
      GetStarted.self.props.getMeSuccess(GetStarted.self.props.userInfo);
      GetStarted.self.props.history.push('/s/')
    }, 1000)

  };

	render() {
		return (
			<div className="step step4 mt-5">
				<div className="row justify-content-md-center">
					<div className="col-lg-8">
						<form id="Form" className="form-horizontal">
							<div className="form-group">
								<label className="col-md-12 control-label">
                  <div>
                    <h1>Thanks</h1>
                    <h2>Everything is Ready. You can start your store now...</h2>
                    <span className="btn btn-info text-white" onClick={() => { this.getStarted() }}>Get Started</span>
                  </div>
								</label>
							</div>
						</form>
					</div>
				</div>
			</div>
		)
	}
}
const mapStateToProps = (state) => ({
  userInfo: state.auth.userInfo
});
const mapDispatchToProps = (dispatch) => ({
  getMeSuccess: (me) => dispatch(action.getMeSuccess(me)),
  setLoading: (val) => dispatch(setting.setLoading(val))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GetStarted));
