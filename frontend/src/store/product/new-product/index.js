import React, { Component } from 'react';
import './style.scss';
import {Form, Input, Button, notification, Select} from 'antd';
import UploadImage from './upload-image';
import Category from './category';
import * as api from "../../../Api/ChildrenApi";
import {connect} from "react-redux";
const FormItem = Form.Item;
const { Option } = Select;

class NewProductForm extends Component{
  static self;
  constructor(props) {
    super(props);
    NewProductForm.self = this;
    this.state = {
      init_data: null,
      fileList: [],
      image_urls: [],
      selected_categories: [],
      selected_colors: [],
      categories: [],
      colors: ['red', 'green', 'blue', 'white', 'black', 'yellow', 'purple']
    }
  }

  cancelForm = e => {};

  setImageUrls = fileList => {
    let tmp_image_urls = [];
    fileList.map( file => {
      if (file.response) {
        tmp_image_urls.push(file.response)
      } else {
        tmp_image_urls.push(file.url)
      }
    });
    this.setState({
      fileList: fileList,
      image_urls: tmp_image_urls
    })
  };

  selectCategory = (value) => {
    this.setState({
      selected_categories: value
    });
    let categories = [];
    value.map(v => {
      let keys = v.split('@')[1];
      let category_ids = keys.split('-');
      let category = category_ids[category_ids.length -1];
      categories.push(category);
      return true;
    });

    this.setState({
      categories: categories
    });
  };

  onSubmit = event => {
    event.preventDefault();
    const { form, dispatch } = this.props;
    const { categories, image_urls } = this.state;
    form.validateFields((error, values) => {
      if (!error || !categories.length || !image_urls.length) {
        if (NewProductForm.self.state.init_data) {
          NewProductForm.self.props.updateCategory(values, NewProductForm.self.state.init_data.id).then(resp => {
            notification.success({
              message: 'Updated Succeed',
              description: 'You updated product ' + resp.data.name,
            });
            NewProductForm.self.props.updateData(resp.data, 'update');

          });
        } else {
          values['categories'] = this.state.categories;
          values['image_urls'] = this.state.image_urls;
          NewProductForm.self.props.createProduct(values).then(resp => {
            NewProductForm.self.props.history.push('/s/product')
            notification.success({
              message: 'Created Succeed',
              description: 'You created new product ' + resp.data.title,
            });
            NewProductForm.self.reset();
          });
        }
      }
    })
  };

  reset = e => {
    this.props.form.resetFields();
    this.setState({
      selected_categories: [],
      fileList: []
    })
  };

  handleChange = (value) => {
    this.setState({
      selected_colors: value
    })
  }

