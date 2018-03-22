import { Form, Input, Button, Select, Modal, Row, Col, Spin } from 'antd'
import { browserHistory } from 'react-router'
import { formItemLayout, formButtonLayout, ax } from 'utils'
import styles from './ServiceAdd.less'
const Item = Form.Item
const Option = Select.Option;
const { TextArea } = Input;

class ServiceAdd extends React.Component {

  state = {
    loading: false,
    des: '',
    img: [],
    services: [],
    employees: [],
  }

  sid = this.props.params.sid
  id = this.props.params.id

  renderService = () => this.state.services.map(v => <Select.Option key={v.id} value={v.id.toString()}>{v.name}</Select.Option>)
  renderEmployee = () => this.state.employees.map(v => <Select.Option key={v.id} value={v.id.toString()}>{v.name}</Select.Option>)
  renderImg = () => this.state.img.map(v => <img key={v.id} src={v.url} width="100" height="100" />)

  componentWillMount = () => {

    ax.all([ax.get('/services'), ax.get(`/stores/${this.sid}/waiters`)])
      .then(ax.spread((se, em) => {
        this.setState({
          services: se.services,
          employees: em.waiters,
        }, _ => {
          if (this.id != 'new') {
            ax.get(`/stores/${this.sid}/services/${this.id}`)
            .then(d => {
              this.id = d.id
              this.props.form.setFieldsValue({
                service: d.service,
                price: d.price.toString(),
                memberPrice: d.memberPrice.toString(),
                extendPrice: d.extendPrice.toString(),
                extendMemberPrice: d.extendMemberPrice.toString(),
                waiter: d.waiter
              })
              this.onSelect(d.service)
            })
          }
        })
      }))
  }


  onSelect = (v) => {
    this.setState({
      loading: true
    })
    ax.get(`/services/${v}`).then(d => {
      this.setState({
        des: d.des,
        img: d.img,
        loading: false
      })
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        if (this.id == 'new') {
          ax.post(`/stores/${this.sid}/services`, values)
          .then(v => browserHistory.push('/store/service'))
        } else {
          ax.patch(`/stores/${this.sid}/services/${this.id}`, values)
          .then(v => browserHistory.push('/store/service'))
        }
      }
    });
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;

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
                label="选择项目"
              >
                {getFieldDecorator('service', {
                  rules: [{ required: true, message: '请选择项目', whitespace: true }],
                })(
                  <Select placeholder="请选择项目" onSelect={this.onSelect}>
                    {this.state.services ? this.renderService() : null}
                  </Select>
                  )}
              </Item>
              <Spin spinning={this.state.loading}>
                <Item
                  {...formItemLayout}
                  label="项目简介"
                >
                  <TextArea rows={4} autosize={true} disabled={true} style={{color:'#666', backgroundColor:'#fff', borderColor:'#fff', resize:'none'}} value={this.state.des}/>
                </Item>
                <Item {...formItemLayout} label="项目图片">
                  {this.state.img ? this.renderImg() : null}
                </Item>
              </Spin>
              <Item
                {...formItemLayout}
                label="价格"
              >
                {getFieldDecorator('price', {
                  validateFirst: true,
                  rules: [{
                    required: true, message: '请输入价格', whitespace: true
                  }, {
                    type: 'integer', message: '请输入一个整数', transform: (v) => Number(v)//Number(v)
                  }],
                })(
                  <Input addonBefore="￥" addonAfter=".00" style={{ width: '100%' }} />
                  )}
              </Item>
              <Item
                {...formItemLayout}
                label="会员价"
              >
                {getFieldDecorator('memberPrice', {
                  validateFirst: true,
                  rules: [{
                    required: true, message: '请输入会员价', whitespace: true
                  }, {
                    type: 'integer', message: '请输入一个整数', transform: (v) => Number(v)
                  }],
                })(
                  <Input addonBefore="￥" addonAfter=".00" style={{ width: '100%' }} />
                  )}
              </Item>
              <Item
                {...formItemLayout}
                label="加钟价格"
              >
                {getFieldDecorator('extendPrice', {
                  validateFirst: true,
                  rules: [{
                    required: true, message: '请输入加钟价格', whitespace: true
                  }, {
                    type: 'integer', message: '请输入一个整数', transform: (v) => Number(v)//Number(v)
                  }],
                })(
                  <Input addonBefore="￥" addonAfter=".00" style={{ width: '100%' }} />
                  )}
              </Item>
              <Item
                {...formItemLayout}
                label="加钟会员价"
              >
                {getFieldDecorator('extendMemberPrice', {
                  validateFirst: true,
                  rules: [{
                    required: true, message: '请输入加钟会员价', whitespace: true
                  }, {
                    type: 'integer', message: '请输入一个整数', transform: (v) => Number(v)
                  }],
                })(
                  <Input addonBefore="￥" addonAfter=".00" style={{ width: '100%' }} />
                  )}
              </Item>
              <Item
                {...formItemLayout}
                label="服务技师"
              >
                {getFieldDecorator('waiter')(
                  <Select
                    mode="multiple"
                    style={{ width: '100%' }}
                    placeholder="请选择服务技师"
                  >
                    {this.state.employees ? this.renderEmployee() : null}
                  </Select>
                )}
              </Item>
              <Item {...formButtonLayout}>
                <Button type="primary" htmlType="submit" className="margin-right">保存</Button>
                <Button onClick={_ => { browserHistory.push('/store/service') }}>取消</Button>
              </Item>
            </Form>
          </div>
        </div>

      </div>
    )
  }
}

export default Form.create()(ServiceAdd)