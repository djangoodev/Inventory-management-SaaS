import React, { Component } from 'react';
import './style.scss';
import {Checkbox} from 'antd';
import s_logo_icon from '../../../assets/images/logo/s_logo-icon.png';

class LgtItem extends Component{
  constructor(props) {
    super(props);
    this.state = {
      logistic: props.logistic
    }
  }

  render() {
    const {logistic} = this.state;
    return(
      <div className='lgt col-4'>
        <img src={s_logo_icon} alt=""/>
        <div><strong>Price Range</strong></div>
        <div>#{logistic.from}-#{logistic.to} per deliver</div>
        <div><strong>{logistic.title}</strong></div>
        <div>{logistic.description}</div>
        <div><Checkbox></Checkbox></div>
      </div>
    )
  }
}
export default LgtItem
