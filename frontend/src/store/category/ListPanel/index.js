import React, { Component } from "react";
import { connect } from 'react-redux';
import { Tree } from 'antd';
import * as api from "../../../Api/ChildrenApi";


class CategoryListPanel extends Component {
  static self;
  constructor(props) {
    super(props);
    CategoryListPanel.self = this;
    this.state = {
      parallel_categories: props.parallel_categories,
      selected_category: 0,
      data_list: [],
      selected_category_dir: []
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(this.state.selected_category !== this.props.selected_category) {
      this.setState({
        selected_category: this.props.selected_category
      }, () => CategoryListPanel.self.getDataList())
    }
    if(this.state.parallel_categories !== this.props.parallel_categories) {
      this.setState({
        parallel_categories: this.props.parallel_categories
      }, () => CategoryListPanel.self.getDataList())
    }
  }

  getDataList = e => {
    let parent_list = this.state.parallel_categories.filter(c => c.parent === this.state.selected_category);
    let data_list = [];
    parent_list.map(parent => {
      let key = parent.parent + '-' +  parent.id;
      let title = parent.title;
      let children = [];
      let found_children = this.state.parallel_categories.filter(c => c.parent === parent.id);
      found_children.map(c => {
        let key = parent.parent + '-' + c.parent + '-' +  c.id;
        let title = c.title;
        children.push({key, title, isLeaf: true})
      });
      data_list.push({key, title, children})
    });
    this.setState({
      data_list: data_list
    })
  };

  /***
   * get full dir from selected key
   * and show it on top of search page
   *
   */
  onSelect = (selectedKeys, info) => {
    if(selectedKeys.length === 0) {
      return true;
    }
    this.props.updateKey(selectedKeys[0]);
    let ids = selectedKeys[0].split('-');
    this.setState({
      selected_category_dir: []
    }, () => {
      this.getFullDirFromKey(parseInt(ids[ids.length-1]));
      this.props.updateCategory(this.state.selected_category_dir);
    })
  };

  getFullDirFromKey = id => {
    let category = this.state.parallel_categories.find(c => c.id === id);
    this.state.selected_category_dir.push(category);
    if(category.parent !== 0 ) {
      this.getFullDirFromKey(category.parent);
    } else {
      this.state.selected_category_dir.reverse();
    }
  };

  render() {
    const { data_list } = this.state;
    return (
      <Tree
        treeData={data_list}
        showLine
        onSelect={this.onSelect}
        >
      </Tree>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  getCategoryParallels: () => api.getCategoryParallels(),
});

export default connect(null, mapDispatchToProps)(CategoryListPanel)
