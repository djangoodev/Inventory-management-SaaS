import React from 'react';
import validators from '../../../utile/Validations';
import { Button } from 'antd';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  Row,
  Col,
} from 'reactstrap';
import img2 from '../../../assets/images/big/auth-bg.jpg';
import * as setting from "../../../redux/settings/action";
import ApiConfig from "../../../config/ApiConfig";
import './style.scss';

const sidebarBackground = {
  backgroundImage: 'url(' + img2 + ')',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center center'
};

class SwitchUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      store: '',
      email: '',
      password: '',
      error: null
    };
    this.validators = validators;
    this.onInputChange = this.onInputChange.bind(this);
    this.doRegister = this.doRegister.bind(this);
    this.showErrors = this.showErrors.bind(this);
    this.formValidators = this.formValidators.bind(this);
  }
  onInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
    this.formValidators([event.target.name], event.target.value);
  }
  formValidators(fieldName, value) {
    this.validators[fieldName].errors = [];
    this.validators[fieldName].state = value;
    this.validators[fieldName].valid = true;
    this.validators[fieldName].rules.forEach(rule => {
      if (rule.test instanceof RegExp) {
        if (!rule.test.test(value)) {
          this.validators[fieldName].errors.push(rule.message);
          this.validators[fieldName].valid = false;
        }
      } else if (typeof rule.test === 'function') {
        if (!rule.test(value)) {
          this.validators[fieldName].errors.push(rule.message);
          this.validators[fieldName].valid = false;
        }
      }
    });
  }
  isFormValid() {
    let status = true;
    Object.keys(this.validators).forEach(field => {
      if (!this.validators[field].valid) {
        status = false;
      }
    });
    return status;
  }
  showErrors(fieldName) {
    const validator = this.validators[fieldName];
    const result = '';
    if (validator && !validator.valid) {
      const errors = validator.errors.map((info, index) => {
        return (
          <span className="error" key={index}>
            * {info}
            <br />
          </span>
        );
      });

      return <div className="error mb-2">{errors}</div>;
    }
    return result;
  }
  doRegister = (event) => {
    const {store, email, password} = this.state;
    const request = {
      store,
      email,
      password
    }
    this.props.setLoader(true);
    this.props.registerUser(request).then(resp => {
      this.props.setLoader(false);
      this.props.emailConfirmAction(true);
      if (process.env.NODE_ENV === 'production') {
          window.location.replace(ApiConfig.accountProUrl + '/login')
        } else {
          this.props.history.push('/login');
        }
    }).catch(error => {
      this.props.setLoader(false);
      alert('Something went wrong!');
    });
    event.preventDefault();
  };

  render() {
    return (
      <div
        className="auth-wrapper  align-items-center d-flex"
        style={sidebarBackground}
      >
        {/*--------------------------------------------------------------------------------*/}
        {/*Login2 Cards*/}
        {/*--------------------------------------------------------------------------------*/}
        <div className="container">
          <div>
            <Row className="no-gutters justify-content-center">
              <Col md="8" lg="6" className="bg-white">
                <div className="p-4">
                  <h3 className="font-medium mb-3">How are you going to sign up with?</h3>
                  <div className='switch'>
                    <Button className='switch__item'>
                      Customer
                    </Button>
                    <Button onClick={() => this.props.history.push('/register')} className='switch__item'>
                      Vendor
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}


const mapDispatchToProps = (dispatch) => ({
  setLoader: (boolean) => dispatch(setting.setLoading(boolean)),
});

export default withRouter(connect(null, mapDispatchToProps)(SwitchUser))
