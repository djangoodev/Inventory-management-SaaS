import React, { Component } from 'react';
import {Form, Input, Button, notification, Select, DatePicker} from 'antd';
import './style.scss';
import * as api from "../../../Api/ChildrenApi";
import {connect} from "react-redux";
import * as action from '../../../redux/auth/action';
import * as setting from "../../../redux/settings/action";
import csc from 'country-state-city';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import './style.scss';
const FormItem = Form.Item;
const { Option } = Select;

class VendorInfoForm extends Component{
  static self;
  constructor(props) {
    super(props);
    VendorInfoForm.self = this;
    this.state = {
      store: null,
      countries: [],
      states: [],
      longitude: '-122.405640',
      latitude: '37.778519'
    }
  }
  componentDidMount() {
    this.getStoreInfo();
    this.getAllCountries();
  }
  getAllCountries() {
    let countries = csc.getAllCountries();
    this.setState({
      countries: countries,
    });
  };
  getStoreInfo = e => {
    this.props.getStoreInfo().then(resp => {
      this.setState({
        store: resp.data[0],
        longitude: resp.data[0].longitude,
        latitude: resp.data[0].latitude
      });
      this.setFormValue(resp.data[0])
    })
  };

  setFormValue = (store) => {
    let states = csc.getStatesOfCountry(store.country);
    this.setState({
      states: states,
    });
    this.props.form.setFieldsValue({ 'name': store.name });
    this.props.form.setFieldsValue({ 'country': store.country });
    this.props.form.setFieldsValue({ 'state': store.state });
    this.props.form.setFieldsValue({ 'city': store.city });
    this.props.form.setFieldsValue({ 'address': store.address });
    this.props.form.setFieldsValue({ 'postal_code': store.postal_code });
  };

  onChangeCountry = (value) => {
    let states = csc.getStatesOfCountry(value);
    this.setState({
      states: states,
    })
  };

  onSubmit = event => {
    event.preventDefault();
    const { form } = this.props;
    form.validateFields((error, values) => {
      values = {
        ...values,
        'longitude': this.state.longitude,
        'latitude': this.state.latitude,
        'status': 3
      }
      if (!error) {
        this.props.setLoading(true);
        VendorInfoForm.self.props.updateStore(values, this.state.store.id).then(resp => {
          VendorInfoForm.self.props.setLoading(false);
          notification.success({
            message: 'Updated Succeed',
            description: 'You updated  your account setting successfully',
          });
        });
      }
    })
  };

  mapClicked(mapProps, map, clickEvent) {
    console.log(mapProps, map, clickEvent)
  }

  onMarkerDragEnd = (cond) => {
    const { latLng } = cond;
    const lat = latLng.lat();
    const lng = latLng.lng();
    console.log(lat, lng);
    this.setState({
      latitude: lat,
      longitude: lng
    });
  }

  render() {
    const { form } = this.props;
    return(
      <div className='card vendor-setting'>
        <div className='card-header'>
          Vendor Setting
        </div>
        <div className='card-body'>
          <Form layout="vertical" className='form-group row'  hideRequiredMark onSubmit={this.onSubmit}>
            <label className='vendor-setting--head col-12'>Store Information</label>
            <FormItem className='col-6 form-item' style={{display: 'flex', float: 'right'}} label="Store Name:">
              {form.getFieldDecorator('name', {
                rules: [{ required: true, message: 'Please input store name' }],
              })(<Input className='ml-3' size="default" />)}
            </FormItem>
            <FormItem className='col-12 form-item' style={{display: 'flex'}} label="Address:">
              {form.getFieldDecorator('address', {
                rules: [{ required: true, message: 'Please input address' }],
              })(<Input className='ml-3' size="default" />)}
            </FormItem>
            <FormItem className='col-3 mr-3 form-item' label="Country">
              {form.getFieldDecorator('country', {
                rules: [{ required: true, message: 'Please input country' }],
              })(
                <Select
                  showSearch
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
                )}
            </FormItem>
            <FormItem className='col-3 form-item mr-2' label="State">
              {form.getFieldDecorator('state', {
                rules: [{ required: true, message: 'Please input country' }],
              })(
                <Select
                  showSearch
                  placeholder="Select a state"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {this.state.states.map((state, index) => {
                    return <Option key={index} value={state.id}>{state.name}</Option>
                  })}
                </Select>
                )}
            </FormItem>
            <FormItem className='col-3 form-item' label="City">
              {form.getFieldDecorator('city', {
                rules: [{ required: true, message: 'Please input your city' }],
              })(<Input size="default" />)}
            </FormItem>
            <FormItem className='col-12 form-item' style={{display: 'flex'}} label="Postal Code:">
              {form.getFieldDecorator('postal_code', {
                rules: [{ required: true, message: 'Please input postal code' }],
              })(<Input className='ml-3' size="default" />)}
            </FormItem>
            <div className='store-info--map'>
              <Map
                google={this.props.google}
                style={{width: '80%', height: '300px', position: 'relative'}}
                center={{
                  lat: this.state.latitude,
                  lng: this.state.longitude
                }}
                onClick={this.mapClicked}
                zoom={14}>
                <Marker
                  draggable
                  position={{lat: this.state.latitude, lng: this.state.longitude}}
                  onDragend={(t, map, coord) => this.onMarkerDragEnd(coord)}
                  title={'The marker`s title will appear as a tooltip.'}
                  name={'Current location'} />
                <InfoWindow onClose={this.onInfoWindowClose}>
                    <div>
                    </div>
                </InfoWindow>
              </Map>
            </div>
            <div className="form-actions col-12 form-item vendor-setting__button">
              <Button
                type="primary"
                htmlType="submit"
              >
                Save Change
              </Button>
            </div>
          </Form>
        </div>
      </div>
    )
  }
}

const VendorSetting = Form.create()(GoogleApiWrapper({
  apiKey: ('AIzaSyCjba9WGcxwpnmRelpbQc5U5sSR1_JSfbU')
})(VendorInfoForm));

const mapStateToProps = (state) => ({
  userInfo: state.auth.userInfo,
});

const mapDispatchToProps = (dispatch) => ({
  getStoreInfo: () => api.getStoreInfo(),
  updateStore: (obj, id) => api.updateStore(obj, id),
  getMeSuccess: (me) => dispatch(action.getMeSuccess(me)),
  setLoading: (val) => dispatch(setting.setLoading(val))
});
export default connect(mapStateToProps, mapDispatchToProps)(VendorSetting)
