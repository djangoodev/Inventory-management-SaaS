import React from 'react';
import { Button } from 'antd';
import './style.scss';

export const Membership = (membership) => {
    return(
      <div className='membership card'>
        <div className='membership__title'>
          {membership.title}
        </div>
        <div className='membership__price'>
          {membership.price}
        </div>
        <div className='membership__features'>
          {
            membership.features.map((feature, index) => {
              return(
                <div className='membership__feature' key={index}>
                  {feature.title}
                </div>
              )
            })
          }
        </div>
        <div className='membership__bottom'>
          <Button>
            CHOOSE PLAN
          </Button>
        </div>
      </div>
    )
};