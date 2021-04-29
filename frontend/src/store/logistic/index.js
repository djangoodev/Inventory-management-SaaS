import React, { Component } from 'react';
import LgtItem from './lgt-item';
import './style.scss';

const logistics = [
  {
    img: '../../../assets/images/logo/s_logo-icon.png',
    from: 1000,
    to: 1500,
    title: 'Distance Covered',
    description: 'Anywhere in Lagos'
  },
  {
    img: '../../../assets/images/logo/s_logo-icon.png',
    from: 1000,
    to: 1500,
    title: 'Distance Covered',
    description: 'Anywhere in Lagos'
  },
  {
    img: '../../../assets/images/logo/s_logo-icon.png',
    from: 1000,
    to: 1500,
    title: 'Distance Covered',
    description: 'Anywhere in Lagos'
  },
  {
    img: '../../../assets/images/logo/s_logo-icon.png',
    from: 1000,
    to: 1500,
    title: 'Distance Covered',
    description: 'Anywhere in Lagos'
  },
  {
    img: '../../../assets/images/logo/s_logo-icon.png',
    from: 1000,
    to: 1500,
    title: 'Distance Covered',
    description: 'Anywhere in Lagos'
  },
];
class Logistic extends Component{
  constructor(props) {
    super(props);
    this.state = {}
  }
  render() {
    return(
      <div className='card products'>
        <div className='card-header'>
          Logistics
        </div>
        <div className='card-body row col-12'>
          {
            logistics.map((logistic, index) => {
              return (
                <LgtItem key={index} logistic={logistic}></LgtItem>
              )
            })
          }
        </div>
      </div>
    )
  }
}

export default Logistic
