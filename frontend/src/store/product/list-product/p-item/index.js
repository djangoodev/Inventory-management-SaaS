import React, { Component } from 'react';
import {withRouter} from "react-router-dom";
import './style.scss';

class PItem extends Component{
  constructor(props) {
    super(props)
    this.state = {
      product: props.product
    }
  }

  render() {
    const {product} = this.state;
    return (
       <div onClick={() => this.props.history.push(`/s/product/${product.id}`)} className='p-item col-2'>
          <img src={product.image_urls[0]} alt=""/>
          <div>{product.title}</div>
          <div>${product.sales_price}</div>
        </div>
    );
  }
}
export default withRouter(PItem)