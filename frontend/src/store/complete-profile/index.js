import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Steps} from 'antd';
import PhoneVerification from './PhoneVerification';
import PersonalInfo from './PersonalInfo';
import StoreInfo from './StoreInfo';
import GetStarted from './GetStarted';
import './style.scss';

const Step = Steps.Step;

class CompleteProfile extends Component {
	constructor(props) {
		super(props);
		this.state = {
		  userInfo: null,
			current: 0
		};
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
	  if (this.state.userInfo !== this.props.userInfo) {
      this.setState({
        userInfo: this.props.userInfo,
        current: this.props.userInfo.status
      });
      if (this.props.userInfo.status === 3) {
        this.props.history.push('/s/')
      }
    }
  }

  next() {
    const current = this.state.current + 1;
    this.setState({ current });
  }

  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }

  updateStep = step => {
	  this.setState({
      current: step
    })
  };

	render() {
		const { current } = this.state;
		let phone_verification = {
      title: 'Phone Verification',
      content:
        <PhoneVerification>
        </PhoneVerification>
      };
		let PersonalInformation = {
      title: 'Personal Information',
      content:
        <PersonalInfo>
        </PersonalInfo>
      };
		let StoreInformation = {
      title: 'Store Information',
      content:
        <StoreInfo updateStep={this.updateStep}>
        </StoreInfo>
      };
		let CompletePanel = {
      title: 'Confirm Profile',
      content:
        <GetStarted></GetStarted>
      };
		this.steps =[phone_verification, PersonalInformation, StoreInformation, CompletePanel,];

		return (
			<div className="card complete-profile">
        <div className="col-sm-12 complete-profile__title">
          <h1>Complete Profile Information</h1>
        </div>
        <div className="col-sm-12 complete-profile__body">
          <Steps current={current}>
            {this.steps.map(item => <Step key={item.title} title={item.title} />)}
          </Steps>
          <div className="complete-profile__body__content">
            {this.steps[current].content}
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

});

export default connect(mapStateToProps, mapDispatchToProps)(CompleteProfile);
