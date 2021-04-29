import React, { Component } from 'react';
import { connect } from 'react-redux';
import './style.scss';
import * as api from "../../../Api/ChildrenApi";
import PItem from './p-item';
import {Button} from 'antd';

class ListProduct extends Component{
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      pagination: {},
      loading: false,
      products: []
    }
    this.getProducts();
  }
  getProducts = () => {
    this.props.getProducts().then(resp => {
      this.setState({
        products: resp.data
      })
    })
  };

  render() {
    let { sortedInfo, products } = this.state;
    return (
      <div className='card products'>
        <div className='card-header'>
          Product
          <Button className='products__new' type='primary' onClick={()=>this.props.history.push('/s/product-new')}>New Product</Button>
        </div>
        <div className='card-body row col-12 '>
        {
          products.map((product, index) => {
            return(
              <PItem key={index} product={product}></PItem>
            )
          })
        }
        </div>
      </div>
    );
  }
}


const mapDispatchToProps = (dispatch) => ({
  getProducts: (obj) => api.getProducts(obj),
});

export default connect(null, mapDispatchToProps)(ListProduct)