  render() {
    const { form } = this.props;
    const { colors } = this.state;
    const children = [];
    for (let i = 0; i < colors.length; i++) {
      children.push(<Option key={colors[i]}>{colors[i]}</Option>);
    }
    return(
      <div className='card new-pdt'>
        <div className='card-header'>
          Create New Product
        </div>
        <div className='card-body'>
          <Form layout="vertical" className='' hideRequiredMark onSubmit={this.onSubmit}>
            <div className='new-pdt__group'>
              <div className='new-pdt__group__head'>Product Basic Details</div>
              <div className='form-group row'>
                <FormItem className='col-12 form-item' label="Title">
                  {form.getFieldDecorator('title', {
                    initialValue: this.state.init_data ? this.state.init_data.title : null,
                    rules: [{ required: true, message: 'Please input title' }],
                  })(<Input size="default" />)}
                </FormItem>
                <FormItem className='col-12 form-item' label="Description">
                  {form.getFieldDecorator('description', {
                    initialValue: this.state.init_data ? this.state.init_data.title : null,
                    rules: [{ required: true, message: 'Please input description' }],
                  })(<Input.TextArea rows={4}/>)}
                </FormItem>
                <FormItem className='col-12 form-item' label="Category">
                  {form.getFieldDecorator('category', {
                  })(
                    <Category
                      selected_categories={this.state.selected_categories}
                      selectCategory={(val) => this.selectCategory(val)}
                    ></Category>)}
                </FormItem>
              </div>
            </div>

            <div className='new-pdt__group'>
              <div className='new-pdt__group__head'>Product Images</div>
              <div className='col-12 mt-3'>
                <UploadImage
                  fileList = {this.state.fileList}
                  setImageUrls={this.setImageUrls}
                ></UploadImage>
              </div>
            </div>


            <div className='new-pdt__group'>
              <div className='new-pdt__group__head'>Product Attributes</div>
              <div className='form-group row'>
                <FormItem className='col-6 form-item' label="Color">
                  {form.getFieldDecorator('color', {
                    rules: [{ required: true, message: 'Please input color' }],
                  })(
                    <Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      placeholder="Please select"
                    >
                      {children}
                    </Select>)}
                </FormItem>
                <FormItem className='col-6 form-item' label="Size">
                  {form.getFieldDecorator('size', {
                    initialValue: this.state.init_data ? this.state.init_data.title : null,
                    rules: [{ required: true, message: 'Please input size' }],
                  })(<Input size="default" />)}
                </FormItem>
              </div>
            </div>

            <div className='new-pdt__group'>
              <div className='new-pdt__group__head'>Product Cost</div>
              <div className='form-group row'>
                <FormItem  className='col-6 form-item' label="Cost Price">
                  {form.getFieldDecorator('cost_price', {
                    initialValue: this.state.init_data ? this.state.init_data.title : null,
                    rules: [{ required: true, message: 'Please input cost price' }],
                  })(<Input size="default"/>)}
                </FormItem>
                <FormItem  className='col-6 form-item' label="Sales Price">
                  {form.getFieldDecorator('sales_price', {
                    initialValue: this.state.init_data ? this.state.init_data.title : null,
                    rules: [{ required: true, message: 'Please input sales price' }],
                  })(<Input size="default"/>)}
                </FormItem>
                <FormItem className='col-6 form-item' label="Discount">
                  {form.getFieldDecorator('discount', {
                    initialValue: this.state.init_data ? this.state.init_data.title : null,
                    rules: [{ required: true, message: 'Please input discount' }],
                  })(<Input size="default" />)}
                </FormItem>
              </div>
            </div>

            <div className='new-pdt__group'>
              <div className='new-pdt__group__head'>Shipping Details</div>
              <div className='form-group row'>
                <FormItem className='col-6 form-item' label="Dimensions of Packaging">
                  {form.getFieldDecorator('dimension', {
                    initialValue: this.state.init_data ? this.state.init_data.title : null,
                    rules: [{ required: true, message: 'Please input dimensions of packaging' }],
                  })(<Input size="default" placeholder='L x W x H'/>)}
                </FormItem>
                <FormItem className='col-6 form-item' label="Weight of Package">
                  {form.getFieldDecorator('weight', {
                    initialValue: this.state.init_data ? this.state.init_data.title : null,
                    rules: [{ required: true, message: 'Please input weight' }],
                  })(<Input size="default" />)}
                </FormItem>
              </div>
            </div>

            <div className="form-actions col-12 form-item new-pdt__button">
              <Button
                type="primary"
                className="width-150 mr-4 _right"
                htmlType="submit"
              >
                {this.state.init_data ? "Update Product" : "Save Product"}
              </Button>
              <Button
                type="default"
                className="width-150 mr-4 _right"
                onClick={this.cancelForm}
              >
                Discard
              </Button>
            </div>
          </Form>
        </div>
      </div>
    )
  }

}

const NewProduct = Form.create()(NewProductForm)

const mapDispatchToProps = (dispatch) => ({
  createProduct: (obj) => api.createProduct(obj),
})

export default connect(null, mapDispatchToProps)(NewProduct)
