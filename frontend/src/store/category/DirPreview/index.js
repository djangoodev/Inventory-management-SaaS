import React, { Component } from "react";
import './style.scss';

class DirPreview extends Component{
  static self;
  constructor(props) {
    super(props);
    this.state = {
      selected_category_dir: props.selected_category_dir
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(this.state.selected_category_dir !== this.props.selected_category_dir) {
      this.setState({
        selected_category_dir: this.props.selected_category_dir
      })
    }
  }

  render() {
    const { selected_category_dir } = this.state;
    return(
      <div className='dir-body'>
        <a onClick={() =>this.props.updateSelectedCategory(0)}><strong>Swivel</strong></a>
        {
        selected_category_dir.map((category, index) => {
          return <a onClick={() => this.props.updateSelectedCategory(category)} key={index}>{' > '} {category.title}</a>
        })
        }
      </div>
    )
  }
}

export default DirPreview
