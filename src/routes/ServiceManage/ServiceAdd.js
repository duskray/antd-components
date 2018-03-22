import { Form, Input, Button, Select, Modal, Row, Col } from 'antd'
import { browserHistory } from 'react-router'
import { PicturesWall, StoreSelecter } from 'components'
import { formItemLayout, formButtonLayout } from 'utils'
import { ax } from 'utils'
import styles from './ServiceAdd.less'
const Item = Form.Item
const Option = Select.Option;
const { TextArea } = Input;

class ServiceAdd extends React.Component {

  state = {
    fileList: [],
    uploading: false,
  }  

  id = this.props.params.id

  componentDidMount = () => {
    // this.id = encodeURIComponent(this.id)
    // console.log(this.id)
    if (this.id != 'new') {
      ax.get('/services/' + this.id)
        .then(d => {
          this.id = d.id
          this.refs.topImg.setImg([d.topImg])
          this.refs.img.setImg(d.img)

          delete d.id
          delete d.topImg
          delete d.img
          d.time = d.time.toString()
          this.props.form.setFieldsValue(d)

        })
    }
  }
  

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.topImg = this.refs.topImg.getImgId()[0]
        values.img = this.refs.img.getImgId()
        console.log('Received values of form: ', values)
        if (this.id == 'new') {
          ax.post('/services', values).then(d => browserHistory.push('/service'))
        } else {
          ax.patch('/services/' + this.id, values).then(d => browserHistory.push('/service'))
        }
      }
    })
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const data = {
      
    }

    const children = [];
    for (let i = 10; i < 36; i++) {
      children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
    }

    return (
      <div className="content-inner">
        <div className="panel">
          <div className="panel-title">
            <span>填写项目信息</span>
          </div>
          <div className="panel-body">
            <Form onSubmit={this.handleSubmit}>
              <Item
                {...formItemLayout}
                label="项目名称"
              >
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '请输入项目名称', whitespace: true }],
                })(
                  <Input />
                )}
              </Item>
              <Item
                {...formItemLayout}
                label="服务时长"
              >
                {getFieldDecorator('time', {
                  rules: [{
                    required: true, pattern: /^[1-9]\d*$/, message: '请输入一个正整数'
                  }]
                })(
                  <Input addonAfter="分钟" style={{width: '100%'}} />
                )}
              </Item>
              <Item
                {...formItemLayout}
                label="项目头图"
              >

                  <PicturesWall ref="topImg" limit="1"></PicturesWall>

              </Item>
              <Item
                {...formItemLayout}
                label="项目其他图片"
              >
                  <PicturesWall ref="img" limit="4"></PicturesWall>

              </Item>
              <Item
                {...formItemLayout}
                label="项目简介"
              >
                {getFieldDecorator('des')(
                  <TextArea rows={4} />
                )}
              </Item>
              <Item
                {...formItemLayout}
                label="项目完整介绍"
              >
                {getFieldDecorator('fullDes')(
                  <TextArea rows={6} />
                )}
              </Item>
              <Item
                {...formItemLayout}
                label="服务提示说明"
              >
                {getFieldDecorator('tips')(
                  <TextArea rows={4} />
                )}
              </Item>
              <Item
                {...formButtonLayout}
              >
                <Button type="primary" htmlType="submit" className="margin-right">保存</Button>
                <Button onClick={ _ => { browserHistory.push('/service') } }>取消</Button>
              </Item>
            </Form>
          </div>
        </div>
      </div>
    )
  }
}

export default Form.create()(ServiceAdd)