import React, { Component } from "react";
import Avatar from 'react-avatar-edit'
import './style.scss';

class AvatarUpload extends Component {
  constructor(props) {
    super(props)
    this.state = {
      preview: null,
    }
  }

  onClose = () => {
    this.props.updatePreview(null)
  }

  onCrop = (preview) => {
    this.props.updatePreview(preview)
  }

  onBeforeFileLoad = (elem) => {
  }

  render() {
    return (
      <div className='av-upload'>
        <Avatar
          width={700}
          height={300}
          label={'Upload image and drag frame to adjust portrait'}
          imageHeight={500}
          imageHeight={300}
          onCrop={this.onCrop}
          onClose={this.onClose}
          onBeforeFileLoad={this.onBeforeFileLoad}
        />
      </div>
    );
  }
}

export default AvatarUpload

