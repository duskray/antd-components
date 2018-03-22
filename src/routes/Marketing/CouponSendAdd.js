import { Form, Input, Button, DatePicker, Select, Row, Col, InputNumber, Checkbox } from 'antd'
import { browserHistory } from 'react-router'
import { formItemLayout, formButtonLayout } from 'utils'
const FormItem = Form.Item
const { TextArea } = Input
const Option = Select.Option
const CheckboxGroup = Checkbox.Group

class CouponSendAdd extends React.Component {

  state = {
    stores: [],
    services: [],
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  componentDidMount = () => {
    const data = {
      stores: [
        {
          value: 1,
          label: '门店1门店1门店1门店1',
        },
        {
          value: 2,
          label: '门店2门店2',
        },
        {
          value: 3,
          label: '门店3门店3门店3',
        },
        {
          value: 4,
          label: '门店4',
        },
        {
          value: 5,
          label: '门店1门店1门店1门店1',
        },
        {
          value: 6,
          label: '门店1门店1门店1门店1',
        },
        {
          value: 7,
          label: '门店1门店1门店1门店1',
        },
        {
          value: 8,
          label: '门店1门店1门店1门店1',
        },
      ],
      services: [
        {
          value: 1,
          label: '门店1门店1门店1门店1',
        },
        {
          value: 2,
          label: '门店2门店2',
        },
        {
          value: 3,
          label: '门店3门店3门店3',
        },
        {
          value: 4,
          label: '门店4',
        },
        {
          value: 5,
          label: '门店1门店1门店1门店1',
        },
        {
          value: 6,
          label: '门店1门店1门店1门店1',
        },
        {
          value: 7,
          label: '门店1门店1门店1门店1',
        },
        {
          value: 8,
          label: '门店1门店1门店1门店1',
        },
      ],
    }

    this.setState(data)
  }
  

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return
      }
      console.log(fieldsValue)
    })
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;

    return (
      <div className="content-inner">
        <div className="panel">
          <div className="panel-title">
            <span>用户检索</span>
          </div>
          <div className="panel-body">
            <Form>
              <Row>
                <Col xs={{ span: 24 }} sm={{ span: 12 }}>
                  <FormItem label="来源" labelCol={{ sm: { span: 6 } }} wrapperCol={{ sm: { span: 18 } }} colon={false}>
                    {getFieldDecorator(`from`, {
                      initialValue: '0'
                    })(
                      <Select>
                        <Option value="0">全部</Option>
                        <Option value="1">微信</Option>
                        <Option value="2">APP</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col xs={{ span: 24 }} sm={{ span: 12 }}>
                  <FormItem label="身份" labelCol={{ sm: { span: 6 } }} wrapperCol={{ sm: { span: 18 } }} colon={false}>
                    {getFieldDecorator(`memberType`, {
                      initialValue: '0'
                    })(
                      <Select>
                        <Option value="0">全部</Option>
                        <Option value="1">会员</Option>
                        <Option value="2">非会员</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col xs={{ span: 24 }} sm={{ span: 12 }}>
                  <FormItem label="注册日期起始" labelCol={{ sm: { span: 6 } }} wrapperCol={{ sm: { span: 18 } }} colon={false}>
                    {getFieldDecorator(`registrationFrom`, {
                    })(
                      <DatePicker style={{width:'100%'}} />
                      )}
                  </FormItem>
                </Col>
                <Col xs={{ span: 24 }} sm={{ span: 12 }}>
                  <FormItem label="结束" labelCol={{ sm: { span: 6 } }} wrapperCol={{ sm: { span: 18 } }} colon={false}>
                    {getFieldDecorator(`registrationTo`, {
                    })(
                      <DatePicker style={{width:'100%'}} />
                      )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col xs={{span: 6}} sm={{span: 6}}>
                  <FormItem label="余额" labelCol={{ sm: { span: 12 }, xs: { span: 24} }} wrapperCol={{ sm: { span: 12 }, xs: { span: 22} }} colon={false}>
                    {getFieldDecorator(`balanceType`, {
                      initialValue: '1'
                    })(
                      <Select>
                        <Option value="1">大于</Option>
                        <Option value="2">小于</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col xs={{span: 18}} sm={{span: 18}}>
                  <FormItem label="&nbsp;" labelCol={{ sm: { span: 1 }, xs: { span: 24} }} wrapperCol={{ sm: { span: 7 }, xs: { span: 24} }} colon={false}>
                    {getFieldDecorator(`balanceNum`, {
                    })(
                      <InputNumber precision={0} style={{width: '100%'}}/>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col xs={{span: 6}} sm={{span: 6}}>
                  <FormItem label="积分" labelCol={{ sm: { span: 12 }, xs: { span: 24} }} wrapperCol={{ sm: { span: 12 }, xs: { span: 22} }} colon={false}>
                    {getFieldDecorator(`pointType`, {
                      initialValue: '1'
                    })(
                      <Select>
                        <Option value="1">大于</Option>
                        <Option value="2">小于</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col xs={{span: 18}} sm={{span: 18}}>
                  <FormItem label="&nbsp;" labelCol={{ sm: { span: 1 }, xs: { span: 24} }} wrapperCol={{ sm: { span: 7 }, xs: { span: 24} }} colon={false}>
                    {getFieldDecorator(`pointNum`, {
                    })(
                      <InputNumber precision={0} style={{width: '100%'}}/>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col xs={{span: 6}} sm={{span: 6}}>
                  <FormItem label="消费总额" labelCol={{ sm: { span: 12 }, xs: { span: 24} }} wrapperCol={{ sm: { span: 12 }, xs: { span: 22} }} colon={false}>
                    {getFieldDecorator(`amountType`, {
                      initialValue: '1'
                    })(
                      <Select>
                        <Option value="1">大于</Option>
                        <Option value="2">小于</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col xs={{span: 18}} sm={{span: 18}}>
                  <FormItem label="&nbsp;" labelCol={{ sm: { span: 1 }, xs: { span: 24} }} wrapperCol={{ sm: { span: 7 }, xs: { span: 24} }} colon={false}>
                    {getFieldDecorator(`amountNum`, {
                    })(
                      <InputNumber precision={0} style={{width: '100%'}}/>
                    )}
                  </FormItem>
                </Col>
              </Row>

              <FormItem wrapperCol={{ sm: { span: 16, offset: 3 }, xs: { span: 24, offset: 0} }}>
                <Button type="primary" htmlType="submit" className="margin-right">检索</Button>
                <span>共找到1200个用户</span>
              </FormItem>
            </Form>
          </div>
        </div>
        <div className="panel">
          <div className="panel-title">
            <span>发放内容</span>
          </div>
          <div className="panel-body">
            <Form onSubmit={this.handleSubmit}>
              <FormItem {...formItemLayout} label="名称"> 
                {getFieldDecorator('name', {
                  rules: [{ required: true, message: '请输入名称', whitespace: true }],
                })(
                  <Input />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="优惠券"> 
                {getFieldDecorator(`coupon`, {
                  rules: [{ required: true, message: '请选择优惠券', whitespace: true }],
                  initialValue: '1'
                })(
                  <Select>
                    <Option value="0">#12 8折券</Option>
                    <Option value="1">#111 满50减11</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="适用门店"> 
                {getFieldDecorator('store')(
                  <CheckboxGroup options={this.state.stores} />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="适用服务"> 
                {getFieldDecorator('service')(
                  <CheckboxGroup options={this.state.services} />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="发放时间"> 
                {getFieldDecorator('sendTime', {
                  rules: [{ type: 'object', required: true, message: '请选择发放时间' }],
                })(
                  <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="过期时间"> 
                {getFieldDecorator('expirationTime', {
                  rules: [{ type: 'object', required: true, message: '请选择过期时间' }],
                })(
                  <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                )}
              </FormItem>
              <FormItem
                {...formButtonLayout}
              >
                <Button type="primary" htmlType="submit" className="margin-right">保存</Button>
                <Button onClick={() => { browserHistory.push('/coupon/send') }}>取消</Button>
              </FormItem>
            </Form>
          </div>
        </div>
      </div>
    )
  }
}

export default Form.create()(CouponSendAdd)