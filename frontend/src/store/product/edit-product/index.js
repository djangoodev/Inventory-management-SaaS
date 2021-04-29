import React, { Component } from 'react';
import './style.scss';
import {Form, Input, Button, notification, Select} from 'antd';
import UploadImage from './upload-image';
import Category from './category';
import * as api from "../../../Api/ChildrenApi";
import {connect} from "react-redux";
const FormItem = Form.Item;
const { Option } = Select;

class EditProductForm extends Component{
  static self;
  constructor(props) {
    super(props);
    EditProductForm.self = this;
    this.state = {
      init_data: null,
      fileList: [],
      image_urls: [],
      selected_categories: null,
      categories: [],
      product: null,
      colors: ['red', 'green', 'blue', 'white', 'black', 'yellow', 'purple']
    }
  }
  componentWillMount() {
    const { id } = this.props.match.params;
    this.setState({
      id: id
    }, () => {
      this.getProduct(id);
    })
  }

  getProduct = id => {
    this.props.getProduct(id).then(resp => {
      this.setState({
        product: resp.data[0],
        image_urls: resp.data[0].image_urls
      });
      this.setFormValue(resp.data[0])
      this.getFullDirectories(resp.data[0].category_objs)
    })
  };

  getFullDirectories = categories => {
    let directories = [];
    categories.map(category => {
      let directory = this.generateDirectoryFromObject(category);
      directories.push(directory);
      return true;
    });
    this.setState({
      directories:directories
    });
    this.getKeysFromDirectory(directories);
  };

  generateDirectoryFromObject = (category) => {
    if (category.parent) {
      let parent_dir = this.generateDirectoryFromObject(category.parent);
      // delete category.parent;
      parent_dir.push(category);
      return parent_dir;
    } else {
      // delete category.parent;
      return [category]
    }
  };

  getKeysFromDirectory(directories) {
    let keys = [];
    directories.map(dir => {
      let key = '0';
      dir.map(d => {
        key = key + '-' + d.id;
        return true;
      });
      key = dir[dir.length -1].title + '@' + key;
      keys.push(key);
      return true;
    })
    this.setState({
      selected_categories: keys,
      edit_selected_categories: keys
    })
  }

  setFormValue = (product) => {
    this.props.form.setFieldsValue({ 'title': product.title });
    this.props.form.setFieldsValue({ 'description': product.description });
    this.props.form.setFieldsValue({ 'category': product.category });
    this.props.form.setFieldsValue({ 'color': product.color });
    this.props.form.setFieldsValue({ 'size': product.size });
    this.props.form.setFieldsValue({ 'cost_price': product.cost_price });
    this.props.form.setFieldsValue({ 'sales_price': product.sales_price });
    this.props.form.setFieldsValue({ 'discount': product.discount });
    this.props.form.setFieldsValue({ 'dimension': product.dimension });
    this.props.form.setFieldsValue({ 'weight': product.weight });
    let fileList = [];
    for(let i=0; i<product.image_urls.length; i++) {
       fileList.push({
          uid: i,
          name: `image${i}.png`,
          status: 'done',
          url: product.image_urls[i],
      })
    }
    this.setState({
      fileList: fileList
    })
  };

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
        if (EditProductForm.self.state.init_data) {
          EditProductForm.self.props.updateCategory(values, EditProductForm.self.state.init_data.id).then(resp => {
            notification.success({
              message: 'Updated Succeed',
              description: 'You updated product ' + resp.data.name,
            });
            EditProductForm.self.props.updateData(resp.data, 'update');
          });
        } else {
          values['categories'] = this.state.categories;
          values['image_urls'] = this.state.image_urls;
          values['id'] = this.state.product.id;
          EditProductForm.self.props.updateProduct(values).then(resp => {
            EditProductForm.self.props.history.push('/s/product');
            notification.success({
              message: 'Updated Succeed',
              description: 'You updated new product ' + resp.data.title,
            });
            EditProductForm.self.reset();
          });
        }
      }
    })
  };

  deleteProduct = e => {
    this.props.deleteProduct(this.state.product.id).then(resp => {
      EditProductForm.self.props.history.push('/s/product');
      notification.success({
        message: 'Delete Succeed',
        description: 'You deleted new product ' + this.state.product.title,
      });
    })
  }

  reset = e => {
    this.props.form.resetFields();
    this.setState({
      selected_categories: [],
      fileList: []
    })
  };

  render() {
    const { form } = this.props;
    const { colors } = this.state;
    const children = [];
    for (let i = 0; i < colors.length; i++) {
      children.push(<Option key={colors[i]}>{colors[i]}</Option>);
    }
    return(
      <div className='card edit-pdt'>
        <div className='card-header edit-pdt__head'>
          Edit Product
          <Button onClick={this.deleteProduct} type='danger'>Delete Product</Button>
        </div>
        <div className='card-body'>
          <Form layout="vertical" className='' hideRequiredMark onSubmit={this.onSubmit}>
            <div className='edit-pdt__group'>
              <div className='edit-pdt__group__head'>Product Basic Details</div>
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
                    <div>
                      {
                        this.state.selected_categories &&
                          <Category
                            selected_categories={this.state.selected_categories}
                            selectCategory={(val) => this.selectCategory(val)}
                          ></Category>
                      }
                    </div>
                  )}
                </FormItem>
              </div>
            </div>

            <div className='edit-pdt__group'>
              <div className='edit-pdt__group__head'>Product Images</div>
              <div className='col-12 mt-3'>
                <UploadImage
                  fileList = {this.state.fileList}
                  setImageUrls={this.setImageUrls}
                ></UploadImage>
              </div>
            </div>
            <div className='edit-pdt__group'>
              <div className='edit-pdt__group__head'>Product Attributes</div>
              <div className='form-group row'>
                <FormItem className='col-6 form-item' label="Color">
                  {form.getFieldDecorator('color', {
                    initialValue: this.state.init_data ? this.state.init_data.title : null,
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

            <div className='edit-pdt__group'>
              <div className='edit-pdt__group__head'>Product Cost</div>
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

            <div className='edit-pdt__group'>
              <div className='edit-pdt__group__head'>Shipping Details</div>
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

            <div className="form-actions col-12 form-item edit-pdt__button">
              <Button
                type="primary"
                className="width-150 mr-4 _right"
                htmlType="submit"
              >
                Update Product
              </Button>
            </div>
          </Form>
        </div>
      </div>
    )
  }

}

const EditProduct = Form.create()(EditProductForm)

const mapDispatchToProps = (dispatch) => ({
  getProduct:(id) => api.getProduct(id),
  deleteProduct: (obj) => api.deleteProduct(obj),
  updateProduct: (obj) => api.updateProduct(obj),
});

export default connect(null, mapDispatchToProps)(EditProduct)
