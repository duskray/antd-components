import { Form, Input, Button, DatePicker, Select, Row, Col, InputNumber, Checkbox, Icon, Spin } from 'antd'
import { browserHistory } from 'react-router'
import { formItemLayout, formButtonLayout, ax } from 'utils'
import moment from 'moment'
const FormItem = Form.Item
const { TextArea } = Input
const Option = Select.Option
const CheckboxGroup = Checkbox.Group

class CouponReceiveAdd extends React.Component {

  couponsIndex = 1
  state = {
    loading: false,
    baseCoupons: [],
    coupons: [{
      id: 0,
      coupon: '',
      usingValidity: ['', '']
    }],
  }
  id = this.props.params.id


  componentDidMount = () => {
    this.setState({
      loading: true
    })
    ax.get(`/coupons`, {
      keyword: '',    // 检索关键词
      current: 1,
      pageSize: 9999,
      field: '',
      order: 'ascend'
    }).then(baseCoupons => {
      this.setState({
        baseCoupons: baseCoupons.coupons
      }, _ => {
        if (this.id != 'new') {
          ax.get(`/coupons-receive/${this.id}`).then(d => {

            this.couponsIndex = 0
            d.conversionValidity = d.conversionValidity.map(d => moment(d))
            d.coupons.map(c => {
              c.id = this.couponsIndex++
              c.usingValidity = c.usingValidity.map(u => moment(u))
              return c
            })
            this.setState({
              coupons: d.coupons,
              loading: false
            })
            this.props.form.setFieldsValue({
              name: d.name,
              conversionValidity: d.conversionValidity,
              coupons: d.coupons
            })

          }).catch(d => {
            this.setState({
              loading: false
            })
          })
        } else {
          this.setState({
            loading: false
          })
        }

      })
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.conversionValidity = values.conversionValidity.map(v => v.format('YYYY-MM-DD'))
        values.coupons = values.coupons.filter(v => v).map(v => {
          v.usingValidity = v.usingValidity.map(u => u.format('YYYY-MM-DD'))
          return v
        })
        console.log('Received values of form: ', values)
        if (this.id == 'new') {
          ax.post(`/coupons-receive`, { data: JSON.stringify(values) }).then(v => browserHistory.push('/coupon-receive'))
        } else {
          ax.patch(`/coupons-receive/${this.id}`, { data: JSON.stringify(values) }).then(v => browserHistory.push('/coupon-receive'))
        }
      }
    });
  }


  addCoupon = () => {
    this.setState({
      coupons: [...this.state.coupons, {
        id: this.couponsIndex++,
        coupon: '',
        usingValidity: ['', '']
      }]
    })
  }

  removeCoupon = (id) => {
    this.setState({
      coupons: this.state.coupons.filter(v => v.id != id)
    })
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form
    const renderCoupons = (coupons) => (
      coupons.map(v => <Option key={v.id} value={v.id}>{v.name}</Option>)
    )

    return (
      <div className="content-inner">
        <div className="panel">
          <div className="panel-title">
            <span>发放内容</span>
          </div>
          <div className="panel-body">
            <Spin spinning={this.state.loading}>
              <Form onSubmit={this.handleSubmit}>
                <FormItem {...formItemLayout} label="名称">
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请输入名称', whitespace: true }],
                  })(
                    <Input />
                    )}
                </FormItem>
                <FormItem {...formItemLayout} label="领取期限">
                  {getFieldDecorator('conversionValidity', {
                    rules: [{ type: 'array', required: true, message: '请选择领取期限' }],
                  })(
                    <DatePicker.RangePicker format="YYYY-MM-DD" />
                    )}
                </FormItem>
                <hr />
                {
                  this.state.coupons.map((v, i) =>
                    (
                      <div key={v.id}>
                        <FormItem {...formItemLayout} label="优惠券">
                          {getFieldDecorator(`coupons[${v.id}].coupon`, {
                            rules: [{ required: true, message: '请选择优惠券', whitespace: true, type: 'number' }],
                          })(
                            <Select style={{ width: '286px' }}>
                              {renderCoupons(this.state.baseCoupons)}
                            </Select>
                            )}
                        </FormItem>
                        <FormItem {...formItemLayout} label="使用期限">
                          {getFieldDecorator(`coupons[${v.id}].usingValidity`, {
                            rules: [{ type: 'array', required: true, message: '请选择使用期限' }],
                          })(
                            <DatePicker.RangePicker format="YYYY-MM-DD" style={{ marginRight: '8px' }} />
                            )}
                          {
                            this.state.coupons.length > 1 ? (
                              <Button onClick={() => this.removeCoupon(v.id)}>删除优惠券</Button>
                            ) : null
                          }
                        </FormItem>
                        <hr />
                      </div>
                    ))
                }
                <FormItem {...formButtonLayout}>
                  <Button type="dashed" onClick={this.addCoupon} style={{ width: '100%' }}>
                    <Icon type="plus" /> 新增优惠券
                  </Button>
                </FormItem>
                <FormItem
                  {...formButtonLayout}
                >
                  <Button type="primary" htmlType="submit" className="margin-right">保存</Button>
                  <Button onClick={() => { browserHistory.push('/coupon-receive') }}>取消</Button>
                </FormItem>
              </Form>
            </Spin>
          </div>
        </div>
      </div>
    )
  }
}

export default Form.create()(CouponReceiveAdd)