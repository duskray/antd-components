import React from 'react'
import { Upload, Icon, Modal, message } from 'antd';
import styles from './PicturesWall.less';
import classnames from 'classnames';
import { ax } from 'utils'

class PicturesWall extends React.Component {
  state = {
    limit: this.props.limit || 4,
    previewVisible: false,
    previewImage: '',
    fileList: [
    // {
    //   uid: -1,
    //   name: 'xxx.png',
    //   status: 'done',
    //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    // }
    ],
  };

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleChange = (info) => {
    const {file, fileList} = info

    if (file.status === 'done') {
      message.success(`${file.name} 上传成功`)
      this.setState({ fileList })
      if (this.props.onDone) {
        this.props.onDone()
      } 
    } else if (file.status === 'error') {
      message.error(`${file.name} 上传失败`)
      this.setState({ 
        fileList: fileList.filter(v => v.status === 'done')
      })
      if (this.props.onDone) {
        this.props.onDone()
      } 
    } else if (file.status === 'uploading') {
      this.setState({ fileList })
      if (this.props.onUploading) {
        this.props.onUploading()
      } 
    } else {
      this.setState({ fileList })
    }
  }

  handleRemove = (file) => {

  }

  getImgId = () => {
    return this.state.fileList.map(v => v.response.id)
  }

  setImg = (img) => {
    if (img && img.length > 0 && img[0] && img[0].id) {
      let i = -1
      this.setState({
        fileList: img.map(v => ({
            uid: i--,
            name: '',
            status: 'done',
            url: v.url,
            response: {
              id: v.id
            }
        }))
      })
    } else {
      this.setState({
        fileList: []
      })
    }
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    // console.log(this.state.fileList)
    return (
      <div className={classnames('clearfix', styles.outerBorder)}>
        <Upload
          /* action={this.props.action || "//jsonplaceholder.typicode.com/posts/"} */
          action={this.props.action || ax.baseUrl + '/images/128'}
          listType="picture-card"
          fileList={fileList}
          accept="image/png, image/jpeg, image/gif"
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          onRemove={this.handleRemove}
          withCredentials={true}
          /* headers={{'Content-Type': 'application/x-www-form-urlencoded'}} */
        >
          {fileList.length >= this.state.limit ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default PicturesWall