import React, { Component } from 'react';
import './style.scss';

class Introduce extends Component{
    render() {
        return(
            <div className='introduce'>
                <div className='introduce-header'>
                    Swivel leading inventory management software to help you take control of your business
                </div>
                <div className='introduce-detail'>
                    Products, orders, customers and insights in one place
                </div>
            </div>
        )
    }
}

export default Introduce
