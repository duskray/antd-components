import { Form, Input, Button, Icon, InputNumber, Select, Checkbox } from 'antd'
import { formItemLayout, formButtonLayout } from 'utils';
import { CheckGroup } from 'components'
import { browserHistory } from 'react-router'
const FormItem = Form.Item
const InputGroup = Input.Group
const Option = Select.Option
const CheckboxGroup = Checkbox.Group

class CouponExchangeAdd extends React.Component {

  state = {
    stores: [],
    services: [],
    storeCheckedList: [],
    serviceCheckedList: [],
  }

  componentDidMount = () => {
    const stores = [
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
    ]
    const services = [
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
    ]

    const data = {
      stores,
      services,
    }

    this.setState(data)
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }


  render() {
    const { getFieldDecorator } = this.props.form

    return (
      <div className="content-inner">
        <div className="panel">
          <div className="panel-title">填写优惠券信息</div>
          <div className="panel-body">
            <Form onSubmit={this.handleSubmit}>
              <FormItem {...formItemLayout} label="名称">
                {getFieldDecorator('name', {
                  rules: [{ required:true, message: '请输入名称', whitespace: true }]
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
              <FormItem {...formItemLayout} label={`所需积分`}>
                {getFieldDecorator(`point`, {
                  rules: [{ required:true, type: 'number', message: '请输入所需积分', whitespace: true }]
                })(
                  <InputNumber precision={0} min={0} style={{ width: '100%' }}/>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="有效期"> 
                {getFieldDecorator(`validity`, {
                  rules: [{ required:true, type: 'number', message: '请输入有效期', whitespace: true }]
                })(
                    <InputNumber precision={0} min={0} style={{ width: 'calc(100% - 30px)' }}/>
                )}
                <span> 天</span>
              </FormItem>
              <FormItem {...formItemLayout} label="适用门店"> 
                {getFieldDecorator('store')(
                  <CheckGroup options={this.state.stores} />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="适用服务"> 
                {getFieldDecorator('service')(
                  <CheckGroup options={this.state.services} />
                )}
              </FormItem>
              <hr />
              <FormItem {...formButtonLayout}>
                <Button type="primary" htmlType="submit" className="margin-right">保存</Button>
                <Button onClick={() => { browserHistory.push('/coupon/exchange') }}>取消</Button>
              </FormItem>
            </Form>
          </div>
        </div>
      </div>
    )
  }
}


export default Form.create()(CouponExchangeAdd)
