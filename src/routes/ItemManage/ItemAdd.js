import { Form, Input, Button, Select, Icon } from 'antd'
import { browserHistory } from 'react-router'
import { PicturesWall, StoreSelecter } from 'components'
import { formItemLayout, formButtonLayout, ax } from 'utils'
const Item = Form.Item
const { TextArea } = Input
const Option = Select.Option

class ItemAdd extends React.Component {
  id = this.props.params.id
  state = {}

  componentDidMount = () => {
    if (this.id != 'new') {
      ax.get(`/items/${this.id}`)
      .then(d => {
        if (d.img.id) {
          this.refs.img.setImg([d.img])
        }
        
        this.props.form.setFieldsValue({
          desc: d.desc,
          name: d.name,
          type: d.type.toString(),
        })
      })
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.img = this.refs.img.getImgId()[0]
        console.log('Received values of form: ', values)
        if (this.id == 'new') {
          ax.post('/items', values).then(d => browserHistory.push('/item'))
        } else {
          ax.patch('/items/' + this.id, values).then(d => browserHistory.push('/item'))
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
            <span>填写商品信息</span>
          </div>
          <div className="panel-body">
            <Form onSubmit={this.handleSubmit}>
              <Item
                {...formItemLayout}
                label="商品类型"
                help={<span><Icon type="exclamation-circle" /> 收费商品用于客人自助下单购买，免费商品用于迎宾开单时为客人选择赠送</span>}
              >
                {getFieldDecorator('type', {
                  rules: [{ required: true, message: '请选择商品类型', whitespace: true }],
                  initialValue: "0"
                })(
                  <Select>
                    <Option value="0">收费商品</Option>
                    <Option value="1">免费商品</Option>
                  </Select>
                )}
              </Item>
              <Item
                {...formItemLayout}
                label="商品名称"
              >
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '请输入商品名称', whitespace: true }],
                })(
                  <Input />
                )}
              </Item>
              <Item
                {...formItemLayout}
                label="商品简介"
              >
                {getFieldDecorator('desc')(
                  <TextArea rows={4} />
                )}
              </Item>
              <Item
                {...formItemLayout}
                label="商品图片"
              >
                <PicturesWall ref="img" limit="1"></PicturesWall>
              </Item>
              
              <Item
                {...formButtonLayout}
              >
                <Button type="primary" htmlType="submit" className="margin-right" >保存</Button>
                <Button onClick={_ => browserHistory.push('/item')}>取消</Button>
              </Item>
            </Form>
          </div>
        </div>
      </div>
    )
  }
}

export default Form.create()(ItemAdd)