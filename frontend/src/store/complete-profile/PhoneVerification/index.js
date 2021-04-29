import React, { Component } from 'react';
import {Input, Button, Select, Modal} from 'antd';
import { connect } from 'react-redux';
import csc from 'country-state-city';
import * as api from '../../../Api/ChildrenApi';
import * as setting from '../../../redux/settings/action';
import * as action from "../../../redux/auth/action";
import './style.scss';
const { Option } = Select;

class PhoneVerification extends Component{
  constructor(props) {
    super(props);
    this.state = {
      countries: [],
      phone_code: '',
      phone: null,
    }
  }

  componentDidMount() {
    this.getAllCountries()
  }

  getAllCountries() {
    let countries = csc.getAllCountries();
    this.setState({
      countries: countries,
    });
  }

  onChangeCountry = (value) => {
    let selectedCountry = csc.getCountryById(value);
    this.setState({
      phone_code: selectedCountry.phonecode
    })
  };

  onChangePhone = e => {
    let val = e.target.value;
    this.setState({
        phone: val
    })
  };

  onChangePhoneCode = e => {
    let val = e.target.value;
    this.setState({
        token: val
    })
  };

  sendCode = e => {
    if (this.state.phone_code === '' || !this.state.phone) {
      Modal.warning({
        centered: true,
        title: 'Warning',
        content: 'Please insert valid phone number'
      });
      return;
    }
    const request = {
      phone_number: this.state.phone,
      country_code: '+' + this.state.phone_code
    };

    this.props.setLoading(true);
    this.props.sendSMSCode(request).then(resp => {
      this.props.setLoading(false);
      Modal.info({
        centered: true,
        title: 'Info',
        content: 'We sent sms code to your phone, Please insert code and confirm'
      });
    }).catch(e => {
      this.props.setLoading(false);
    })
  };

  checkPhoneCode = e => {
    if (this.state.phone_code === '' || !this.state.phone || !this.state.token) {
      Modal.warning({
        centered: true,
        title: 'Warning',
        content: 'Please fill all fields'
      });
      return;
    }
    const request = {
      phone_number: this.state.phone,
      country_code: '+' + this.state.phone_code,
      token: this.state.token
    };
    this.props.setLoading(true);
    this.props.checkSMSCode(request).then(resp => {
      this.updateUserPhone();
    }).catch(e => {
      this.props.setLoading(false);
      Modal.warning({
        centered: true,
        title: 'Warning',
        content: 'Incorrect Code'
      });
    })
  };

  updateUserPhone = () => {
    const request = {
      phone: this.state.phone_code + this.state.phone,
      phone_verified: true,
      status: 1
    }
    this.props.updateUser(request).then(resp => {
      this.props.setLoading(false);
      this.props.getMeSuccess(resp.data);
    })
  };

  render() {
    return(
      <div className="phone-verification">
        <div className='phone-verification--head'>
          Please Verify Your Phone Number
        </div>
        <div className='phone-verification--body'>
          <div className='phone-verification--item'>
            <label className='mr-2'>Select Country: </label>
            <Select
              showSearch
              style={{ width: 300 }}
              placeholder="Select a country"
              optionFilterProp="children"
              onChange={this.onChangeCountry}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {this.state.countries.map((country, index) => {
                return <Option key={index} value={country.id}>{country.name}</Option>
              })}
            </Select>
          </div>
          <div className='phone-verification--item'>
            <label className='mr-2 mt-2'>Phone: </label>
            <Input
              style={{ width: 300 }}
              onChange={this.onChangePhone}
              addonBefore={"+" + this.state.phone_code}
            />
          </div>
          <div className='phone-verification--item'>
            <a onClick={this.sendCode}>send verification code</a>
          </div>
          <div className='phone-verification--item'>
            <label className='mr-2 mt-2'>Verification Code: </label>
            <Input
              style={{ width: 300 }}
              onChange={this.onChangePhoneCode}
            />
          </div>
        </div>
        <div className='phone-verification--bottom'>
          <Button type='primary' onClick={this.checkPhoneCode}>Confirm And Next</Button>
        </div>
      </div>
    )
  }
}
const mapStateToProps = (state) => ({

});
const mapDispatchToProps = (dispatch) => ({
  sendSMSCode: (phone) => api.sendSMSCode(phone),
  checkSMSCode: (phone) => api.checkSMSCode(phone),
  updateUser: (obj) => api.updateUser(obj),
  getMeSuccess: (me) => dispatch(action.getMeSuccess(me)),
  setLoading: (val) => dispatch(setting.setLoading(val))
});
export default connect(mapStateToProps, mapDispatchToProps)(PhoneVerification)
