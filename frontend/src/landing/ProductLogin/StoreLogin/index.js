import React from 'react';
import validators from '../../../utile/Validations';
import { withRouter } from 'react-router-dom';
import * as api from '../../../Api/ChildrenApi';
import { connect } from 'react-redux';
import * as authAction from '../../../redux/auth/action';
import * as auth from "../../../redux/auth/action";
import * as setting from '../../../redux/settings/action';
import { Modal } from 'antd';
import {
  Input,
  FormGroup,
  Form,
  Row,
  Col,
  Label,
  Button,
  Alert
} from 'reactstrap';

class StoreLogin extends React.Component {
  static self;
  constructor(props) {
    super(props);
    StoreLogin.self = this;
    this.state = {
      store: '',
      invalidStore: false,
      error: null,
      emailConfirmationState: props.emailConfirmationState,
    };
    this.validators = {store: validators.store};
    this.onInputChange = this.onInputChange.bind(this);
    this.checkStore = this.checkStore.bind(this);
    this.showErrors = this.showErrors.bind(this);
    this.formValidators = this.formValidators.bind(this);
  }

  componentDidMount() {
    if(this.state.emailConfirmationState){
      Modal.info({
        centered: true,
        title: 'E-mail Confirmation Required',
        content: 'Thanks for signing up! To get started, please check your e-mail and click on the Activate Account button.',
        okText: 'Yes',
        onOk() {
          StoreLogin.self.props.emailConfirmAction(false);
        },
      });
    }
  }

  onInputChange(event) {

    this.setState({
      [event.target.name]: event.target.value,
      invalidStore: false
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
  checkStore = (event) => {
    if (!this.isFormValid()) {
      return false
    }
    this.props.setLoading(true);
    const {store} = this.state;
    const request = {
      store,
    };
    this.props.checkStore(request).then(resp => {
      if (resp.data) {
        window.location.replace(`http://${store}.swivel.com.ng/login`);
      } else {
        this.setState({invalidStore: true});
      }
    }).catch(error => {
      this.setState({invalidStore: true});
    });
    event.preventDefault();
  };
  render() {
    const {invalidStore} = this.state;
    return (
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
                {invalidStore && (
                  <Alert color="warning">
                    Invalid Store Name
                  </Alert>)
                }
                <Row className="mb-3 mt-3">
                  <Col xs="12">
                    <Button
                      onClick={this.checkStore}
                      className={`text-uppercase ${
                        this.isFormValid() ? '' : 'disabled'
                        }`}
                      color="primary"
                      size="lg"
                      type="button"
                      block
                    >
                      Next
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
    );
  }
}

const mapStateToProps = (state) => ({
  emailConfirmationState: state.auth.emailConfirmationState
});

const mapDispatchToProps = (dispatch) => ({
  checkStore: (values) => api.checkStore(values),
  saveToken: (token) => dispatch(authAction.saveToken(token)),
  emailConfirmAction: (state) => dispatch(auth.emailConfirmAction(state)),
  setLoading: (val) => dispatch(setting.setLoading(val))
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(StoreLogin))
