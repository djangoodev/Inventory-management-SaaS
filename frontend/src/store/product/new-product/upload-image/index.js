import React, { Component } from 'react';
import { Upload, Icon, Modal } from 'antd';
import { baseURL } from '../../../../Api/BaseApi'
import './style.scss';

class UploadImage extends Component{
  constructor(props) {
    super(props)
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: [
        // {
        //   uid: '-1',
        //   name: 'image.png',
        //   status: 'done',
        //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        // },
      ],
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.fileList !== this.props.fileList) {
      this.setState({
        fileList: this.props.fileList
      })
    }
  }

  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await this.getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  handleChange = ({ fileList }) => {
    this.props.setImageUrls(fileList);
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
     let authToken = localStorage.getItem('access_token');
    const props = {
      name: 'file',
      action: baseURL + 'base/upload/image',
      headers: {
         'Authorization':  "JWT "+authToken
      }
    };

    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    return(
        <div className="clearfix">
        <Upload
          {...props}
          accept={'image/jpeg, image/png'}
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default UploadImage
