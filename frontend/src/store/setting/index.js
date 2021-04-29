import React from 'react';
import {
  Row,
  Col,
  Card,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';
import classnames from 'classnames';
import './style.scss';
import { LeftPanel } from './left-panel';
import Profile  from './profile';
import VendorSetting from "./vendor-setting";
import AccountingSetting from "./account-setting";
import SecuritySetting from './security';
import {connect} from "react-redux";

class Setting extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: '1'
    };
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  render() {
    return (
      <div>
        <Row>
          <Col xs="12" md="12" lg="4">
            {this.props.userInfo && LeftPanel(this.props.userInfo)}
          </Col>
          <Col xs="12" md="12" lg="8">
            <Card>
              <Nav tabs>
                <NavItem>
                  <NavLink
                    className={classnames({ active: this.state.activeTab === '1' })}
                    onClick={() => { this.toggle('1'); }}>
                    Profile
                    </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: this.state.activeTab === '2' })}
                    onClick={() => { this.toggle('2'); }}>
                    Vendor
                    </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: this.state.activeTab === '3' })}
                    onClick={() => { this.toggle('3'); }}>
                    Setting
                    </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({ active: this.state.activeTab === '4' })}
                    onClick={() => { this.toggle('4'); }}>
                    Security
                    </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={this.state.activeTab}>
                <TabPane tabId="1">
                  {this.props.userInfo &&
                    <Profile></Profile>
                  }
                </TabPane>
                <TabPane tabId="2">
                  <VendorSetting></VendorSetting>
                </TabPane>
                <TabPane tabId="3">
                  {this.props.userInfo &&
                    <AccountingSetting></AccountingSetting>
                  }
                </TabPane>
                <TabPane tabId="4">
                  <SecuritySetting></SecuritySetting>
                </TabPane>
              </TabContent>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  userInfo: state.auth.userInfo,
});
const mapDispatchToProps = (dispatch) => ({
});
export default connect(mapStateToProps, mapDispatchToProps)(Setting)
