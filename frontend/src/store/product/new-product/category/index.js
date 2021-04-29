import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TreeSelect, Button, Modal, Input } from 'antd';
import * as api from '../../../../Api/ChildrenApi';
import './style.scss';
const { SHOW_PARENT } = TreeSelect;
const { TextArea } = Input;


class Category extends Component {
  static self;
  constructor(props) {
    super(props)
    Category.self = this;
    this.state = {
      dataList: [],
      categoryWithOutStructure: [],
      value: props.selected_categories,
      category_names: [],
      premium_state: props.premium_state,
    }
    this.getCategories();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(this.state.value !== this.props.selected_categories) {
      this.setState({
        value: this.props.selected_categories
      });
      this.getIdsFromKey(this.props.selected_categories);
    }
    if(this.state.premium_state !== this.props.premium_state) {
      this.setState({
        premium_state: this.props.premium_state
      });
    }
  }

  getCategories() {
    this.props.getTopCategories().then(resp => {
      let datalist = Category.self.generateKeyPair(resp.data);
      Category.self.setState({
        dataList: datalist
      })
      this.getIdsFromKey(Category.self.state.value);
    })
  }

  /***
   * get tree key pair list from category objects
   * @param data
   */
  generateKeyPair = (data, _preKey) => {
    const preKey = _preKey || '0';
    const dataList = [];

    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      const key = `${preKey}-${node.id}`;
      const title = node.title;
      const value = title + "@" + key;
      this.state.categoryWithOutStructure.push(node);
      if (node.children) {
        let child = Category.self.generateKeyPair(node.children, key);
        dataList.push({ title, value, key, children: child });
      } else {
        dataList.push({ title, value, key, children: null });
      }
    }
    return dataList
  };

  onSelectCategory = value => {
    if(value.length > 3) {
     Modal.warning({
        centered: true,
        zIndex: 3000,
        title: 'Choose Up to 3 Categories Describing Your Item',
        content: 'You\'ve tried to select more than 3 Categories. Please limit your selection to three or fewer. Thank you',
      });
     return true
    }
    //
    // if(!this.state.premium_state && value.length > 1) {
    //   Modal.warning({
    //     centered: true,
    //     zIndex: 3000,
    //     title: 'Category Limit Exceeded!',
    //     content: 'You tried selecting more than one Category. If you\'d like to select up to three Categories for your item, you can always upgrade and give it a Full Life. Additional Categories mean more exposure.',
    //   });
    //  return true
    // }

    // this.setState({ value });
    this.props.selectCategory(value);
    this.getIdsFromKey(value);
  };

  getIdsFromKey = keys => {
    let category_name_list = [];
    keys.map(key => {
      let filteredKey =  key.split('@')[1];
      let name = this.getFullDirectory(filteredKey);
      category_name_list.push(name);
      return true;
    });
    this.setState({
      category_names: category_name_list
    })
  }

  getFullDirectory(key) {
    let keyList = key.split('-');
    keyList.shift();
    let directory = '';
    keyList.map((k, index) => {
      let node = this.state.categoryWithOutStructure.find(c => c.id === parseInt(k, 10));
      if (index === 0)
        directory = node.title;
      else
        directory = directory + ' > ' + node.title;
      return true;
    });
    return directory;
  }

  requestCagetory() {
    // let category_suggestion = document.getElementById('category_suggestion');
  }

  render() {
    const { dataList, category_names, premium_state } = this.state;
    const tProps = {
      treeData: dataList,
      value: this.state.value,
      onChange: this.onSelectCategory,
      treeCheckable: false,
      multiple: true,
      showCheckedStrategy: SHOW_PARENT,
      searchPlaceholder: 'Please select',
      style: {
        width: '90%',
      },
    };

    return(
      <div className='categories'>
        <TreeSelect
          {...tProps}
        />
        <div className='categories'>
          {
            category_names.map((c, index) => {
              return (
                <div key={index}>
                  {
                    premium_state
                      ?
                      <strong>Category {index + 1}: </strong>
                      :
                      <strong>Category: </strong>
                  }
                  <span>{c}</span>
                </div>)
            })
          }
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  getTopCategories: () => api.getTopCategories()
});

export default connect(null, mapDispatchToProps)(Category)
