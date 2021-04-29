import React, { Component } from 'react';
import { Button, Icon, Modal, notification } from "antd";
import TableComponent from '../../../utile/TableComponent';
import NewForm from '../NewForm';
import './style.scss';
const { confirm } = Modal;
class CategoryContent extends Component {
  static self;
  constructor(props) {
    super(props);
    CategoryContent.self = this;
    this.state = {
      sub_categories: props.sub_categories,
      selected_key: props.selected_key,
      visibleForm: false,
      init_data: null,
      selected_category_dir: props.selected_category_dir
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(this.state.sub_categories != this.props.sub_categories) {
      this.setState({
        sub_categories: this.props.sub_categories
      })
    }
    if(this.state.selected_key != this.props.selected_key) {
      this.setState({
        selected_key: this.props.selected_key
      })
    }
    if(this.state.selected_category_dir != this.props.selected_category_dir) {
      this.setState({
        selected_category_dir: this.props.selected_category_dir
      })
    }
  }

  showNewForm = e => {
    this.setState({
      init_data: null,
      visibleForm: true
    })
  }

  cancelItem = e => {
    this.setState({
      visibleForm: false
    })
  }

  updateData = (element, state) => {
    if(state === 'new') {
      this.state.sub_categories.push(element);
      this.props.updateParallelCategory(element, 'new');
    } else if (state == 'update') {
      let index = this.state.sub_categories.findIndex(record => record.id === element.id);
      this.state.sub_categories[index] = element;
      this.props.updateParallelCategory(element, 'update');
    }
    this.cancelItem();
  };

  edit = record => {
    this.setState({
      visibleForm: true,
      init_data: record
    })
  }

  delete = record => {
     confirm({
        title: 'Do you want to delete category \"' + record.title + '\"?',
        content: 'If you delete this category, all sub-categories under this one will be deleted and maybe you can get error in entity subscribed to this category',
        onOk() {
          CategoryContent.self.props.deleteCategory(record);
        },
        onCancel() {
          console.log('Cancel');
        },
      });
  };

  render() {
     const columns = [
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        width: '80%',
      },
      {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
          <span>
            <a href="javascript:;" onClick={()=>this.edit(record)}><Icon type="edit" /></a>&nbsp;&nbsp;
            <a href="javascript:;" onClick={()=>this.delete(record)}><Icon type="delete" /></a>
          </span>
        ),
      }
    ];
    const {sub_categories} = this.state;
    return(
       <div className="col-lg-12">
        <div className="card">
          <div className="card-header">
            <div>
              <Button type='primary' className='_right' onClick={this.showNewForm}>Create New Category</Button>
            </div>
          </div>
          <div className="card-body">
            <TableComponent
              data={sub_categories}
              columns={columns}
            >
            </TableComponent>
          </div>
        </div>
        <Modal
          title={this.state.init_data ? "Update Category" : "Create New Category"}
          centered
          footer={null}
          onClick = {(e) => {e.stopPropagation(); e.nativeEvent.stopImmediatePropagation();}}
          visible={this.state.visibleForm}
          onCancel={(e) => this.cancelItem(e)}
        >
          <NewForm
            selected_category_dir={this.state.selected_category_dir}
            init_data={this.state.init_data}
            closeForm={(e) => this.cancelItem(e)}
            updateData={this.updateData}
            visibleForm={this.state.visibleForm}
          ></NewForm>
        </Modal>
      </div>
    )
  }
}

export default CategoryContent
