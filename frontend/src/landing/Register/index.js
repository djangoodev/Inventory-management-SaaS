import React from 'react';
import validators from '../../utile/Validations';
import { withRouter } from 'react-router-dom';
import * as api from '../../Api/ChildrenApi';
import { connect } from 'react-redux';
import { message } from 'antd';
import {
  Input,
  CustomInput,
  FormGroup,
  Form,
  Row,
  Col,
  Label,
  Button
} from 'reactstrap';
import img2 from '../../assets/images/big/auth-bg.jpg';
import * as setting from "../../redux/settings/action";
import * as auth from "../../redux/auth/action";
import ApiConfig from "../../config/ApiConfig";

const sidebarBackground = {
  backgroundImage: 'url(' + img2 + ')',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center center'
};

class Register extends React.Component {
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
    }).catch(e => {
      this.props.setLoader(false);
      if(e.response.status === 400) {
        let messages = e.response.data;
        for (let property in messages) {
          if (property === 'email') {
            message.error('That e-mail address is already registered. Try logging in or use a different e-mail address.', 3);
          } else if (property === 'username') {
            message.error('That username is already taken, please pick a new one.', 3)
          } else {
            message.error(messages[property][0], 3);
          }
        }
      } else if(e.response.status === 404) {
        message.error('Same store name is already exist, Please try again', 3);
      }
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
                  <h3 className="font-medium mb-3">Sign Up to Swivel</h3>
                  <Form className="mt-3" id="loginform" action="/dashbaord">
                    <FormGroup className="mb-3">
                      <Label for="store_name" className="font-medium">
                        StoreName
                      </Label>
                      <Input
                        type="text"
                        value={this.state.store_name}
                        onChange={this.onInputChange}
                        name="store"
                        id="store"
                        placeholder="Store Name"
                        bsSize="lg"
                      />
                    </FormGroup>
                    {this.showErrors('store')}
                    <FormGroup className="mb-3">
                      <Label for="email" className="font-medium">
                        Email
                      </Label>
                      <Input
                        type="email"
                        value={this.state.email}
                        onChange={this.onInputChange}
                        name="email"
                        id="email"
                        placeholder="Email"
                        bsSize="lg"
                      />
                    </FormGroup>
                    {this.showErrors('email')}
                    <FormGroup className="mb-3">
                      <Label for="password" className="font-medium">
                        Password
                      </Label>
                      <Input
                        type="password"
                        value={this.state.password}
                        onChange={this.onInputChange}
                        name="password"
                        id="password"
                        placeholder="Password"
                        bsSize="lg"
                      />
                    </FormGroup>
                    {this.showErrors('password')}
                    <CustomInput
                      type="checkbox"
                      id="exampleCustomCheckbox"
                      label="I agree to all Terms"
                    />
                    <Row className="mb-3 mt-3">
                      <Col xs="12">
                        <Button
                          onClick={this.doRegister}
                          className={`text-uppercase ${
                            this.isFormValid() ? '' : 'disabled'
                            }`}
                          color="primary"
                          size="lg"
                          type="submit"
                          block
                        >
                          Sign Up
                        </Button>
                      </Col>
                    </Row>
                    <div className="text-center">
                      Already have an account?{' '}
                      <a
                        href="/login"
                        className="text-info ml-1"
                      >
                        <b>Sign In</b>
                      </a>
                    </div>
                  </Form>
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
  registerUser: (values) => api.register(values),
  setLoader: (boolean) => dispatch(setting.setLoading(boolean)),
  emailConfirmAction: (state) => dispatch(auth.emailConfirmAction(state)),
});

export default withRouter(connect(null, mapDispatchToProps)(Register))
