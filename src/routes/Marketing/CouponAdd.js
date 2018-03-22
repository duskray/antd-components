import { Form, Input, Button, Icon, InputNumber, Select, Spin } from 'antd'
import { formItemLayout, formButtonLayout, ax } from 'utils';
import { browserHistory } from 'react-router'
const FormItem = Form.Item
const InputGroup = Input.Group
const Option = Select.Option

class CouponAdd extends React.Component {

  state = {
    loading: false
  }
  id = this.props.params.id

  componentDidMount() {
    if (this.id != 'new') {
      this.setState({
        loading: true
      })
      ax.get(`/coupons/${this.id}`)
        .then(d => {
          this.props.form.setFieldsValue({
            name: d.name,
            value: d.value,
          })
          this.setState({
            loading: false
          })
        })
    }
  }


  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        if (this.id != 'new') {
          ax.patch(`/coupons/${this.id}`, {
            ...values,
            condition: 0,
            type: 0,
          }).then(v => browserHistory.push('/coupon'))
        } else {
          ax.post(`/coupons`, {
            ...values,
            condition: 0,
            type: 0,
          }).then(v => browserHistory.push('/coupon'))
        }
        
      }
    })
  }


  render() {
    const { getFieldDecorator } = this.props.form

    return (
      <div className="content-inner">
        <div className="panel">
          <div className="panel-title">填写优惠券信息</div>
          <div className="panel-body">
            <Spin spinning={this.state.loading}>
              <Form onSubmit={this.handleSubmit}>
                <FormItem {...formItemLayout} label="名称">
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请输入名称', whitespace: true }]
                  })(
                    <Input />
                    )}
                </FormItem>
                {/* <FormItem {...formItemLayout} label={`满足金额`}>
                {getFieldDecorator(`condition`,)(
                  <InputNumber precision={0} min={0} style={{ width: '100%' }}/>
                )}
              </FormItem> */}
                <FormItem {...formItemLayout} label={`面值`} required="true">
                  <InputGroup compact>
                    <Select defaultValue="0" style={{ width: '90px' }}>
                      <Option value="0">抵扣</Option>
                      {/* <Option value="1">折扣</Option> */}
                    </Select>
                    {getFieldDecorator(`value`, {
                      rules: [{ required: true, type: 'number', message: '请输入面值', whitespace: true }],
                      initialValue: "0"
                    })(
                      <InputNumber size="large" precision={2} min={0} style={{ width: 'calc(100% - 90px)', marginRight: '0', marginTop: '0px' }} />
                      )}
                  </InputGroup>
                </FormItem>

                <hr />
                <FormItem {...formButtonLayout}>
                  <Button type="primary" htmlType="submit" className="margin-right">保存</Button>
                  <Button onClick={() => { browserHistory.push('/coupon') }}>取消</Button>
                </FormItem>
              </Form>
            </Spin>
          </div>
        </div>
      </div>
    )
  }
}


export default Form.create()(CouponAdd)
