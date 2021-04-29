import React from 'react';
import validators from '../../utile/Validations';
import { withRouter } from 'react-router-dom';
import * as api from '../../Api/ChildrenApi';
import { connect } from 'react-redux';
import * as authAction from '../../redux/auth/action';
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

const sidebarBackground = {
  backgroundImage: 'url(' + img2 + ')',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center center'
};

class LocalLogin extends React.Component {
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
    this.doLogin = this.doLogin.bind(this);
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
  doLogin = (event) => {
    if (!this.isFormValid()) {
      return false
    }
    const {store, email, password} = this.state;
    const request = {
      store,
      email,
      password
    };
    this.props.signin(request).then(resp => {
      this.props.saveToken({token: resp.data.token, store: store});
      this.props.history.push('/s/complete-profile');
    }).catch(error => {
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
                  <h3 className="font-medium mb-3">Sign In to Swivel</h3>
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
                          onClick={this.doLogin}
                          className={`text-uppercase ${
                            this.isFormValid() ? '' : 'disabled'
                            }`}
                          color="primary"
                          size="lg"
                          type="button"
                          block
                        >
                          Sign In
                        </Button>
                      </Col>
                    </Row>
                    <div className="text-center">
                      Already have an account?{' '}
                      <a
                        href="/register"
                        className="text-info ml-1"
                      >
                        <b>Sign Up</b>
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
  signin: (values) => api.signin(values),
  saveToken: (token) => dispatch(authAction.saveToken(token)),
});

export default withRouter(connect(null, mapDispatchToProps)(LocalLogin))
