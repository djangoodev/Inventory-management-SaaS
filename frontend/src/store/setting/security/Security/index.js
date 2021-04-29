import React, { Component } from 'react';
import {Form, Input, Button, notification, Modal, Select, DatePicker} from 'antd';
import '../style.scss';
import * as api from "../../../../Api/ChildrenApi";
import * as setting from "../../../../redux/settings/action";
import {connect} from "react-redux";
const { Option } = Select;

class SecurityForm extends Component{
  constructor(props) {
    super(props)
    this.state = {
      questions: [],
      confirmSet: true,
      current_security: null,
      current_answer: null,
      confirmDirty: false,
    }
  }

  componentDidMount() {
    this.getCurrentSecurity();
    this.getSecurities();
  }

  getCurrentSecurity = () => {
    this.props.getCurrentSecurity().then(resp => {
      this.setState({
        current_security: resp.data,
        confirmSet: true
      })
    }).catch(e => {
      this.setState({
        confirmSet: false
      })
    })
  }

  getSecurities = () => {
    this.props.getSecurityQuestions().then(resp => {
      this.setState({
        questions: resp.data
      })
    })
  };

  setAnswer = e => {
    this.setState({
      current_answer: e.target.value
    })
  };

  confirmCurrentSecurity = e => {
    this.props.confirmCurrentSecurity({answer: this.state.current_answer}).then(resp => {
      this.setState({
        confirmSet: false,
        current_answer: null
      })
      notification.success({
        message: 'Success',
        description: 'Your Old Security Info Is Correct, Please Set New One',
      });
    }).catch(e => {
      notification.error({
        message: 'Error',
        description: 'Incorrect Security Information',
      });
    })
  };

  setSecurity = event => {
    event.preventDefault();
    const { form } = this.props;
    form.validateFields((error, values) => {
      if (!error) {
        this.props.setLoading(true);
        this.props.setSecurityAnswer(values).then(resp => {
          this.props.setLoading(false);
          this.props.form.resetFields();
          this.getCurrentSecurity()
          notification.success({
            message: 'Security',
            description: 'You set up your security successfully',
          });
        }).catch(e => {
          this.props.setLoading(false);
          notification.error({
            message: 'Error',
            description: 'You got error',
          });
        })
      }
    })
  };

  render() {
    const { questions, confirmSet, current_security, current_answer } = this.state;
    const { getFieldDecorator } = this.props.form;
    return(
      <div className='security__pwd'>
        <div className='security__pwd__confirm'>
        {
          current_security && (
            <div>
              {current_security.question.question}
              <Input value={current_answer} disabled={!confirmSet} className='mb-3' onChange={this.setAnswer}/>
              <Button disabled={!confirmSet} type='primary' onClick={this.confirmCurrentSecurity}>Confirm Old Security Before Update New</Button>
            </div>
          )
        }
        </div>
        <div className='security__pwd__head'>Set Security</div>

        <Form  onSubmit={this.setSecurity}>
          <Form.Item label="Question">
            {getFieldDecorator('question', {
              rules: [{required: true, message: 'Please select question'},],
            })(
              <Select disabled={confirmSet} size="default" >
                {
                  questions.map((question, index) => {
                    return(
                      <Option key={index} value={question.pk}>{question.question}</Option>
                    )
                  })
                }
              </Select>
              )}
          </Form.Item>
         <Form.Item label="Answer">
            {getFieldDecorator('answer', {
              rules: [
                {
                  required: true,
                  message: 'Please input your answer!',
                },
              ],
            })(<Input disabled={confirmSet} />)}
          </Form.Item>
          <Form.Item >
            <Button type="primary" htmlType="submit">
              Set Security
            </Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

const Security = Form.create()(SecurityForm);

const mapStateToProps = (state) => ({
  userInfo: state.auth.userInfo,
});
const mapDispatchToProps = (dispatch) => ({
  confirmCurrentSecurity: (answer) => api.confirmCurrentSecurity(answer),
  getCurrentSecurity: () => api.getCurrentSecurity(),
  getSecurityQuestions: (answer) => api.getSecurityQuestions(answer),
  setSecurityAnswer: (answer) => api.setSecurityAnswer(answer),
  setLoading: (val) => dispatch(setting.setLoading(val))
});
export default connect(mapStateToProps, mapDispatchToProps)(Security)
