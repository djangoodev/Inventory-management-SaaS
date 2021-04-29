import React, { Component } from 'react';
import CategoryListPanel from './ListPanel';
import CategoryContent from './Content';
import DirPreview from "./DirPreview";
import * as api from "../../Api/ChildrenApi";
import {connect} from "react-redux";
import * as setting from '../../redux/settings/action';
import './style.scss';

class CategoryManagement extends Component {
  static self;
  constructor(props) {
    super(props);
    CategoryManagement.self = this;
    this.state = {
      selected_category_dir: [],
      parallel_categories: [],
      selected_key: '0',
      selected_category: 0,
      selected_category_preview: null,
      sub_categories: []
    };
    this.getParallelCategory();
  }

   /***
   * get all categories from backend
   *
   */
  getParallelCategory() {
    this.props.setLoading(true);
    this.props.getCategoryParallels().then(resp => {
      this.props.setLoading(false);
      CategoryManagement.self.setState({
        parallel_categories: resp.data
      });
      CategoryManagement.self.getSubCategories(0)
    })
  }

  updateSelectedCategory = category => {
    let key = '0';
    if (category === 0) {
      console.log(category);
      key = this.getKeyOfSelectedCategory(0);
      this.getSubCategories(0);
      this.setState({
        selected_category: 0,
        selected_category_preview: null,
        selected_category_dir: [],
        selected_key: key
      })
    } else {
      key = this.getKeyOfSelectedCategory(category.id);
      this.getSubCategories(category.id);
      let new_dir = this.state.selected_category_dir.filter(dir => dir.id <= category.id);
      this.setState({
        selected_category: category.id,
        selected_category_preview: category,
        selected_category_dir: new_dir,
        selected_key: key
      })
    }
  };

  getSubCategories = id => {
    let sub_categories = this.state.parallel_categories.filter(c => c.parent === id);
    this.setState({
      sub_categories: sub_categories
    })
  };

  getKeyOfSelectedCategory = (id, _key) => {
    let preKey = _key || '0';
    if(id === 0) {
      return '0'
    }
    let category = this.state.parallel_categories.find(c => c.id === id);
    if(category.parent !== 0) {
      preKey = category.id.toString() + (preKey !== '0' ? '-' + preKey : '');
      let key = this.getKeyOfSelectedCategory(category.parent, preKey);
      return key;
    } else {
      preKey = category.parent.toString() + '-' + category.id.toString() + (preKey !== '0' ? '-' + preKey : '');
      return preKey
    }
  };

  updateKey = key => {
    let keys= key.split('-');
    let full_key = this.getKeyOfSelectedCategory(parseInt(keys[keys.length-1]));
    this.getSubCategories(parseInt(keys[keys.length-1]));
    this.setState({
      selected_key: full_key,
    })
  };

  updateParallelCategories = categories => {
    this.setState({
      parallel_categories: categories
    }, () => this.getSubCategories(0))
  };

  updateParallelCategory = (category, state) => {
    if(state === 'new') {
      CategoryManagement.self.setState({
        parallel_categories: [...CategoryManagement.self.state.parallel_categories, category]
      })
    } else {
      let index = this.state.parallel_categories.findIndex(record => record.id === category.id);
      this.state.parallel_categories[index] = category;
      CategoryManagement.self.setState({
        parallel_categories: [...CategoryManagement.self.state.parallel_categories]
      })
    }
  };

  updateCategory = dir => {
    let selected_category = this.state.selected_category;
    if(dir.length === 2) {
      selected_category = dir[dir.length-1].id;
    }
    this.setState({
      selected_category_dir: dir,
      selected_category_preview: dir[dir.length-1],
      selected_category: selected_category,
    })
  };

  deleteCategory = category => {
    this.props.deleteCategory(category).then(resp => {
      let new_parallel_categories = CategoryManagement.self.state.parallel_categories.filter(p => p.id !== category.id);
      let new_sub_categories = CategoryManagement.self.state.sub_categories.filter(p => p.id !== category.id);
      CategoryManagement.self.setState({
        parallel_categories: new_parallel_categories,
        sub_categories: new_sub_categories
      })

    })
  };

  render() {
    return(
      <div className='category-manage'>
        <div className='category-manage__dir'>
          <DirPreview
            selected_category_dir={this.state.selected_category_dir}
            updateSelectedCategory={this.updateSelectedCategory}
          ></DirPreview>
        </div>
        <div className='category-manage__body'>
          <div className='category-manage__body__list card'>
            <CategoryListPanel
              parallel_categories={CategoryManagement.self.state.parallel_categories}
              selected_category={this.state.selected_category}
              updateCategory={this.updateCategory}
              updateKey={this.updateKey}
              updateParallelCategories={this.updateParallelCategories}
            ></CategoryListPanel>
          </div>
          <div className='category-manage__body__content'>
            <CategoryContent
              deleteCategory={this.deleteCategory}
              selected_category_dir={this.state.selected_category_dir}
              updateParallelCategory={this.updateParallelCategory}
              selected_key={this.state.selected_key}
              sub_categories={this.state.sub_categories}
            ></CategoryContent>
          </div>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  getCategoryParallels: () => api.getCategoryParallels(),
  deleteCategory: (category) => api.deleteCategory(category),
  setLoading: (val) => dispatch(setting.setLoading(val))
});

export default connect(null, mapDispatchToProps)(CategoryManagement)

