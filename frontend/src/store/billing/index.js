import React, { Component } from 'react';
import { Membership } from "./MemberShip";
import './style.scss';

class Billing extends Component{
  constructor(props) {
    super(props)
    this.state = {
      memberships: [
        {
          title: 'Starter Plan',
          price: 0,
          features: [
            {title: 'Store Setup(Theme Customization)'},
            {title: 'Hosting'},
            {title: 'Unlimited user'},
            {title: 'Payment Integration'},
            {title: '2-5 Products Listing'},
          ]
        }, {
          title: 'Basic Plan',
          price: 5000,
          features: [
            {title: 'Store Setup(Theme Customization)'},
            {title: 'Hosting'},
            {title: 'Unlimited user'},
            {title: 'Payment Integration'},
            {title: 'Unlimited Products Listing'},
            {title: 'Store Management'},
            {title: 'Logistics Partner'},
          ]
        }, {
          title: 'Extended Plan',
          price: 0,
          features: [
            {title: 'Store Setup(Theme Customization)'},
            {title: 'Hosting'},
            {title: 'Unlimited user'},
            {title: 'Payment Integration'},
            {title: 'Unlimited Products Listing'},
            {title: 'Store Management'},
            {title: 'Logistics Partner'},
            {title: 'Site & Store Analytics'},
          ]
        }
      ]
    }
  }
  render() {
    const { memberships } = this.state;
    return(
      <div  className='billing'>
        {
          memberships.map((membership, index) => {
            return(
              <div key={index}>
                {Membership(membership)}
              </div>
            )
          })
        }
      </div>
    )
  }
}
export default Billing
