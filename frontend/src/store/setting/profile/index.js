import React, {Component} from 'react';
import './style.scss';
import {connect} from "react-redux";
import csc from 'country-state-city';
import {Card, CardBody, CardSubtitle, CardTitle, Col, Row} from "reactstrap";
import { Timeline } from 'antd';

class Profile extends Component{
  constructor(props) {
    super(props);
    this.state = {
      userInfo: props.userInfo
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.userInfo !== this.props.userInfo) {
      let country = csc.getCountryById(this.props.userInfo.country);
      let state = csc.getStateById(this.props.userInfo.state);
      this.setState({
        userInfo: this.props.userInfo,
        country: country.name,
        state: state.name
      })
    }
  }

  componentDidMount() {
    let country = csc.getCountryById(this.state.userInfo.country);
    let state = csc.getStateById(this.state.userInfo.state);
    this.setState({
      country: country.name,
      state: state.name
    })
  }

  render() {
    const {userInfo} = this.state;
    console.log(userInfo)
    const avatar = (userInfo && userInfo.avatar) ? userInfo.avatar : '/resources/images/avatar.jpg';
    return (
      <div className='profile'>
        {
          userInfo &&
            <Card>
              <CardBody>
                <div className="text-center mt-4">
                  <img src={avatar} className="rounded-circle" width="150" alt="" />
                  <CardTitle className="mt-2">{userInfo.name}</CardTitle>
                  <CardSubtitle>{userInfo.username}</CardSubtitle>
                  <Row className="text-center justify-content-md-center">
                    <Col xs="4">
                      <a href="/" className="link">
                        <i className="icon-people"></i>
                        <span className="font-medium ml-2">254</span>
                      </a>
                    </Col>
                    <Col xs="4">
                      <a href="/" className="link">
                        <i className="icon-picture"></i>
                        <span className="font-medium ml-2">54</span>
                      </a>
                    </Col>
                  </Row>
                </div>
              </CardBody>
              <CardBody className="border-top">
                <div>
                  <small className="text-muted">Email address </small>
                  <h6>{userInfo.email}</h6>
                  <small className="text-muted pt-4 db">Phone</small>
                  <h6>{userInfo.phone}</h6>
                  <small className="text-muted pt-4 db">Address</small>
                  <h6>{this.state.country} {this.state.state} {userInfo.city} {userInfo.address}</h6>
                  <small className="text-muted pt-4 db">Postal Code</small>
                  <h6>{userInfo.postal_code}</h6>
                </div>
                <div className='profile__event'>
                  <div className='profile__event__head'>
                    Recent Events
                  </div>
                  <div>
                    <Timeline>
                      <Timeline.Item>2019-09-01 GuiXiao ordered shirt</Timeline.Item>
                      <Timeline.Item>2019-09-01 Peng ordered dress</Timeline.Item>
                      <Timeline.Item>2018-09-01 Galexy ordered computer</Timeline.Item>
                      <Timeline.Item>2017-09-01 Peng ordered dress</Timeline.Item>
                    </Timeline>,
                  </div>
                </div>
              </CardBody>
            </Card>
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  userInfo: state.auth.userInfo,
});
const mapDispatchToProps = (dispatch) => ({
});
export default connect(mapStateToProps, mapDispatchToProps)(Profile)

