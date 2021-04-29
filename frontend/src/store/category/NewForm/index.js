import React, { Component } from 'react';
import { connect } from "react-redux";
import { Form, Input, Button, notification } from 'antd';
import * as api from '../../../Api/ChildrenApi';
import './style.scss';

const FormItem = Form.Item

class NewFormComponent extends Component {
  static self;
  constructor(props) {
    super(props);
    NewForm.self = this;
    this.state = {
      init_data: props.init_data,
      visibleForm: props.visibleForm,
      selected_category_dir: props.selected_category_dir,
      parent_id: 0
    };
  }

  componentDidMount() {
    this.getParent(this.state.selected_category_dir);
  }

   getParent = selected_category_dir => {
    if(selected_category_dir.length === 0) {
        this.setState({
          parent_id: 0
        })
      } else {
        this.setState({
          parent_id: selected_category_dir[selected_category_dir.length - 1].id
        })
      }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.init_data !== this.props.init_data) {
      this.setState({
        init_data: this.props.init_data
      })
    }

    if (this.state.selected_category_dir !== this.props.selected_category_dir) {
      if(this.props.selected_category_dir.length === 0) {
        this.setState({
          selected_category_dir: this.props.selected_category_dir,
          parent_id: 0
        })
      } else {
        this.setState({
          selected_category_dir: this.props.selected_category_dir,
          parent_id: this.props.selected_category_dir[this.props.selected_category_dir.length - 1].id
        })
      }
    }

    if (this.state.visibleForm !== this.props.visibleForm) {
      this.setState({
        visibleForm: this.props.visibleForm
      })
      if (!this.props.visibleForm) {
        NewForm.self.props.form.resetFields();
      }
    }
  }

  cancelForm() {
    NewForm.self.props.closeForm()
  }

  onSubmit = event => {
    event.preventDefault()
    const { form, dispatch } = this.props
    form.validateFields((error, values) => {
      if (!error) {
        values['parent'] = this.state.parent_id;
        if (NewForm.self.state.init_data) {
          NewForm.self.props.updateCategory(values, NewForm.self.state.init_data.id).then(resp => {
            notification.success({
              message: 'Updated Succeed',
              description: 'You updated category ' + resp.data.name,
            });
            NewForm.self.props.updateData(resp.data, 'update');
          });
        } else {
          NewForm.self.props.createCategory(values).then(resp => {
            notification.success({
              message: 'Created Succeed',
              description: 'You created new category ' + resp.data.name,
            });
            NewForm.self.props.updateData(resp.data, 'new');
          });
        }
        form.resetFields();
      }
    })
  }

  render() {
    const { form } = this.props;
    const { selected_category_dir } = this.state;
    return(
      <Form layout="vertical" hideRequiredMark onSubmit={this.onSubmit}>
        <div className='mb-2'>
          <label className='mr-2'><strong>Parent:</strong></label>
          <span>TheMotherLode</span>
          {
          selected_category_dir.map((category, index) => {
            return <span key={index}>{' > '} {category.title}</span>
          })
          }
        </div>
        <FormItem label="Category title">
          {form.getFieldDecorator('title', {
            initialValue: this.state.init_data ? this.state.init_data.title : null,
            rules: [{ required: true, message: 'Please input category title' }],
          })(<Input size="default" />)}
        </FormItem>
        <div className="form-actions">
          <Button
            type="primary"
            className="width-150 mr-4 _right"
            htmlType="submit"
          >
            {this.state.init_data ? "Update" : "Create"}
          </Button>
          <Button
            type="default"
            className="width-150 mr-4 _right"
            onClick={this.cancelForm}
          >
            Cancel
          </Button>
        </div>
      </Form>
    )
  }
}

const NewForm = Form.create()(NewFormComponent)

const mapDispatchToProps = (dispatch) => ({
  createCategory: (obj) => api.createCategory(obj),
  updateCategory: (obj, id) => api.updateCategory(obj, id)
})

export default connect(null, mapDispatchToProps)(NewForm)

