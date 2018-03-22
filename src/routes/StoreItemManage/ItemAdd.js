import { Form, Input, Button, Select, Icon, InputNumber } from 'antd'
import { browserHistory } from 'react-router'
import { PicturesWall, StoreSelecter } from 'components'
import { formItemLayout, formButtonLayout, ax } from 'utils'
const Item = Form.Item
const { TextArea } = Input
const Option = Select.Option

class ItemAdd extends React.Component {

  state = {
    items: [],
    type: 0,
  }
  sid = this.props.params.sid

  renderItem = () => this.state.items.map(v => <Select.Option key={v.id} value={v.id.toString()}>{v.name}</Select.Option>)

  onSelect = (key) => {
    const item = this.state.items.find(v => v.id == key)
    if (item.type == 0) { // 收费商品
      this.setState({
        type: 0
      })
    } else { // 免费商品
      this.setState({
        type: 1
      })
    }
  }

  

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        ax.post(`/stores/${this.sid}/items`, values).then(v => browserHistory.push('/store/item/manage'))
        
      }
    });
  }
  
  componentDidMount = () => {
    ax.get(`/items`).then(d => this.setState({
      items: d.items
    }))
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;

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
                label="选择商品"
              >
                {getFieldDecorator('item', {
                  rules: [{ required: true, message: '请选择商品', whitespace: true }],
                })(
                  <Select placeholder="请选择商品" onSelect={this.onSelect}>
                    {this.state.items ? this.renderItem() : null}
                  </Select>
                  )}
              </Item>
              <Item
                {...formItemLayout}
                label="初始库存"
              >
                {getFieldDecorator('stock', {
                  rules: [{
                    required: true, message: '请输入初始库存', whitespace: true, type: 'number'
                  }],
                })(
                  <InputNumber precision={0} min={0} style={{width:'100%'}}></InputNumber>
                )}
              </Item>
              { 
                this.state.type == 0 ? (
                  <Item
                    {...formItemLayout}
                    label="价格"
                  >
                    {getFieldDecorator('price', {
                      rules: [{ 
                        required: true, message: '请输入价格', whitespace: true 
                      }, {
                        type: 'integer', message: '请输入一个整数',transform: (v) => Number(v)
                      }],
                      validateFirst: true,
                    })(
                      <Input addonBefore="￥" addonAfter=".00" style={{width: '100%'}} />
                    )}
                  </Item>
                ) : null
              }

              { 
                this.state.type == 0 ? (
                  <Item
                    {...formItemLayout}
                    label="会员价"
                  >
                    {getFieldDecorator('memberPrice', {
                      rules: [{ 
                        required: true, message: '请输入会员价', whitespace: true 
                      }, {
                        type: 'integer', message: '请输入一个整数',transform: (v) => Number(v)
                      }],
                      validateFirst: true,
                    })(
                      <Input addonBefore="￥" addonAfter=".00" style={{width: '100%'}} />
                    )}
                  </Item>
                ) : null
              }
              
              <Item
                {...formButtonLayout}
              >
                <Button type="primary" htmlType="submit" className="margin-right">保存</Button>
                <Button onClick={_ => browserHistory.push('/store/item/manage')}>取消</Button>
              </Item>
            </Form>
          </div>
        </div>
      </div>
    )
  }
}

export default Form.create()(ItemAdd)