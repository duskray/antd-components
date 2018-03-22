import { Form, Row, Col, Input, Button, Icon, InputNumber, Spin } from 'antd'
import { formItemLayout, formButtonLayout, ax } from 'utils';
const FormItem = Form.Item

class PointsRules extends React.Component {
  state = {
    loading: false,
  }

  getRules = () => {
    this.setState({
      loading: true
    })
    ax.get(`/system/points-rules`)
    .then(d => {
      this.props.form.setFieldsValue(d)
      this.setState({
        loading: false
      })
    }).catch(_ => {
      this.setState({
        loading: false
      })
    })
  }

  componentDidMount = () => {
    this.getRules()
  }


  handleSubmit = (e) => {
    e.preventDefault()
    this.setState({
      loading: true
    })
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        ax.patch(`/system/points-rules`, values)
        .then(d => {
          this.getRules()
        }).catch(e => {
          this.setState({
            loading: false
          })
        })
      }
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const leftLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    }
    const rightLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    }

    return (
      <div className="content-inner">
        <div className="panel">
          <div className="panel-title">积分规则设置</div>
          <div className="panel-body">
            <Spin spinning={this.state.loading}>
            <Form onSubmit={this.handleSubmit}>
              <Row>
                <Col xs={{span:24}} sm={{span:8}}>
                  <FormItem {...leftLayout}  label={`每充值`} colon={false} >
                    {getFieldDecorator(`charge`, {
                      rules:[{pattern: /^(0|[1-9][0-9]*)?$/, message: '请输入一个正整数'}]           
                    })(
                      <Input addonAfter={'.00'} style={{width: '100%'}} />
                    )}
                  </FormItem>
                </Col>
                <Col xs={{span:24}} sm={{span:16}}>
                  <FormItem {...rightLayout} label={`奖励`} colon={false}>
                    {getFieldDecorator(`chargeReward`, {
                      rules:[{pattern: /^(0|[1-9][0-9]*)?$/, message: '请输入一个正整数'}]           
                    })(
                      <Input  />
                    )}
                  </FormItem>
                </Col>
              </Row>

              <Row>
                <Col xs={{span:24}} sm={{span:8}}>
                  <FormItem {...leftLayout}  label={`每消费`} colon={false} >
                    {getFieldDecorator(`pay`, {
                      rules:[{pattern: /^(0|[1-9][0-9]*)?$/, message: '请输入一个正整数'}]           
                    })(
                      <Input addonAfter={'.00'} style={{width: '100%'}} />
                    )}
                  </FormItem>
                </Col>
                <Col xs={{span:24}} sm={{span:16}}>
                  <FormItem {...rightLayout} label={`奖励`} colon={false}>
                    {getFieldDecorator(`payReward`, {
                      rules:[{pattern: /^(0|[1-9][0-9]*)?$/, message: '请输入一个正整数'}]           
                    })(
                      <Input  />
                    )}
                  </FormItem>
                </Col>
              </Row>

              <FormItem {...formItemLayout}  label={`购买会员奖励`} colon={false} >
                {getFieldDecorator(`memberReward`, {
                  rules:[{pattern: /^(0|[1-9][0-9]*)?$/, message: '请输入一个正整数'}]           
                })(
                  <Input  />
                )}
              </FormItem>
              <FormItem {...formItemLayout}  label={`注册奖励`} colon={false} >
                {getFieldDecorator(`registerReward`, {
                  rules:[{pattern: /^(0|[1-9][0-9]*)?$/, message: '请输入一个正整数'}]           
                })(
                  <Input  />
                )}
              </FormItem>
              <FormItem {...formItemLayout}  label={`评价奖励`} colon={false} >
                {getFieldDecorator(`commentReward`, {
                  rules:[{pattern: /^(0|[1-9][0-9]*)?$/, message: '请输入一个正整数'}]           
                })(
                  <Input  />
                )}
              </FormItem>

              <hr />
              <FormItem {...formButtonLayout}>
                <Button type="primary" htmlType="submit" className="margin-right">保存</Button>
              </FormItem>
            </Form>
            </Spin>
          </div>
        </div>
      </div>
    )
  }
}


export default Form.create()(PointsRules)
