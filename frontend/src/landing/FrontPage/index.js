import React, { Component } from 'react'
import CarouselComponent from './Slider';
import './style.scss';
import Introduce from "./Introduce";

class FrontPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
          sub_domain: process.env.NODE_ENV === 'production' ? window.location.hostname.split('.')[0] : 'swivel',
        }
    }
    componentDidMount() {
        if (this.state.sub_domain !== 'swivel') {
            window.location.replace('http://swivel.com.ng');
        }
    }

    render() {
        return(
            <div className='landing'>
                <div>
                    <CarouselComponent></CarouselComponent>
                    <Introduce></Introduce>
                </div>
            </div>
        )
    }
}

export default FrontPage