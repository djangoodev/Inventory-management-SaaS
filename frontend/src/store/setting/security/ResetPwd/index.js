import React, { Component } from 'react';
import {Form, Input, Button, notification} from 'antd';
import '../style.scss';
import * as api from "../../../../Api/ChildrenApi";
import * as setting from "../../../../redux/settings/action";
import {connect} from "react-redux";

class ResetPwdForm extends Component{
  constructor(props) {
    super(props)
    this.state = {
      confirmDirty: false,
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('new_password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  updatePwd = event => {
    event.preventDefault();
    const { form } = this.props;
    form.validateFields((error, values) => {
      if (!error) {
        this.props.setLoading(true);
        this.props.updatePassword(values).then(resp => {
          this.props.setLoading(false);
          this.props.form.resetFields();
          notification.success({
            message: 'Updated Succeed',
            description: 'You updated  your password successfully',
          });
        }).catch(e => {
          this.props.setLoading(false);
          notification.error({
            message: 'Incorrect Password',
            description: 'Your Password is not correct, please try again',
          });
        })
      }
    })
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return(
      <div className='security__pwd'>
        <div className='security__pwd__head'>Reset Password</div>
        <Form  onSubmit={this.updatePwd}>
          <Form.Item label="Old Password">
            {getFieldDecorator('old_password', {
              rules: [
                {
                  required: true,
                  message: 'Please input your old password!',
                },
              ],
            })(<Input.Password />)}
          </Form.Item>
          <Form.Item label="New Password" hasFeedback>
            {getFieldDecorator('new_password', {
              rules: [
                {
                  required: true,
                  message: 'Please input your new password!',
                },
                {
                  pattern: '.{8,}', message: 'Password must contain at least 8 characters!',
                },
                {
                  validator: this.validateToNextPassword,
                },
              ],
            })(<Input.Password />)}
          </Form.Item>
          <Form.Item label="Confirm Password" hasFeedback>
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: 'Please confirm your password!',
                },
                {
                  validator: this.compareToFirstPassword,
                },
              ],
            })(<Input.Password onBlur={this.handleConfirmBlur} />)}
          </Form.Item>
          <Form.Item >
            <Button type="primary" htmlType="submit">
              Update Password
            </Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

const ResetPwd = Form.create()(ResetPwdForm);

const mapStateToProps = (state) => ({
  userInfo: state.auth.userInfo,
});
const mapDispatchToProps = (dispatch) => ({
  getSecurityQuestions: () => api.getSecurityQuestions(),
  setLoading: (val) => dispatch(setting.setLoading(val))
});
export default connect(mapStateToProps, mapDispatchToProps)(ResetPwd)
